import { Link } from '@tanstack/react-router';
import type { AuctionListItem } from '../../shared/types/api.types';
import { Badge } from '../../shared/ui/badge.component';
import {
  formatPrice,
  formatDate,
  AUC_TYPE_LABELS,
  STATUS_LABELS,
  TRADING_STATUS_LABELS,
} from '../../shared/lib/formatters';
import { clsx } from 'clsx';

interface AuctionCardProps {
  auction: AuctionListItem;
  onPrefetch?: () => void;
}

const statusVariant = (status: string) => {
  if (status === 'Auction') return 'success';
  if (status === 'Finished' || status === 'Canceled') return 'muted';
  if (status === 'Planning') return 'info';
  return 'warning';
};

const tradingVariant = (status: string) => {
  if (status === 'Leading' || status === 'Winner') return 'success';
  if (status === 'Losing') return 'danger';
  if (status === 'NotParticipating') return 'muted';
  return 'warning';
};

export function AuctionCard({ auction, onPrefetch }: AuctionCardProps) {
  const { main, route, cargo, trading, organizer } = auction;

  return (
    <Link
      to="/auctions/$uuid"
      params={{ uuid: main.order_uid }}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
      className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-mono">#{main.cargo_num}</span>
          <Badge variant="default">{AUC_TYPE_LABELS[main.auc_type] ?? main.auc_type}</Badge>
          <Badge variant={statusVariant(trading.status)}>
            {STATUS_LABELS[trading.status] ?? trading.status}
          </Badge>
          {trading.your.bet && (
            <Badge variant="info">Моя ставка</Badge>
          )}
        </div>
        <Badge variant={tradingVariant(trading.status_mobile)} className="shrink-0">
          {TRADING_STATUS_LABELS[trading.status_mobile] ?? trading.status_mobile}
        </Badge>
      </div>

      {/* Organizer */}
      {!organizer.is_hide_organization && (
        <p className="text-xs text-gray-500 mb-2">{organizer.organization_name}</p>
      )}

      {/* Route */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-800 mb-3">
        <span>{route.load.city}</span>
        <span className="text-gray-400">→</span>
        <span>{route.unload.city}</span>
      </div>

      {/* Dates */}
      <div className="flex gap-4 text-xs text-gray-500 mb-3">
        <span>Погрузка: {formatDate(route.load.date)}</span>
        <span>Выгрузка: {formatDate(route.unload.date)}</span>
      </div>

      {/* Cargo */}
      <div className="text-xs text-gray-600 mb-3">
        {cargo.name} · {cargo.weight} т · {cargo.volume} м³ · {cargo.body_type}
      </div>

      {/* Price + Action */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div>
          <div className="text-lg font-bold text-gray-900">
            {formatPrice(trading.price.current)}
          </div>
          {trading.price_per_km && (
            <div className="text-xs text-gray-400">
              {formatPrice(trading.price_per_km)} / км
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {trading.can_set_bet ? (
            <Link
              to="/auctions/$uuid/bets/new"
              params={{ uuid: main.order_uid }}
              onClick={(e) => e.stopPropagation()}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-lg font-medium transition-colors',
                trading.your.bet
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700',
              )}
            >
              {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
            </Link>
          ) : (
            <Link
              to="/auctions/$uuid/bets"
              params={{ uuid: main.order_uid }}
              onClick={(e) => e.stopPropagation()}
              className="px-3 py-1.5 text-sm rounded-lg font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Смотреть ставки
            </Link>
          )}
        </div>
      </div>
    </Link>
  );
}
