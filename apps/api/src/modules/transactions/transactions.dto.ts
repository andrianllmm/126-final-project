import { createZodDto } from 'nestjs-zod';
import {
  acceptTransactionResponseSchema,
  cancelTransactionSchema,
  completeTransactionResponseSchema,
  createTransactionSchema,
  rejectTransactionResponseSchema,
  transactionListSchema,
  transactionListingSchema,
  transactionQuerySchema,
  transactionSchema,
  transactionUserSchema,
  updateTransactionStatusSchema,
} from '@repo/api';

export class TransactionListingDto extends createZodDto(
  transactionListingSchema,
) {}

export class TransactionUserDto extends createZodDto(transactionUserSchema) {}

export class TransactionDto extends createZodDto(transactionSchema, {
  codec: true,
}) {}

export class TransactionListDto extends createZodDto(transactionListSchema, {
  codec: true,
}) {}

export class CreateTransactionDto extends createZodDto(
  createTransactionSchema,
) {}

export class UpdateTransactionStatusDto extends createZodDto(
  updateTransactionStatusSchema,
) {}

export class TransactionQueryDto extends createZodDto(transactionQuerySchema) {}

export class AcceptTransactionResponseDto extends createZodDto(
  acceptTransactionResponseSchema,
  {
    codec: true,
  },
) {}

export class RejectTransactionResponseDto extends createZodDto(
  rejectTransactionResponseSchema,
  {
    codec: true,
  },
) {}

export class CompleteTransactionResponseDto extends createZodDto(
  completeTransactionResponseSchema,
  {
    codec: true,
  },
) {}

export class CancelTransactionDto extends createZodDto(
  cancelTransactionSchema,
) {}
