import fetch from 'node-fetch';

async function testAudiencePreview() {
  const testRules = {
    operator: 'AND',
    rules: [
      {
        id: '1',
        metric: 'totalSpend',
        operator: 'gt',
        value: 100
      }
    ],
    groups: []
  };

  try {
    const response = await fetch('http://localhost:3010/api/audience/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rules: testRules }),
    });

    const data = await response.json();
    console.log('Audience Preview Response:', data);
  } catch (error) {
    console.error('Error testing audience preview:', error);
  }
}

testAudiencePreview(); 