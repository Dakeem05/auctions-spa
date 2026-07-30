import type {
  AuctionListItem,
  AuctionShowResponse,
  BetItem,
  TradingStatus,
} from '../types/api.types';

// ─── Cities dictionary ────────────────────────────────────────────────────────

export const CITIES = [
  { id: 59, name: 'Пермь' },
  { id: 77, name: 'Москва' },
  { id: 78, name: 'Санкт-Петербург' },
  { id: 63, name: 'Самара' },
  { id: 66, name: 'Екатеринбург' },
  { id: 54, name: 'Новосибирск' },
  { id: 16, name: 'Казань' },
  { id: 23, name: 'Краснодар' },
];

// ─── Seed auctions ────────────────────────────────────────────────────────────

const makeUuid = (n: number) => `550e8400-e29b-41d4-a716-${String(n).padStart(12, '0')}`;

export const seedAuctions: AuctionListItem[] = Array.from({ length: 40 }, (_, i) => {
  const types = ['Request', 'Up', 'Down', 'FixPrice'] as const;
  const statuses = ['Planning', 'Auction', 'DeterminateWinner', 'Finished'] as const;
  const cargos = ['Мороженое', 'Металл', 'Продукты питания', 'Автозапчасти', 'Стройматериалы'];
  const bodies = ['тентованный', 'рефрижератор', 'бортовой', 'изотермический'];
  const cities = CITIES;

  const loadCity = cities[i % cities.length];
  const unloadCity = cities[(i + 3) % cities.length];
  const price = 15000 + i * 1000;
  const auc_type = types[i % types.length];
  const status = statuses[i % statuses.length];

  return {
    main: {
      id: i + 1,
      cargo_num: String(1000 + i).padStart(11, '0'),
      cargo_date: new Date(Date.now() + i * 86400000).toISOString(),
      auc_type,
      order_uid: makeUuid(i + 1),
      status,
    },
    organizer: {
      subscriber_id: 98,
      organization_id: 340 + i,
      organization_name: `ООО Компания-${i + 1}`,
      organization_inn: `770376918${i % 10}`,
      organization_kpp: '770301001',
      is_hide_organization: i % 7 === 0,
    },
    route: {
      load: {
        city: loadCity.name,
        address: `ул. Транспортная ${i + 1}`,
        date: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
        city_gc_id: loadCity.id,
        points_count: 1,
      },
      unload: {
        city: unloadCity.name,
        address: `ул. Промышленная ${i + 1}`,
        date: new Date(Date.now() + (i + 3) * 86400000).toISOString(),
        city_gc_id: unloadCity.id,
        points_count: 1,
      },
    },
    cargo: {
      name: cargos[i % cargos.length],
      weight: 10 + (i % 10),
      volume: 50 + (i % 30),
      body_type: bodies[i % bodies.length],
      truck_count: 1 + (i % 3),
      is_cargo: true,
      is_international: i % 10 === 0,
    },
    trading: {
      status,
      status_mobile: i % 5 === 0 ? 'Leading' : 'NotParticipating',
      start_time: new Date(Date.now() - 3600000).toISOString(),
      stop_time: new Date(Date.now() + 3600000 * (i + 1)).toISOString(),
      bid_measurement_type: i % 2 === 0 ? 'PerRoute' : 'PerKm',
      can_set_bet: status === 'Auction',
      price: {
        start: price,
        current: price - i * 100,
        current_no_vat: Math.round((price - i * 100) / 1.2),
      },
      price_per_km: i % 2 === 0 ? null : Math.round(price / 1500),
      step: 500,
      your: {
        bet: i % 5 === 0,
        last_bet: i % 5 === 0 ? price - i * 100 - 500 : null,
      },
      is_available: i % 3 !== 0,
      is_bidder: i % 5 === 0,
    },
    payment: {
      form: i % 2 === 0 ? 'Безналичная с НДС' : 'Безналичная без НДС',
      currency_code: '643',
      consignor: null,
      consignee: null,
    },
  };
});

