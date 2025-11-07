/**
 * MAIA Voice Prosody Demo
 *
 * Shows before/after text shaping for different elements
 */

import { TextPostProcessor } from './TextPostProcessor';
import { ProsodyEngine } from './ProsodyEngine';
import type { Element, SpeechAct } from './ProsodyEngine';

interface DemoExample {
  original: string;
  element: Element;
  speechAct: SpeechAct;
  arousal: number;
}

const examples: DemoExample[] = [
  {
    original: "What if you let yourself feel the full power of this moment?",
    element: 'Fire',
    speechAct: 'invite',
    arousal: 0.8
  },
  {
    original: "Notice how the feeling moves through you, like water finding its course.",
    element: 'Water',
    speechAct: 'reflect',
    arousal: 0.3
  },
  {
    original: "You have everything you need, right here, right now.",
    element: 'Earth',
    speechAct: 'affirm',
    arousal: 0.3
  },
  {
    original: "There is a deeper wisdom unfolding through this experience.",
    element: 'Aether',
    speechAct: 'reflect',
    arousal: 0.2
  },
  {
    original: "Sometimes the thing we're most afraid of is exactly the thing that will set us free. Not because fear is wrong, but because it points to what matters most.",
    element: 'Fire',
    speechAct: 'reframe',
    arousal: 0.7
  }
];

console.log('\n🎭 MAIA VOICE PROSODY TRANSFORMATION DEMO\n');
console.log('━'.repeat(80));

for (const example of examples) {
  const prosody = ProsodyEngine.generateParameters(
    example.element,
    example.speechAct,
    { valence: 0.5, arousal: example.arousal },
    example.original
  );

  const preview = TextPostProcessor.preview(
    example.original,
    {
      element: example.element,
      arousal: example.arousal,
      valence: 0.5,
      intent: example.speechAct
    },
    prosody
  );

  console.log(`\n📝 EXAMPLE: ${example.element} / ${example.speechAct}`);
  console.log(`   Arousal: ${example.arousal}`);
  console.log(`   Speaking Rate: ${prosody.rate} WPM`);
  console.log(`   Purposeful Silence: ${prosody.pauseProfile.purposefulMs}ms`);

  console.log(`\n   BEFORE:`);
  console.log(`   "${preview.original}"`);

  console.log(`\n   AFTER:`);
  console.log(`   "${preview.shaped}"`);

  console.log(`\n   DELIVERY NOTE FOR ALLOY:`);
  console.log(`   ${preview.deliveryNote}`);

  console.log(`\n   CHANGES APPLIED:`);
  preview.changes.forEach(change => {
    console.log(`   ✓ ${change}`);
  });

  console.log('\n' + '─'.repeat(80));
}

console.log('\n✅ Text shaping is now active in VoiceGenerationService!');
console.log('   MAIA will automatically shape text based on element and speech act.');
console.log('\n🎙️ Next: Awaiting prosodyHead.ts and VoiceProsodyPreview modules\n');
