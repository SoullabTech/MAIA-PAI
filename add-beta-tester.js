/**
 * Quick script to add Jacob Mense to beta testers
 */

const fetch = require('node-fetch');

async function addBetaTester() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/beta-testers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Jacob Mense',
        email: 'jacobmense@gmail.com',
        notes: 'Added via admin request',
        accessLevel: 'standard'
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Successfully added Jacob Mense to beta testers!');
      console.log('Tester ID:', data.id);
      console.log('Email:', data.email);
      console.log('Status:', data.status);
    } else {
      console.error('❌ Error:', data.error);
    }
  } catch (error) {
    console.error('❌ Failed to add beta tester:', error.message);
  }
}

addBetaTester();
