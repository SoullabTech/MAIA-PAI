import { PhiBreathTimer } from '@/components/meditation/PhiBreathTimer';

export const metadata = {
  title: 'Phi Breath Meditation | MAIA PAI',
  description: 'Sacred breathing practice in golden ratio proportion. Experience the toroidal breath of consciousness.',
};

/**
 * Phi Breath Meditation Page
 *
 * A living practice of the golden ratio breath pattern:
 * - Expansion (yang): 1.618s
 * - Pause (syzygy): 1.000s
 * - Contraction (yin): 1.000s
 * - Seed (zero point): 0.618s
 *
 * Total cycle: 4.236s (φ³)
 *
 * This is the natural rhythm of consciousness expanding and returning to itself.
 */
export default function BreathPage() {
  return <PhiBreathTimer />;
}
