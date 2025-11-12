import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  '912876421869-l5ol5i0hti4c8cbk66vrlo356ulbploc.apps.googleusercontent.com',
  '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',
  'http://localhost:3000/api/auth/google/callback'
);

oauth2Client.setCredentials({
  refresh_token: '1//05Ck7B54esuWcCgYIARAAGAUSNwF-L9IrMsyUG3UAiyG-rbfZEyBbTrLhd4gxCie2VL4NPLIR1npyGGAe-SMm2a3eux1-tSDSHTU',
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

try {
  console.log('🐘 Creating GANESHA test event in soullab1@gmail.com calendar...\n');

  // Get account info first
  const calList = await calendar.calendarList.list();
  console.log('📅 Calendar account:', calList.data.items?.find(c => c.primary)?.id || 'Unknown');

  // Create event for today at 3pm
  const now = new Date();
  const startTime = new Date(now);
  startTime.setHours(15, 0, 0, 0); // 3:00 PM today

  const endTime = new Date(startTime);
  endTime.setMinutes(30); // 3:30 PM today

  const event = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: '🐘 GANESHA is LIVE!',
      description: '✨ SUCCESS! GANESHA Calendar Integration is working!\n\n🎉 This event was created in your soullab1@gmail.com calendar.\n\nGANESHA can now help you:\n• Break down overwhelming tasks into micro-steps\n• Schedule focus blocks for deep work\n• Create ADHD-friendly reminders\n• Turn Divine Harmonics into calendar reality\n\nYour attention is sacred. Your time is precious. 🌺',
      start: {
        dateTime: startTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone: 'America/Los_Angeles',
      },
      colorId: '9', // Blue
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 5 },
        ],
      },
    },
  });

  console.log('\n✅ Event created successfully!');
  console.log('   Title:', event.data.summary);
  console.log('   Start:', new Date(event.data.start.dateTime).toLocaleString());
  console.log('   Calendar:', calList.data.items?.find(c => c.primary)?.id);
  console.log('   Event Link:', event.data.htmlLink);
  console.log('\n🎉 Check your soullab1@gmail.com calendar at 3:00 PM today!');

} catch (error) {
  console.error('\n❌ Error:', error.message);
  if (error.response) {
    console.error('Response:', JSON.stringify(error.response.data, null, 2));
  }
}
