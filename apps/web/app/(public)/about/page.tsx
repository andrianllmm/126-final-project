import { Metadata } from 'next';
import { AboutPage } from '@/content/about/about-page';

export const metadata: Metadata = {
  title: 'About Iskommerce',
  description: 'Learn more about Iskommerce',
};

export default function About() {
  return <AboutPage />;
}
