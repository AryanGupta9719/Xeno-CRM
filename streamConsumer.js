import Redis from 'ioredis';
import mongoose from 'mongoose';
import { Customer } from './models/Customer';
import { Order } from './models/Order';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-crm', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const CUSTOMER_STREAM = 'customer-stream';
const ORDER_STREAM = 'order-stream';
const CUSTOMER_GROUP = 'customer-processor';
const ORDER_GROUP = 'order-processor';

async function initializeConsumerGroups() {
  try {
    await redis.xgroup('CREATE', CUSTOMER_STREAM, CUSTOMER_GROUP, '0', 'MKSTREAM');
  } catch (error) {
    if (!error.message.includes('BUSYGROUP')) {
      console.error('Error creating customer consumer group:', error);
    }
  }

  try {
    await redis.xgroup('CREATE', ORDER_STREAM, ORDER_GROUP, '0', 'MKSTREAM');
  } catch (error) {
    if (!error.message.includes('BUSYGROUP')) {
      console.error('Error creating order consumer group:', error);
    }
  }
}

async function processCustomerMessage(message) {
  try {
    const customerData = JSON.parse(message[1][1]);
    
    const existingCustomer = await Customer.findOne({ email: customerData.email });
    if (existingCustomer) {
      console.log(`Customer with email ${customerData.email} already exists`);
      return true;
    }

    const customer = new Customer(customerData);
    await customer.save();
    console.log(`Processed customer: ${customer.email}`);
    return true;
  } catch (error) {
    console.error('Error processing customer message:', error);
    return false;
  }
}

async function processOrderMessage(message) {
  try {
    const orderData = JSON.parse(message[1][1]);
    
    const customer = await Customer.findOne({ email: orderData.customerEmail });
    if (!customer) {
      console.error(`Customer not found for order: ${orderData.customerEmail}`);
      return false;
    }

    const order = new Order(orderData);
    await order.save();

    customer.totalSpend += orderData.amount;
    await customer.save();
    
    console.log(`Processed order: ${order.id}`);
    return true;
  } catch (error) {
    console.error('Error processing order message:', error);
    return false;
  }
}

async function processStream(stream, group, processor) {
  try {
    const messages = await redis.xreadgroup(
      'GROUP', group, 'consumer-1',
      'COUNT', 1,
      'BLOCK', 2000,
      'STREAMS', stream, '>'
    );

    if (!messages) return;

    for (const [streamName, streamMessages] of messages) {
      for (const message of streamMessages) {
        const success = await processor(message);
        if (success) {
          await redis.xack(streamName, group, message[0]);
        } else {
          await redis.xadd(`${streamName}-dlq`, '*', 'message', message[1][1]);
          await redis.xack(streamName, group, message[0]);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${stream}:`, error);
  }
}

async function startProcessing() {
  await initializeConsumerGroups();

  while (true) {
    await processStream(CUSTOMER_STREAM, CUSTOMER_GROUP, processCustomerMessage);
    await processStream(ORDER_STREAM, ORDER_GROUP, processOrderMessage);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

process.on('SIGTERM', async () => {
  console.log('Shutting down...');
  await redis.quit();
  await mongoose.connection.close();
  process.exit(0);
});

startProcessing().catch(console.error); 