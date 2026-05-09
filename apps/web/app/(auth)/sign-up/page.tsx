import { Metadata } from 'next';
import { SignupForm } from '@/auth/components/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up | Iskommerce',
  description: 'Create your Iskommerce account',
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
