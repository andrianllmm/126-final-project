import { AboutPage } from '@/content/about/about-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Iskommerce',
  description: 'Learn more about Iskommerce',
};

export default function About() {
  return <AboutPage />;
}
