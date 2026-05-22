'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '@/features/auth/hooks/use-auth';

import { Transaction, TransactionAction, TransactionStatus } from '@repo/api';

import { useUserTransactions } from '@/features/transactions/hooks/use-user-transactions';
import { useUpdateTransactionStatus } from '@/features/transactions/hooks/use-update-transaction-status';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Badge } from '@/shared/components/ui/badge';
import { toast } from 'sonner';

import { TransactionList } from '@/features/transactions/components/transaction-list';
import { TransactionActionDialog } from '@/features/transactions/components/transaction-action-dialog';
import { TransactionStatusBadge } from '@/features/transactions/components/transaction-status-badge';

type TabType = 'buying' | 'selling';
type StatusFilter = TransactionStatus | 'all';

const DEFAULT_TAB: TabType = 'buying';
const DEFAULT_STATUS: StatusFilter = 'all';

function useTransactionsUrlState() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = (searchParams.get('tab') as TabType | null) ?? DEFAULT_TAB;

  const status =
    (searchParams.get('status') as StatusFilter | null) ?? DEFAULT_STATUS;

  const setParams = (next: Partial<{ tab: TabType; status: StatusFilter }>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (next.tab) params.set('tab', next.tab);
    if (next.status) params.set('status', next.status);

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return { tab, status, setParams };
}

export default function TransactionsPage() {
  const { user } = useAuth();
  const { tab, status, setParams } = useTransactionsUrlState();

  const [dialog, setDialog] = useState<{
    open: boolean;
    action: TransactionAction | null;
    transaction: Transaction | null;
  }>({
    open: false,
    action: null,
    transaction: null,
  });

  const { data: transactionList, isLoading } = useUserTransactions();
  const updateStatus = useUpdateTransactionStatus();

  if (!user) return null;

  const allTransactions = transactionList?.data ?? [];

  const buyingTransactions = allTransactions.filter(
    (t) => t.buyerId === user.id,
  );

  const sellingTransactions = allTransactions.filter(
    (t) => t.sellerId === user.id,
  );

  const filterByStatus = (txns: Transaction[]) =>
    status === 'all' ? txns : txns.filter((t) => t.status === status);

  const handleAction = (transactionId: string, action: TransactionAction) => {
    const transaction = allTransactions.find(
      (t) => t.transactionId === transactionId,
    );

    if (!transaction) return;

    setDialog({ open: true, action, transaction });
  };

  const handleConfirm = (reason?: string) => {
    if (!dialog.transaction || !dialog.action) return;

    updateStatus.mutate(
      {
        id: dialog.transaction.transactionId,
        action: dialog.action,
        ...(dialog.action === 'cancel' ? { reason } : {}),
      },
      {
        onSuccess: () => {
          toast.success('Transaction updated');
          setDialog({ open: false, action: null, transaction: null });
        },
        onError: () => toast.error('Failed to update transaction'),
      },
    );
  };

  return (
    <>
      <div className="container max-w-6xl py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Transactions
          </h1>
          <p className="text-muted-foreground">
            Manage your purchases and sales
          </p>
        </div>

        <Tabs
          value={tab}
          onValueChange={(v) => setParams({ tab: v as TabType })}
        >
          <div className="mb-6 flex items-center justify-between">
            <TabsList variant="line">
              <TabsTrigger value="buying">
                Buying{' '}
                <Badge variant="outline" className="rounded-full">
                  {buyingTransactions.length}
                </Badge>
              </TabsTrigger>

              <TabsTrigger value="selling">
                Selling{' '}
                <Badge variant="outline" className="rounded-full">
                  {sellingTransactions.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <Select
              value={status}
              onValueChange={(v) => setParams({ status: v as StatusFilter })}
            >
              <SelectTrigger className="w-fit border-0 shadow-none">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                {Object.values(TransactionStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    <TransactionStatusBadge status={s} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Skeleton className="h-16 w-16 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <TabsContent value="buying" className="mt-0">
                <TransactionList
                  transactions={filterByStatus(buyingTransactions)}
                  userRole="buyer"
                  onAction={handleAction}
                  emptyMessage="No purchase requests yet"
                />
              </TabsContent>

              <TabsContent value="selling" className="mt-0">
                <TransactionList
                  transactions={filterByStatus(sellingTransactions)}
                  userRole="seller"
                  onAction={handleAction}
                  emptyMessage="No sale requests yet"
                />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {dialog.transaction && dialog.action && (
        <TransactionActionDialog
          open={dialog.open}
          onOpenChange={(open) =>
            setDialog({ open, action: null, transaction: null })
          }
          transaction={dialog.transaction}
          action={dialog.action}
          onConfirm={handleConfirm}
          isPending={updateStatus.isPending}
        />
      )}
    </>
  );
}
