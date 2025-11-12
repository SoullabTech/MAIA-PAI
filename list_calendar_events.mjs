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
  console.log('📅 Fetching recent calendar events...\n');

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
    timeMax: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Next 7 days
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = response.data.items;

  if (!events || events.length === 0) {
    console.log('No events found in the specified time range.');
  } else {
    console.log(`Found ${events.length} events:\n`);
    events.forEach((event, i) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`${i + 1}. ${event.summary}`);
      console.log(`   📅 ${new Date(start).toLocaleString()}`);
      console.log(`   🔗 ${event.htmlLink}`);
      if (event.description) {
        console.log(`   📝 ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}`);
      }
      console.log('');
    });
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
}
