// frontend

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        The page you were looking for doesn&apos;t exist or may have moved.
      </p>
      <a href="/" className="underline">
        Return to MAIA home
      </a>
    </div>
  );
}