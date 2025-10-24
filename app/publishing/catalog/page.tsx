import BookCatalog from '@/components/BookCatalog';

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <BookCatalog />
      </div>
    </div>
  );
}
