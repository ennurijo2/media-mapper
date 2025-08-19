export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 min-h-screen bg-white">
      <div className="max-w-4xl prose prose-sm lg:prose-lg prose-h1:font-bold prose-h1:tracking-tight prose-p:text-slate-700 prose-p:leading-relaxed">
        {children}
      </div>
    </section>
  );
}
