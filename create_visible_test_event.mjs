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
  console.log('Creating visible GANESHA test event...\n');

  // Create event for today at 2pm
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(14, 0, 0, 0); // 2:00 PM today

  const endTime = new Date(startTime);
  endTime.setHours(15, 0, 0, 0); // 3:00 PM today

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: '🐘✨ GANESHA Calendar Integration Test',
      description: '🎉 SUCCESS! GANESHA is now connected to your Google Calendar!\n\nThis test event proves that:\n✅ OAuth authentication is working\n✅ Calendar API is configured correctly\n✅ GANESHA can create real calendar events\n✅ Events appear in your Gmail calendar\n\nYou can now use GANESHA to:\n🐘 Schedule tasks with ADHD-friendly micro-steps\n⚡ Create focus blocks for deep work\n🎯 Set up recurring reminders\n🌟 Break down overwhelming projects into bite-sized actions\n\nWelcome to Divine Harmonics scheduling! 🌺',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      colorId: '9', // Blue color
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
        ],
      },
    },
  });

  console.log('✅ Event created successfully!');
  console.log('   Title:', event.data.summary);
  console.log('   Start:', new Date(event.data.start.dateTime).toLocaleString());
  console.log('   End:', new Date(event.data.end.dateTime).toLocaleString());
  console.log('   Event ID:', event.data.id);
  console.log('   Link:', event.data.htmlLink);
  console.log('\n🎉 Check your calendar - you should see it at 2:00 PM today!');

} catch (error) {
  console.error('❌ Error:', error.message);
  if (error.response) {
    console.error('Response:', error.response.data);
  }
}
