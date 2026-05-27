import { Pattern } from '@/features/listings/components/listing-form/listing-stepper';
import { AuthRouteGuard } from '@/features/auth/components/auth-route-guard';

export default function Page() {
  return (
    <AuthRouteGuard>
      <div className="min-h-screen bg-background py-8">
        <Pattern />
      </div>
    </AuthRouteGuard>
  );
}
