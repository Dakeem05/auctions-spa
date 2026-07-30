import { http, HttpResponse, delay } from 'msw';
import { seedAuctions, seedDetails, betsStore, applyBet } from './store';
import type { AuctionListRequest } from '../types/api.types';

export const handlers = [
  // POST /api/v1/auctions/list
  http.post('/api/v1/auctions/list', async ({ request }) => {
    await delay(400);
    const body = (await request.json().catch(() => ({}))) as AuctionListRequest;

    let results = [...seedAuctions];

    // Apply filters
    if (body.cargo_num) {
      results = results.filter((a) =>
        a.main.cargo_num.includes(body.cargo_num!),
      );
    }
    if (body.status) {
      results = results.filter((a) => a.trading.status === body.status);
    }
    if (body.statuses?.length) {
      results = results.filter((a) => body.statuses!.includes(a.trading.status));
    }
    if (body.auc_type) {
      results = results.filter((a) => a.main.auc_type === body.auc_type);
    }
    if (body.load_city) {
      results = results.filter((a) => a.route.load.city_gc_id === body.load_city);
    }
    if (body.unload_city) {
      results = results.filter((a) => a.route.unload.city_gc_id === body.unload_city);
    }
    if (body.is_available != null) {
      results = results.filter((a) => a.trading.is_available === body.is_available);
    }
    if (body.is_bidder != null) {
      results = results.filter((a) => a.trading.is_bidder === body.is_bidder);
    }
    if (body.price_from != null) {
      results = results.filter((a) => a.trading.price.current >= body.price_from!);
    }
    if (body.price_to != null) {
      results = results.filter((a) => a.trading.price.current <= body.price_to!);
    }
    if (body.load_date_from) {
      results = results.filter(
        (a) => new Date(a.route.load.date) >= new Date(body.load_date_from!),
      );
    }
    if (body.load_date_to) {
      results = results.filter(
        (a) => new Date(a.route.load.date) <= new Date(body.load_date_to!),
      );
    }

    // Pagination
    const page = body.page ?? 1;
    const per_page = body.per_page ?? 10;
    const total = results.length;
    const last_page = Math.ceil(total / per_page);
    const from = (page - 1) * per_page;
    const to = Math.min(from + per_page, total);
    const data = results.slice(from, to);

    return HttpResponse.json({
      data,
      meta: { current_page: page, from: from + 1, last_page, per_page, to, total },
    });
  }),

  // GET /api/v1/auctions/:uuid
  http.get('/api/v1/auctions/:uuid', async ({ params }) => {
    await delay(300);
    const detail = seedDetails[params.uuid as string];
    if (!detail) {
      return HttpResponse.json(
        { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
        { status: 404 },
      );
    }
    return HttpResponse.json(detail);
  }),

  // GET /api/v1/auctions/:uuid/bets
  http.get('/api/v1/auctions/:uuid/bets', async ({ params }) => {
    await delay(300);
    const uuid = params.uuid as string;
    const detail = seedDetails[uuid];
    if (!detail) {
      return HttpResponse.json(
        { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ bets: betsStore[uuid] ?? [] });
  }),

  // POST /api/v1/auctions/:uuid/bets
  http.post('/api/v1/auctions/:uuid/bets', async ({ params, request }) => {
    await delay(500);
    const uuid = params.uuid as string;
    const detail = seedDetails[uuid];

    if (!detail) {
      return HttpResponse.json(
        { code: 'resource_not_found', title: 'Не найдено', message: 'Аукцион не найден' },
        { status: 404 },
      );
    }

    if (!detail.trading.can_set_bet) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Ставка недоступна',
          errors: [{ field: 'price', message: 'Ставка недоступна для этого аукциона', code: 'forbidden' }],
        },
        { status: 422 },
      );
    }

    const body = (await request.json()) as { price: number };

    const { min, max, step } = detail.trading.price;

    if (!body.price || body.price <= 0) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: 'Цена должна быть больше 0', code: 'min_value' }],
        },
        { status: 422 },
      );
    }

    if (min != null && body.price < min) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: `Цена не может быть ниже ${min}`, code: 'min_value' }],
        },
        { status: 422 },
      );
    }

    if (max != null && body.price > max) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: `Цена не может быть выше ${max}`, code: 'max_value' }],
        },
        { status: 422 },
      );
    }

    if (step != null && (body.price % step !== 0)) {
      return HttpResponse.json(
        {
          code: 'validation_failed',
          title: 'Ошибка валидации',
          message: 'Запрос содержит некорректные поля.',
          errors: [{ field: 'price', message: `Цена должна быть кратна ${step}`, code: 'step_value' }],
        },
        { status: 422 },
      );
    }

    applyBet(uuid, body.price);

    return HttpResponse.json({ success: true });
  }),
];
