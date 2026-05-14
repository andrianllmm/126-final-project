import { Card } from '@/shared/components/ui/card';

export function SellerTipsCard() {
  return (
    <Card className="border border-border">
      <div className="p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-sm">💡</span>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
            Seller Tips
          </h3>
        </div>
        <div className="space-y-2.5 text-xs text-muted-foreground">
          <div className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">01.</span>
            <p>
              Be honest about the condition of your item to build trust with
              buyers.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">02.</span>
            <p>
              Take photos in natural daylight for the most accurate
              representation.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="font-semibold text-foreground shrink-0">03.</span>
            <p>
              Research similar listings to price your item competitively for
              quick sales.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