// ─── Detail responses ─────────────────────────────────────────────────────────

export const seedDetails: Record<string, AuctionShowResponse> = Object.fromEntries(
  seedAuctions.map((a) => [
    a.main.order_uid,
    {
      main: {
        id: a.main.id,
        cargo_num: a.main.cargo_num,
        cargo_date: a.main.cargo_date,
        order_uid: a.main.order_uid,
        auc_type: a.main.auc_type,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      organizer: {
        subscriber_id: a.organizer.subscriber_id,
        subscriber_code: '12345',
        infobase_code: 'RU_Cargo_01',
        organization_name: a.organizer.organization_name,
        organization_inn: a.organizer.organization_inn,
        organization_kpp: a.organizer.organization_kpp,
        organization_id: a.organizer.organization_id,
      },
      contacts: a.organizer.is_hide_organization
        ? []
        : [
            {
              name: 'Иванов Иван Иванович',
              phone: '+79001234567',
              work_phone: null,
              uid: makeUuid(a.main.id + 100),
              email: 'ivanov@example.com',
            },
          ],
      cargo: {
        price: '0',
        currency: 643,
        is_international: a.cargo.is_international ?? false,
        distance: 1500,
        truck_count: a.cargo.truck_count,
        body_type: a.cargo.body_type,
        temp_from: null,
        temp_to: null,
        weight: a.cargo.weight,
        volume: a.cargo.volume,
        name: a.cargo.name,
      },
      trading: {
        status: a.trading.status,
        status_mobile: a.trading.status_mobile,
        start_time: a.trading.start_time,
        stop_time: a.trading.stop_time,
        bid_measurement_type: a.trading.bid_measurement_type,
        can_set_bet: a.trading.can_set_bet,
        allow_counter_bets: true,
        hide_bets_history: a.main.id % 4 === 0,
        hide_places: false,
        hide_points_address_and_contacts: a.main.id % 6 === 0,
        no_view_cargo_price: a.main.id % 8 === 0,
        price: {
          start: a.trading.price.start,
          start_no_vat: Math.round(a.trading.price.start / 1.2),
          current: a.trading.price.current,
          current_no_vat: a.trading.price.current_no_vat,
          available: a.trading.price.current - 500,
          available_no_vat: Math.round((a.trading.price.current - 500) / 1.2),
          min: a.trading.price.current - 5000,
          max: a.trading.price.start,
          step: 500,
        },
        price_per_km: a.trading.price_per_km,
        your: {
          bet: a.trading.your.bet,
          last_bet: a.trading.your.last_bet,
          last_bet_with_vat: a.trading.your.last_bet
            ? Math.round(a.trading.your.last_bet * 1.2)
            : null,
          win: a.trading.status_mobile === 'Winner',
        },
        settings: {
          prolong_after_bet: 10,
          winner_confirm: 1,
          winner_counter_mode: null,
          transmission_time_in: 24,
          coefficient: 10,
        },
      },
      payment: {
        condition: 'По оригиналам накладных (ТН, ТТН, CMR)',
        condition_predefined: 'ПоОригиналамНаладных',
        form: a.payment.form,
        delay: 30,
        delay_type: 'CalendarDays',
        currency_code: a.payment.currency_code,
        prepay: '0',
      },
      assembly: { num: null, date: null },
      routes: [
        {
          row_num: 1,
          op_type: 'Loading',
          start_date: a.route.load.date,
          end_date: a.route.load.date,
          comment: null,
          contractor: '',
          contractor_inn: '',
          location: {
            city_name: a.route.load.city,
            city_full_name: `${a.route.load.city}, Россия`,
            city_gc_id: a.route.load.city_gc_id,
            loading_address: a.route.load.address,
            lon: 56.238,
            lat: 58.01,
          },
          cargo: {
            name: a.cargo.name,
            weight: String(a.cargo.weight.toFixed(3)),
            volume: String(a.cargo.volume.toFixed(3)),
            oversized: false,
          },
          contact: { name: '', phone: '' },
        },
        {
          row_num: 2,
          op_type: 'Unloading',
          start_date: a.route.unload.date,
          end_date: a.route.unload.date,
          comment: null,
          contractor: '',
          contractor_inn: '',
          location: {
            city_name: a.route.unload.city,
            city_full_name: `${a.route.unload.city}, Россия`,
            city_gc_id: a.route.unload.city_gc_id,
            loading_address: a.route.unload.address,
            lon: 37.618,
            lat: 55.751,
          },
          cargo: {
            name: a.cargo.name,
            weight: String(a.cargo.weight.toFixed(3)),
            volume: String(a.cargo.volume.toFixed(3)),
            oversized: false,
          },
          contact: { name: '', phone: '' },
        },
      ],
      admitted_organizations: [],
    } satisfies AuctionShowResponse,
  ]),
);

// ─── Bets store (mutable) ─────────────────────────────────────────────────────

export const betsStore: Record<string, BetItem[]> = Object.fromEntries(
  seedAuctions.map((a) => [
    a.main.order_uid,
    a.trading.your.bet
      ? [
          {
            id: a.main.id * 100,
            created_at: new Date(Date.now() - 1800000).toISOString(),
            auction_id: a.main.id,
            subscriber_id: 13,
            contact_name: 'Иванов Иван',
            contact_phone: '+79001234567',
            place: 1,
            is_winner: a.trading.status_mobile === 'Winner',
            is_canceled: false,
            cancel_reason: null,
            price_info: {
              price_with_vat: a.trading.your.last_bet,
              price_no_vat: a.trading.your.last_bet
                ? Math.round(a.trading.your.last_bet / 1.2)
                : null,
              payment_type: a.payment.form,
              vat_rate: '20',
            },
            organization_name: 'ООО Перевозчик',
          },
        ]
      : [],
  ]),
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function applyBet(uuid: string, price: number): void {
  const auction = seedAuctions.find((a) => a.main.order_uid === uuid);
  if (!auction) return;

  const detail = seedDetails[uuid];

  // Update list item
  auction.trading.price.current = price;
  auction.trading.price.current_no_vat = Math.round(price / 1.2);
  auction.trading.your.bet = true;
  auction.trading.your.last_bet = price;
  auction.trading.status_mobile = 'Leading';

  // Update detail
  if (detail) {
    detail.trading.price.current = price;
    detail.trading.price.current_no_vat = Math.round(price / 1.2);
    detail.trading.price.available = price - (detail.trading.price.step ?? 500);
    detail.trading.your.bet = true;
    detail.trading.your.last_bet = price;
    detail.trading.your.last_bet_with_vat = Math.round(price * 1.2);
    detail.trading.status_mobile = 'Leading';
  }

  // Add to bets store
  const existing = betsStore[uuid] ?? [];
  const newBet: BetItem = {
    id: Date.now(),
    created_at: new Date().toISOString(),
    auction_id: auction.main.id,
    subscriber_id: 13,
    contact_name: 'Иванов Иван',
    contact_phone: '+79001234567',
    place: 1,
    is_winner: false,
    is_canceled: false,
    cancel_reason: null,
    price_info: {
      price_with_vat: price,
      price_no_vat: Math.round(price / 1.2),
      payment_type: auction.payment.form,
      vat_rate: '20',
    },
    organization_name: 'ООО Перевозчик',
  };

  // Demote previous bets to place 2
  betsStore[uuid] = [newBet, ...existing.map((b) => ({ ...b, place: (b.place ?? 1) + 1 }))];
}

export function getTradingStatusLabel(status: TradingStatus): string {
  const map: Record<TradingStatus, string> = {
    NotParticipating: 'Не участвует',
    Leading: 'Лидирует',
    Losing: 'Перебит',
    Winner: 'Победитель',
    Confirmed: 'Подтверждён',
    OnPending: 'На рассмотрении',
    ChoosingWinner: 'Выбор победителя',
    Accepted: 'Принято',
    Unknown: 'Неизвестно',
  };
  return map[status] ?? status;
}
