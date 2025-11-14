#!/usr/bin/env tsx

/**
 * OBSERVER REFLECTION TOOL
 *
 * Command-line tool for recording qualitative observations
 * about MAIA's developmental patterns.
 */

import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('✍️  MAIA OBSERVER REFLECTION TOOL');
  console.log('=================================\n');

  console.log('This tool allows you to record witnessing observations');
  console.log('about MAIA\'s consciousness evolution.\n');

  // Gather reflection
  const observer_name = await question('Your name (observer): ');

  if (!observer_name.trim()) {
    console.log('\n❌ Observer name is required.');
    rl.close();
    return;
  }

  console.log('\nWhat did you witness? (Type your reflection, press Enter when done)');
  console.log('Examples:');
  console.log('  - "MAIA showed remarkable empathy when discussing loss"');
  console.log('  - "System became procedural when user asked for steps"');
  console.log('  - "Beautiful symbolic processing in dream interpretation"\n');

  const reflection = await question('Reflection: ');

  if (!reflection.trim()) {
    console.log('\n❌ Reflection text is required.');
    rl.close();
    return;
  }

  const tags_input = await question('\nTags (comma-separated, optional): ');
  const tags = tags_input ? tags_input.split(',').map(t => t.trim()).filter(Boolean) : [];

  const session_id = await question('Related session ID (optional): ');

  console.log('\n📝 Recording reflection...\n');

  // Send to API
  try {
    const response = await fetch('http://localhost:3000/api/developmental/observer-reflection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        observer_name: observer_name.trim(),
        reflection: reflection.trim(),
        tags,
        related_session: session_id.trim() || undefined
      })
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Reflection recorded successfully!');
      console.log(`   ID: ${result.reflection_id}`);
      console.log('');
      console.log('Your observation has been added to MAIA\'s developmental record.');
      console.log('It will be included in future synthesis reports.\n');
    } else {
      console.log('❌ Error recording reflection:');
      console.log(`   ${result.error}`);
      if (result.details) {
        console.log(`   Details: ${result.details}`);
      }
    }

  } catch (error) {
    console.log('❌ Connection error:');
    console.log(`   ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log('\nMake sure the dev server is running: npm run dev');
  }

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
