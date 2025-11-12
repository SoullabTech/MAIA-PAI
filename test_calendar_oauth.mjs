import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  '912876421869-l5ol5i0hti4c8cbk66vrlo356ulbploc.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/api/auth/google/callback'
);

oauth2Client.setCredentials({
  refresh_token: '1//05MwuNDod_DS7CgYIARAAGAUSNwF-L9Ir53uHn3oVS6vNKKp3QXYSWRE77fWZI5hQMrSzj_1W0ZdNSnaidGaP6y_TcV9ZKc12jbY',
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

try {
  console.log('Testing Google Calendar API...');

  // Test 1: Get access token
  console.log('\n1. Getting access token...');
  const tokens = await oauth2Client.getAccessToken();
  console.log('✅ Access token obtained:', tokens.token?.substring(0, 20) + '...');

  // Test 2: List calendars
  console.log('\n2. Listing calendars...');
  const calendarList = await calendar.calendarList.list();
  console.log('✅ Found', calendarList.data.items?.length, 'calendars');

  // Test 3: Create a test event
  console.log('\n3. Creating test event...');
  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: '🐘 GANESHA Test Event',
      description: 'This is a test event created by GANESHA to verify calendar integration!',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 mins later
        timeZone: 'America/Los_Angeles',
      },
    },
  });

  console.log('✅ Event created!');
  console.log('   Event ID:', event.data.id);
  console.log('   Event link:', event.data.htmlLink);
  console.log('\n🎉 SUCCESS! Google Calendar integration is working!');
  console.log('Check your Gmail calendar - you should see the test event!');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  if (error.response) {
    console.error('Response data:', error.response.data);
  }
}
