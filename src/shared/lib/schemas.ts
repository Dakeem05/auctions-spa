import { z } from 'zod';

export const AuctionTypeSchema = z.enum(['Request', 'Up', 'Down', 'FixPrice', 'Unknown']);
export const AuctionStatusSchema = z.enum([
  'Planning', 'Auction', 'DeterminateWinner', 'WaitDeal',
  'InProgress', 'Finished', 'Stopped', 'Canceled', 'Unknown',
]);

export const AuctionFiltersSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  per_page: z.coerce.number().int().min(1).max(100).catch(10),
  cargo_num: z.string().optional().catch(undefined),
  status: AuctionStatusSchema.optional().catch(undefined),
  auc_type: AuctionTypeSchema.optional().catch(undefined),
  load_city: z.coerce.number().int().optional().catch(undefined),
  unload_city: z.coerce.number().int().optional().catch(undefined),
  load_date_from: z.string().optional().catch(undefined),
  load_date_to: z.string().optional().catch(undefined),
  is_available: z
    .string()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined))
    .optional()
    .catch(undefined),
  is_bidder: z
    .string()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined))
    .optional()
    .catch(undefined),
  price_from: z.coerce.number().optional().catch(undefined),
  price_to: z.coerce.number().optional().catch(undefined),
});

export type AuctionFilters = z.infer<typeof AuctionFiltersSchema>;

export const createBetSchema = (opts: {
  min?: number | null;
  max?: number | null;
  step?: number | null;
}) =>
  z.object({
    price: z
      .number({ message: 'Введите цену' })
      .positive('Цена должна быть больше 0')
      .refine(
        (v) => opts.min == null || v >= opts.min,
        { message: `Минимальная цена: ${opts.min ?? 0}` },
      )
      .refine(
        (v) => opts.max == null || v <= opts.max,
        { message: `Максимальная цена: ${opts.max}` },
      )
      .refine(
        (v) => opts.step == null || v % opts.step === 0,
        { message: `Цена должна быть кратна ${opts.step}` },
      ),
  });

export type BetFormValues = { price: number };
