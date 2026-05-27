import { Card } from '@/shared/components/ui/card';
import { HelpCircle } from 'lucide-react';

export function NeedHelpCard() {
  return (
    <Card>
      <div className="px-6 py-2">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="size-5 text-primary" />
          <h3 className="text-lg font-semibold">Need Help?</h3>
        </div>

        <div className="space-y-5">
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm mt-0.5">
                Check out our safety guidelines for in-person campus meetups.
              </p>
            </div>
          </div>
        </div>

        <button className="mt-5 text-sm font-bold hover:opacity-70 transition-opacity">
          View Safety Tips
        </button>
      </div>
    </Card>
  );
}
