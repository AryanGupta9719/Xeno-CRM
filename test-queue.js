import fetch from 'node-fetch';
import { getQueueSize } from './lib/deliveryQueue.js';
import { connectDB } from './lib/db.js';
import { Campaign } from './models/Campaign.js';
import { CommunicationLog } from './models/CommunicationLog.js';

const API_URL = 'http://localhost:3000';

// Test data
const testUsers = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Bob Johnson' },
  { id: 'user4', name: 'Alice Brown' },
  { id: 'user5', name: 'Charlie Wilson' },
  { id: 'user6', name: 'David Lee' },
  { id: 'user7', name: 'Emma Davis' },
  { id: 'user8', name: 'Frank Miller' },
];

const testCampaigns = [
  { id: 'campaign123', name: 'Test Campaign 1' },
  { id: 'campaign456', name: 'Test Campaign 2' },
];

const testMessages = [
  'Hello! This is a test message.',
  'Welcome to our platform!',
  'Check out our latest features.',
  'Special offer just for you!',
  'Don\'t miss out on our updates.',
  'New features are available!',
  'Your account has been updated.',
  'Important announcement!',
];

// Send a single message
async function sendMessage(user, campaign, message) {
  try {
    const response = await fetch(`${API_URL}/api/vendor/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        campaignId: campaign.id,
        message,
      }),
    });

    const data = await response.json();
    console.log(`[${user.name}] Campaign: ${campaign.name} - Status: ${data.status}`);
    return data;
  } catch (error) {
    console.error(`Error sending message to ${user.name}:`, error.message);
    return null;
  }
}

// Verify database updates
async function verifyDatabaseUpdates() {
  console.log('\nVerifying database updates...');
  
  try {
    await connectDB();

    // Check communication logs
    const logs = await CommunicationLog.find({
      campaignId: { $in: testCampaigns.map(c => c.id) }
    });

    console.log('\nCommunication Logs:');
    console.log('------------------');
    for (const campaign of testCampaigns) {
      const campaignLogs = logs.filter(log => log.campaignId === campaign.id);
      const sentCount = campaignLogs.filter(log => log.status === 'SENT').length;
      const failedCount = campaignLogs.filter(log => log.status === 'FAILED').length;
      
      console.log(`\nCampaign: ${campaign.name}`);
      console.log(`Total logs: ${campaignLogs.length}`);
      console.log(`Sent: ${sentCount}`);
      console.log(`Failed: ${failedCount}`);
    }

    // Check campaign stats
    console.log('\nCampaign Stats:');
    console.log('--------------');
    for (const campaign of testCampaigns) {
      const campaignDoc = await Campaign.findById(campaign.id);
      if (campaignDoc) {
        console.log(`\nCampaign: ${campaign.name}`);
        console.log(`Sent: ${campaignDoc.deliveryStats?.sent || 0}`);
        console.log(`Failed: ${campaignDoc.deliveryStats?.failed || 0}`);
      } else {
        console.log(`\nCampaign ${campaign.name} not found in database`);
      }
    }
  } catch (error) {
    console.error('Error verifying database updates:', error);
  }
}

// Send messages in parallel
async function sendMessagesInParallel() {
  console.log('Starting parallel message sending...\n');
  
  const promises = [];
  for (const user of testUsers) {
    for (const campaign of testCampaigns) {
      const message = testMessages[Math.floor(Math.random() * testMessages.length)];
      promises.push(sendMessage(user, campaign, message));
    }
  }

  await Promise.all(promises);
  
  console.log('\nAll messages sent!');
  console.log(`Current queue size: ${getQueueSize()}`);
}

// Wait for batch processing
async function waitForBatchProcessing() {
  console.log('\nWaiting for batch processing...');
  
  // Wait for 15 seconds to ensure batch processing completes
  await new Promise(resolve => setTimeout(resolve, 15000));
  
  console.log(`Final queue size: ${getQueueSize()}`);
}

// Run the test
async function runTest() {
  console.log('=== Queue System Test ===\n');
  console.log(`Testing with ${testUsers.length} users and ${testCampaigns.length} campaigns\n`);
  
  await sendMessagesInParallel();
  await waitForBatchProcessing();
  await verifyDatabaseUpdates();
  
  console.log('\nTest completed!');
}

runTest().catch(console.error); 