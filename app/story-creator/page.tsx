'use client';

import { SacredStoryCreator } from '@/components/wisdom/SacredStoryCreator';

export default function StoryCreatorPage() {
  const handleGenerate = (config: any) => {
    console.log('Story Config:', config);
    // TODO: Connect to story generation API
    alert(`Generating story with:\nTradition: ${config.tradition}\nLength: ${config.length}`);
  };

  return <SacredStoryCreator onGenerate={handleGenerate} />;
}
