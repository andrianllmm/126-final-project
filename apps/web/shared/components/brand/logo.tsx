import * as React from 'react';
import { cn } from '@/shared/lib/utils';

type LogoProps = React.SVGProps<SVGSVGElement> & {
  className?: string;
  size?: number | string;
};

export function Logo({ className, size = 24, ...props }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      width={size}
      height={size}
      className={cn('text-foreground', 'w-auto h-auto', className)}
      fill="currentColor"
      role="img"
      aria-label="Logo"
      {...props}
    >
      <path d="M342.73,932.05c48.37,48.37,130.29-24.1,74.87-76.92-54.47-51.91-120.49,31.3-74.87,76.92ZM722.75,839.72c-54.09,10.39-58.84,96.78-.76,105.79,91.04,14.12,79.14-120.84.76-105.79Z" />
      <polygon points="205.62 308.36 1024 308.36 982.88 415.28 250.86 415.28 281.7 489.3 949.98 489.3 832.11 776.51 282.25 776.62 238.52 670.25 758.75 670.25 789.59 596.23 205.62 596.23 0 82.17 113.09 82.17 205.62 308.36" />
      <path d="M342.73,932.05c-45.62-45.62,20.4-128.83,74.87-76.92,55.42,52.82-26.5,125.3-74.87,76.92Z" />
      <path d="M722.75,839.72c78.39-15.05,90.28,119.91-.76,105.79-58.08-9.01-53.33-95.4.76-105.79Z" />
    </svg>
  );
}
