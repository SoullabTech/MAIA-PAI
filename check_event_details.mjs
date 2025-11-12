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
  console.log('📅 Checking calendar and event details...\n');

  // 1. List all calendars
  console.log('1️⃣ Your calendars:');
  const calendarList = await calendar.calendarList.list();
  calendarList.data.items?.forEach((cal, i) => {
    console.log(`   ${i + 1}. ${cal.summary} (${cal.id})`);
    console.log(`      Primary: ${cal.primary || false}, Selected: ${cal.selected || false}`);
  });

  // 2. Get the specific event we created
  console.log('\n2️⃣ Looking for GANESHA event (ID: ajik7oq4hhqdu8t2f4k0ebk9io)...');
  try {
    const event = await calendar.events.get({
      calendarId: 'primary',
      eventId: 'ajik7oq4hhqdu8t2f4k0ebk9io',
    });

    console.log('\n✅ Found the event!');
    console.log('   Title:', event.data.summary);
    console.log('   Start:', event.data.start?.dateTime || event.data.start?.date);
    console.log('   End:', event.data.end?.dateTime || event.data.end?.date);
    console.log('   Status:', event.data.status);
    console.log('   Calendar:', 'primary');
    console.log('   Link:', event.data.htmlLink);
  } catch (err) {
    console.log('❌ Event not found:', err.message);
  }

  // 3. List ALL events in primary calendar (next 30 days)
  console.log('\n3️⃣ All events in primary calendar (next 30 days):');
  const allEvents = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    maxResults: 50,
    singleEvents: true,
    orderBy: 'startTime',
  });

  if (allEvents.data.items?.length === 0) {
    console.log('   No events found in primary calendar');
  } else {
    allEvents.data.items?.forEach((event, i) => {
      const start = event.start?.dateTime || event.start?.date;
      console.log(`   ${i + 1}. ${event.summary} - ${new Date(start).toLocaleString()}`);
      if (event.summary?.includes('GANESHA')) {
        console.log('      👆 THIS IS THE GANESHA EVENT!');
      }
    });
  }

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
}
