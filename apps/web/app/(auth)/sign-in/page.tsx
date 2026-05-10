import { Metadata } from 'next';
import { SignInForm } from '@/features/auth/components/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In | Iskommerce',
  description: 'Sign in to your Iskommerce account',
};

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
