import { redirect } from 'next/navigation';

/**
 * DEPRECATED: /maya route
 * Server-side redirect to /maia (Claude Code enhanced version)
 */
export default function MayaRedirectPage() {
  redirect('/maia');
}
