import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Iskommerce',
  description: 'Learn more about Iskommerce',
};

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <section className="space-y-2">
        <h1 className="text-2xl font-semibold">Iskommerce</h1>
        <p className="text-muted-foreground">
          University of the Philippines Visayas marketplace
        </p>
      </section>

      <section className="space-y-4">
        <p>
          Iskommerce is a closed-campus, student-to-student ecommerce
          marketplace for University of the Philippines Visayas.
        </p>

        <p>
          It enables students to buy and sell items within a trusted university
          community using UPV-verified accounts.
        </p>
      </section>
    </div>
  );
}
