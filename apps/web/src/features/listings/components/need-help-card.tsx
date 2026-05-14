import { Card } from '@/shared/components/ui/card';

export function NeedHelpCard() {
  return (
    <Card className="border border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">❓</span>
          <h3 className="text-lg font-semibold text-foreground">Need Help?</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Check out our safety guidelines for in-person campus meetups.
        </p>
        <button className="text-sm font-medium text-foreground hover:underline">
          View Safety Tips →
        </button>
      </div>
    </Card>
  );
}
