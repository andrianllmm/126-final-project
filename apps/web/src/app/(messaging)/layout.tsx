export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
