<<<<<<< HEAD
import { Pattern } from '@/features/listings/components/listing-form/listing-stepper';
=======
import { ListingForm } from '@/features/listings/components/listing-form';
>>>>>>> main
import { AuthRouteGuard } from '@/features/auth/components/auth-route-guard';

export default function Page() {
  return (
    <AuthRouteGuard>
      <div className="page-container py-8">
        <ListingForm />
      </div>
    </AuthRouteGuard>
  );
}
