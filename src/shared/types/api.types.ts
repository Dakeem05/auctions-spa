// ─── Enums ────────────────────────────────────────────────────────────────────

export type AuctionType = 'Request' | 'Up' | 'Down' | 'FixPrice' | 'Unknown';

export type AuctionStatus =
  | 'Planning'
  | 'Auction'
  | 'DeterminateWinner'
  | 'WaitDeal'
  | 'InProgress'
  | 'Finished'
  | 'Stopped'
  | 'Canceled'
  | 'Unknown';

export type TradingStatus =
  | 'NotParticipating'
  | 'Leading'
  | 'Losing'
  | 'Winner'
  | 'Confirmed'
  | 'OnPending'
  | 'ChoosingWinner'
  | 'Accepted'
  | 'Unknown';

export type BidMeasurementType = 'PerRoute' | 'PerKm' | 'Unknown';

export type OperationType = 'Loading' | 'Unloading' | 'Unknown';

export type PaymentDelayType = 'CalendarDays' | 'WorkDays' | 'Unknown' | null;

// ─── Auction List ─────────────────────────────────────────────────────────────

export interface AuctionListItemMain {
  id: number;
  cargo_num: string;
  cargo_date: string;
  auc_type: AuctionType;
  order_uid: string;
  status: AuctionStatus;
}

export interface AuctionListItemOrganizer {
  subscriber_id: number;
  organization_id: number;
  organization_name: string;
  organization_inn: string;
  organization_kpp: string;
  is_hide_organization: boolean;
}

export interface AuctionListItemRoutePoint {
  city: string;
  address: string;
  date: string;
  city_gc_id: number;
  points_count: number;
}

export interface AuctionListItemRoute {
  load: AuctionListItemRoutePoint;
  unload: AuctionListItemRoutePoint;
}

export interface AuctionListItemCargo {
  name: string;
  weight: number;
  volume: number;
  body_type: string;
  truck_count: number;
  is_cargo: boolean;
  is_international: boolean | null;
}

export interface AuctionListItemTradingPrice {
  start: number;
  current: number;
  current_no_vat: number;
}

export interface AuctionListItemTradingYour {
  bet: boolean;
  last_bet: number | null;
}

export interface AuctionListItemTrading {
  status: AuctionStatus;
  status_mobile: TradingStatus;
  start_time: string;
  stop_time: string;
  bid_measurement_type: BidMeasurementType;
  can_set_bet: boolean;
  price: AuctionListItemTradingPrice;
  price_per_km: number | null;
  step: number | null;
  your: AuctionListItemTradingYour;
  is_available: boolean;
  is_bidder: boolean;
}

export interface AuctionListItemPayment {
  form: string;
  currency_code: string;
  consignor: string | null;
  consignee: string | null;
}

export interface AuctionListItem {
  main: AuctionListItemMain;
  organizer: AuctionListItemOrganizer;
  route: AuctionListItemRoute;
  cargo: AuctionListItemCargo;
  trading: AuctionListItemTrading;
  payment: AuctionListItemPayment;
}

export interface AuctionListMeta {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
}

export interface AuctionListResponse {
  data: AuctionListItem[];
  meta: AuctionListMeta;
}

// ─── Auction List Request ─────────────────────────────────────────────────────

export interface AuctionListRequest {
  page?: number;
  per_page?: number;
  is_oldest?: boolean | null;
  cargo_num?: string | null;
  status?: AuctionStatus | null;
  statuses?: AuctionStatus[] | null;
  auc_type?: AuctionType | null;
  load_city?: number | null;
  unload_city?: number | null;
  load_date_from?: string | null;
  load_date_to?: string | null;
  is_available?: boolean | null;
  is_bidder?: boolean | null;
  price_from?: number | null;
  price_to?: number | null;
}

// ─── Auction Detail ───────────────────────────────────────────────────────────

export interface AuctionShowMain {
  id: number;
  cargo_num: string;
  cargo_date: string;
  order_uid: string;
  auc_type: AuctionType;
  created_at: string;
}

export interface AuctionShowOrganizer {
  subscriber_id: number;
  subscriber_code: string;
  infobase_code: string;
  organization_name: string;
  organization_inn: string;
  organization_kpp: string;
  organization_id: number;
}

