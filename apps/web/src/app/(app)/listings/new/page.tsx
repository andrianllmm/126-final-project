import { ListingForm } from '@/features/listings/components/listing-form';
import { AuthRouteGuard } from '@/features/auth/components/auth-route-guard';

export default function Page() {
  return (
    <AuthRouteGuard>
      <div className="min-h-screen bg-background py-8">
        <ListingForm />
      </div>
    </AuthRouteGuard>
  );
}
