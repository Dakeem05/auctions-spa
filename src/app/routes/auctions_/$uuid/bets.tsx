import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { auctionsApi } from '../../../../shared/api/auctions.api';
import { auctionKeys } from '../../../../shared/api/query-keys';
import { Badge } from '../../../../shared/ui/badge.component';
import { Skeleton } from '../../../../shared/ui/skeleton.component';
import { formatPrice, formatDateTime } from '../../../../shared/lib/formatters';

export const Route = createFileRoute('/auctions_/$uuid/bets')({
  component: BetsPage,
});

function BetsPage() {
  const { uuid } = Route.useParams();

  const { data: detail } = useQuery({
    queryKey: auctionKeys.detail(uuid),
    queryFn: () => auctionsApi.detail(uuid),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: auctionKeys.bets(uuid),
    queryFn: () => auctionsApi.bets(uuid),
    enabled: !detail?.trading.hide_bets_history,
  });

  if (detail?.trading.hide_bets_history) {
    return (
      <div className="space-y-4">
        <BetsHeader uuid={uuid} />
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-700 font-medium">История ставок скрыта организатором</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <BetsHeader uuid={uuid} />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-4">
        <BetsHeader uuid={uuid} />
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600">Не удалось загрузить ставки</p>
        </div>
      </div>
    );
  }

  const activeBets = data.bets.filter((b) => !b.is_canceled);
  const uniqueParticipants = new Set(data.bets.map((b) => b.subscriber_id)).size;

  return (
    <div className="space-y-4">
      <BetsHeader uuid={uuid} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">История ставок</h2>
        <p className="text-sm text-gray-500">Участников: {uniqueParticipants}</p>
      </div>

      {data.bets.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500">Ставок пока нет</p>
          <p className="text-gray-400 text-sm mt-1">Будьте первым!</p>
        </div>
      )}

      {data.bets.length > 0 && (
        <div className="space-y-2">
          {data.bets.map((bet) => (
            <div
              key={bet.id}
              className={`bg-white border rounded-lg p-4 ${
                bet.is_canceled
                  ? 'border-gray-100 opacity-60'
                  : bet.is_winner
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {bet.place != null && (
                      <span className="text-xs font-bold text-gray-400">#{bet.place}</span>
                    )}
                    <p className="font-medium text-gray-800 text-sm">{bet.contact_name}</p>
                    {bet.organization_name && (
                      <p className="text-xs text-gray-500">{bet.organization_name}</p>
                    )}
                    {bet.is_winner && <Badge variant="success">Победитель</Badge>}
                    {bet.is_canceled && <Badge variant="muted">Отменена</Badge>}
                  </div>
                  {bet.cancel_reason && (
                    <p className="text-xs text-red-500 mt-0.5">{bet.cancel_reason}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">{formatDateTime(bet.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatPrice(bet.price_info.price_with_vat)}
                    <span className="text-xs font-normal text-gray-400 ml-1">с НДС</span>
                  </p>
                  {bet.price_info.price_no_vat != null && (
                    <p className="text-xs text-gray-500">
                      {formatPrice(bet.price_info.price_no_vat)} без НДС
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">Активных ставок: {activeBets.length}</p>
    </div>
  );
}

function BetsHeader({ uuid }: { uuid: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="hover:text-blue-600">Аукционы</Link>
      <span>/</span>
      <Link to="/auctions/$uuid" params={{ uuid }} className="hover:text-blue-600">
        Аукцион
      </Link>
      <span>/</span>
      <span className="text-gray-800">Ставки</span>
    </div>
  );
}
