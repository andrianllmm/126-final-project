import { Navbar } from '@/shared/components/layout/navbar';
import { Footer } from '@/shared/components/layout/footer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">{children}</main>

      <Footer />
    </div>
  );
}
