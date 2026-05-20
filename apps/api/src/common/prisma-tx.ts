import { TransactionClient } from '../generated/prisma/internal/prismaNamespace.js';

export type PrismaTx = Omit<
  TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction'
>;
