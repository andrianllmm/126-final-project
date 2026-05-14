import { Card } from '@/shared/components/ui/card';

export function NeedHelpCard() {
  return (
    <Card className="border border-border">
      <div className="p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground mb-2">
          Need Help?
        </h3>
        <p className="text-xs text-muted-foreground mb-3">
          Check out our safety guidelines for in-person campus meetups.
        </p>
        <button className="text-xs font-semibold text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity">
          View Safety Tips ↗
        </button>
      </div>
    </Card>
  );
}
