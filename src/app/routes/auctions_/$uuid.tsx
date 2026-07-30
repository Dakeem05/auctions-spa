import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { auctionsApi } from '../../../shared/api/auctions.api';
import { auctionKeys } from '../../../shared/api/query-keys';
import { Badge } from '../../../shared/ui/badge.component';
import { Skeleton } from '../../../shared/ui/skeleton.component';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  AUC_TYPE_LABELS,
  STATUS_LABELS,
  TRADING_STATUS_LABELS,
} from '../../../shared/lib/formatters';

export const Route = createFileRoute('/auctions_/$uuid')({
  component: AuctionDetailPage,
});

function AuctionDetailPage() {
  const { uuid } = Route.useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: auctionKeys.detail(uuid),
    queryFn: () => auctionsApi.detail(uuid),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-600 font-medium">Аукцион не найден</p>
        <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  const { main, organizer, contacts, cargo, trading, payment, routes } = data;
  const hideContacts = trading.hide_points_address_and_contacts;
  const hideCargoPrice = trading.no_view_cargo_price;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="hover:text-blue-600">Аукционы</Link>
        <span>/</span>
        <span className="text-gray-800">#{main.cargo_num}</span>
      </div>

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Заявка #{main.cargo_num}</h1>
            <p className="text-sm text-gray-500 mt-1">Создан: {formatDateTime(main.created_at)}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">{AUC_TYPE_LABELS[main.auc_type] ?? main.auc_type}</Badge>
            <Badge variant="info">{STATUS_LABELS[trading.status] ?? trading.status}</Badge>
            <Badge variant="success">
              {TRADING_STATUS_LABELS[trading.status_mobile] ?? trading.status_mobile}
            </Badge>
          </div>
        </div>

        {/* Primary actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {trading.can_set_bet ? (
            <Link
              to="/auctions/$uuid/bets/new"
              params={{ uuid }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 font-medium"
            >
              {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
            </Link>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-100 text-gray-400 text-sm rounded-lg font-medium cursor-not-allowed"
            >
              Ставка недоступна
            </button>
          )}
          {!trading.hide_bets_history && (
            <Link
              to="/auctions/$uuid/bets"
              params={{ uuid }}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 font-medium"
            >
              История ставок
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Organizer */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Организатор</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Компания" value={organizer.organization_name} />
            <Row label="ИНН" value={organizer.organization_inn} />
            <Row label="КПП" value={organizer.organization_kpp} />
            <Row label="Код" value={organizer.subscriber_code} />
          </dl>

          {!hideContacts && contacts.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs font-medium text-gray-500 mb-2">Контакты</p>
              {contacts.map((c, i) => (
                <div key={i} className="text-sm space-y-0.5">
                  {c.name && <p className="text-gray-700">{c.name}</p>}
                  {c.phone && <p className="text-blue-600">{c.phone}</p>}
                  {c.email && <p className="text-gray-500">{c.email}</p>}
                </div>
              ))}
            </div>
          )}

          {hideContacts && (
            <p className="text-xs text-gray-400 mt-2">Контакты скрыты организатором</p>
          )}
        </div>

        {/* Trading */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Параметры торгов</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Начало" value={formatDateTime(trading.start_time)} />
            <Row label="Конец" value={formatDateTime(trading.stop_time)} />
            <Row label="Измерение ставки" value={trading.bid_measurement_type === 'PerRoute' ? 'За рейс' : 'За км'} />
            <Row label="Начальная цена" value={formatPrice(trading.price.start)} />
            <Row label="Текущая цена" value={formatPrice(trading.price.current)} />
            <Row label="Доступная цена" value={formatPrice(trading.price.available)} />
            {trading.price.min != null && (
              <Row label="Мин. цена" value={formatPrice(trading.price.min)} />
            )}
            {trading.price.max != null && (
              <Row label="Макс. цена" value={formatPrice(trading.price.max)} />
            )}
            {trading.price.step != null && (
              <Row label="Шаг ставки" value={formatPrice(trading.price.step)} />
            )}
          </dl>

          {trading.your.bet && (
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              <p className="text-xs font-medium text-gray-500">Моя ставка</p>
              <p className="text-sm font-bold text-blue-600">
                {formatPrice(trading.your.last_bet_with_vat)} (с НДС)
              </p>
              <p className="text-xs text-gray-500">
                {formatPrice(trading.your.last_bet)} (без НДС)
              </p>
            </div>
          )}
        </div>

        {/* Cargo */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Груз</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Наименование" value={cargo.name} />
            <Row label="Тип кузова" value={cargo.body_type} />
            <Row label="Вес" value={`${cargo.weight} т`} />
            <Row label="Объём" value={`${cargo.volume} м³`} />
            <Row label="Кол-во ТС" value={String(cargo.truck_count)} />
            {!hideCargoPrice && (
              <Row label="Стоимость груза" value={formatPrice(Number(cargo.price))} />
            )}
            {cargo.distance && (
              <Row label="Расстояние" value={`${cargo.distance} км`} />
            )}
            {cargo.is_international && (
              <Row label="Тип" value="Международная перевозка" />
            )}
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="font-semibold text-gray-800 mb-3">Условия оплаты</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Форма оплаты" value={payment.form} />
            {payment.condition && <Row label="Условие" value={payment.condition} />}
            {payment.delay != null && (
              <Row
                label="Отсрочка"
                value={`${payment.delay} ${payment.delay_type === 'WorkDays' ? 'рабочих дней' : 'кал. дней'}`}
              />
            )}
            {payment.prepay && Number(payment.prepay) > 0 && (
              <Row label="Предоплата" value={`${payment.prepay} %`} />
            )}
          </dl>
        </div>
      </div>

      {/* Route points */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="font-semibold text-gray-800 mb-3">Маршрут</h2>
        <div className="space-y-3">
          {routes.map((point, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    point.op_type === 'Loading' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {point.op_type === 'Loading' ? 'П' : 'В'}
                </div>
                {i < routes.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                )}
              </div>
              <div className="pb-3">
                <p className="font-medium text-gray-800">{point.location.city_name}</p>
                {!hideContacts && (
                  <p className="text-sm text-gray-500">{point.location.loading_address}</p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(point.start_date)} — {formatDate(point.end_date)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {point.cargo.name} · {point.cargo.weight} т · {point.cargo.volume} м³
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <dt className="text-gray-500 shrink-0">{label}</dt>
      <dd className="text-gray-800 text-right">{value || '—'}</dd>
    </div>
  );
}
