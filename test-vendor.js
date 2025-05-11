import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000';

// Test data
const testUsers = [
  { id: 'user1', name: 'John Doe' },
  { id: 'user2', name: 'Jane Smith' },
  { id: 'user3', name: 'Bob Johnson' },
  { id: 'user4', name: 'Alice Brown' },
  { id: 'user5', name: 'Charlie Wilson' },
];

const testCampaign = {
  id: 'campaign123',
  name: 'Test Campaign',
};

const testMessages = [
  'Hello! This is a test message.',
  'Welcome to our platform!',
  'Check out our latest features.',
  'Special offer just for you!',
  'Don\'t miss out on our updates.',
];

// Statistics tracking
const stats = {
  total: 0,
  sent: 0,
  failed: 0,
  totalDelay: 0,
};

// Simulate sending messages to users
async function sendTestMessages() {
  console.log('Starting message delivery simulation...\n');
  console.log(`Testing with ${testUsers.length} users and ${testMessages.length} different messages\n`);

  const startTime = Date.now();

  for (const user of testUsers) {
    const message = testMessages[Math.floor(Math.random() * testMessages.length)];
    
    console.log(`Sending message to ${user.name} (${user.id})...`);
    console.log(`Message: "${message}"`);
    
    const messageStartTime = Date.now();
    
    try {
      const response = await fetch(`${API_URL}/api/vendor/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          campaignId: testCampaign.id,
          message,
        }),
      });

      const data = await response.json();
      const messageDelay = Date.now() - messageStartTime;
      
      stats.total++;
      stats.totalDelay += messageDelay;
      
      if (data.status === 'SENT') {
        stats.sent++;
      } else {
        stats.failed++;
      }
      
      console.log(`Status: ${data.status}`);
      console.log(`Message: ${data.message}`);
      console.log(`Delivery time: ${messageDelay}ms\n`);
    } catch (error) {
      stats.total++;
      stats.failed++;
      console.error(`Error sending message to ${user.name}:`, error.message);
    }

    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const totalTime = Date.now() - startTime;
  
  console.log('Message delivery simulation completed!');
  console.log('\nDelivery Statistics:');
  console.log('-------------------');
  console.log(`Total messages: ${stats.total}`);
  console.log(`Successfully sent: ${stats.sent} (${((stats.sent/stats.total)*100).toFixed(1)}%)`);
  console.log(`Failed: ${stats.failed} (${((stats.failed/stats.total)*100).toFixed(1)}%)`);
  console.log(`Average delivery time: ${(stats.totalDelay/stats.total).toFixed(0)}ms`);
  console.log(`Total test duration: ${totalTime}ms`);
}

// Run the test
sendTestMessages().catch(console.error); 