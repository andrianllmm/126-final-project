import { Card } from '@/shared/components/ui/card';
import { Sun, Camera, ShieldAlert, Wallpaper, Aperture } from 'lucide-react';

const guidelines = [
  {
    icon: Sun,
    title: 'Use natural lighting',
    description: 'Avoid too dim or flashy or from for better',
  },
  {
    icon: Camera,
    title: 'Capture multiple angles',
    description: 'Show the front, back, sides of your item',
  },
  {
    icon: ShieldAlert,
    title: 'Show defects clearly',
    description: 'Any damage, marks or stains must be visible',
  },
  {
    icon: Wallpaper,
    title: 'Ensure background is clean',
    description: 'Use a plain, neutral background to highlight the product',
  },
];

export function PhotoGuidelines() {
  return (
    <Card>
      <div className="px-6 py-2">
        <div className="flex items-center gap-2 mb-6">
          <Aperture className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">
            Photo Guidelines
          </h3>
        </div>

        <div className="space-y-5">
          {guidelines.map((guideline) => {
            const Icon = guideline.icon;
            return (
              <div key={guideline.title} className="flex gap-3">
                <div className="shrink-0">
                  <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {guideline.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {guideline.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
