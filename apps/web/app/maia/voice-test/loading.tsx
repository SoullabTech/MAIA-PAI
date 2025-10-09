export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-gold-amber/30 border-t-gold-divine rounded-full animate-spin mb-4" />
        <p className="text-gold-amber">Loading Maia Voice Chat...</p>
      </div>
    </div>
  );
}
