import { Card } from '@/shared/components/ui/card';
import { Lightbulb } from 'lucide-react';

const tips = [
  {
    number: '01.',
    description:
      'Be honest about the condition of your item to build trust with buyers.',
  },
  {
    number: '02.',
    description:
      'Take photos in natural daylight for the most accurate representation.',
  },
  {
    number: '03.',
    description:
      'Research similar listings to price your item competitively for quick sales.',
  },
];

export function SellerTipsCard() {
  return (
    <Card>
      <div className="px-6 py-2">
        <div className="flex items-center gap-2 mb-6">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold ">Seller Tips</h3>
        </div>

        <div className="space-y-5">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-3">
              <div className="shrink-0">
                <span className="font-bold text-sm mt-0.5 block">
                  {tip.number}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm mt-0.5">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
