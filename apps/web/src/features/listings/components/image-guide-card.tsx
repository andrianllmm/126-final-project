import { Card } from '@/shared/components/ui/card';
import { CheckCircle2, Camera, Eye, AlertCircle } from 'lucide-react';

const guidelines = [
  {
    icon: CheckCircle2,
    title: 'Use natural lighting',
    description: 'Avoid too dim or flashy or from for better',
  },
  {
    icon: Camera,
    title: 'Capture multiple angles',
    description: 'Show the front, back, sides of your item',
  },
  {
    icon: Eye,
    title: 'Show defects clearly',
    description: 'Any damage, marks or stains must be visible',
  },
  {
    icon: AlertCircle,
    title: 'Ensure background is clean',
    description: 'Use a plain, neutral background to highlight the product',
  },
];

export function PhotoGuidelines() {
  return (
    <Card className="p-6 bg-card border-rose-200 dark:border-rose-900">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">!</span>
        </div>
        <h3 className="text-lg font-semibold text-card-foreground">
          Photo Guidelines
        </h3>
      </div>

      <div className="space-y-5">
        {guidelines.map((guideline, index) => {
          const Icon = guideline.icon;
          return (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0">
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

      <div className="mt-6 pt-6 border-t border-border">
        <div className="w-full h-40 bg-muted rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop"
            alt="Example product photo"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
}