export interface Contact {
  name: string | null;
  phone: string | null;
  work_phone: string | null;
  uid: string | null;
  email: string | null;
}

export interface AuctionShowCargo {
  price: string;
  currency: number | null;
  is_international: boolean;
  distance: number | null;
  truck_count: number;
  body_type: string;
  temp_from: number | null;
  temp_to: number | null;
  weight: number;
  volume: number;
  name: string;
}

export interface AuctionShowTradingPrice {
  start: number | null;
  start_no_vat: number | null;
  current: number | null;
  current_no_vat: number | null;
  available: number | null;
  available_no_vat: number | null;
  min: number | null;
  max: number | null;
  step: number | null;
}

export interface AuctionShowTradingYour {
  bet: boolean;
  last_bet: number | null;
  last_bet_with_vat: number | null;
  win: boolean;
}

export interface AuctionShowTradingSettings {
  prolong_after_bet: number | null;
  winner_confirm: number | null;
  winner_counter_mode: number | null;
  transmission_time_in: number | null;
  coefficient: number | null;
}

export interface AuctionShowTrading {
  status: AuctionStatus;
  status_mobile: TradingStatus;
  start_time: string;
  stop_time: string;
  bid_measurement_type: BidMeasurementType;
  can_set_bet: boolean;
  allow_counter_bets: boolean;
  hide_bets_history: boolean;
  hide_places: boolean;
  hide_points_address_and_contacts: boolean;
  no_view_cargo_price: boolean;
  price: AuctionShowTradingPrice;
  price_per_km: number | null;
  your: AuctionShowTradingYour;
  settings: AuctionShowTradingSettings;
}

export interface AuctionShowPayment {
  condition: string | null;
  condition_predefined: string | null;
  form: string;
  delay: number | null;
  delay_type: PaymentDelayType;
  currency_code: string;
  prepay: string | null;
}

export interface RoutePointLocation {
  city_name: string;
  city_full_name: string;
  city_gc_id: number;
  loading_address: string;
  lon: number;
  lat: number;
}

export interface RoutePointCargo {
  name: string;
  weight: string;
  volume: string;
  oversized: boolean;
}

export interface RoutePointContact {
  name: string;
  phone: string;
}

export interface RoutePoint {
  row_num: number;
  op_type: OperationType;
  start_date: string;
  end_date: string;
  comment: string | null;
  contractor: string;
  contractor_inn: string;
  location: RoutePointLocation;
  cargo: RoutePointCargo;
  contact: RoutePointContact;
}

export interface Assembly {
  num: string | null;
  date: string | null;
}

export interface AdmittedOrganization {
  id: number;
  inn: string;
  is_main: boolean;
  name: string;
  full_name: string;
  subscriber_id: number;
  subscriber_code: string;
}

export interface AuctionShowResponse {
  main: AuctionShowMain;
  organizer: AuctionShowOrganizer;
  contacts: Contact[];
  cargo: AuctionShowCargo;
  trading: AuctionShowTrading;
  payment: AuctionShowPayment;
  assembly: Assembly;
  routes: RoutePoint[];
  admitted_organizations: AdmittedOrganization[];
}

// ─── Bets ────────────────────────────────────────────────────────────────────

export interface BetItemPriceInfo {
  price_with_vat: number | null;
  price_no_vat: number | null;
  payment_type: string | null;
  vat_rate: string | null;
}

export interface BetItem {
  id: number;
  created_at: string;
  auction_id: number;
  subscriber_id: number;
  contact_name: string;
  contact_phone: string;
  place: number | null;
  is_winner: boolean;
  is_canceled: boolean;
  cancel_reason: string | null;
  price_info: BetItemPriceInfo;
  organization_name: string | null;
}

export interface BetListResponse {
  bets: BetItem[];
}

// ─── Set Bet ──────────────────────────────────────────────────────────────────

export interface SetBetRequest {
  price: number;
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export interface ValidationError {
  field: string;
  message: string;
  code: string | null;
}

export interface ProblemDetail {
  code: string;
  title: string;
  message: string;
  trace_id?: string | null;
}

export interface ValidationProblem extends ProblemDetail {
  errors: ValidationError[];
}
