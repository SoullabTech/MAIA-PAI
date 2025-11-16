'use client';

import { useState } from 'react';
import OracleConversation from '@/components/OracleConversation';

export default function Page() {
  const [showLabTools, setShowLabTools] = useState(false);

  return (
    <div className="min-h-screen">
      <OracleConversation onOpenLabTools={() => setShowLabTools(!showLabTools)} />
    </div>
  );
}