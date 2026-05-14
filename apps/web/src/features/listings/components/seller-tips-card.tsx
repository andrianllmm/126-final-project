import { Card } from '@/shared/components/ui/card';

export function SellerTipsCard() {
  return (
    <Card className="border border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💡</span>
          <h3 className="text-lg font-semibold text-foreground">Seller Tips</h3>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <span className="font-semibold text-foreground min-w-6">01.</span>
            <p>
              Be honest about the condition of your product to build trust with
              buyers
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-foreground min-w-6">02.</span>
            <p>
              Take photos in natural daylight for the most accurate
              representation
            </p>
          </div>
          <div className="flex gap-3">
            <span className="font-semibold text-foreground min-w-6">03.</span>
            <p>Include related information to drive buyer interest</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
