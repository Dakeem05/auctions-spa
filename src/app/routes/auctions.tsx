import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AuctionFiltersSchema, type AuctionFilters } from '../../shared/lib/schemas';
import { auctionsApi } from '../../shared/api/auctions.api';
import { auctionKeys } from '../../shared/api/query-keys';
import { AuctionCard } from '../../widgets/auction-card/auction-card.component';
import { AuctionFilters as AuctionFiltersWidget } from '../../widgets/auction-filters/auction-filters.component';
import { AuctionCardSkeleton } from '../../shared/ui/skeleton.component';
import { Pagination } from '../../shared/ui/pagination.component';

export const Route = createFileRoute('/auctions')({
  validateSearch: (search) => AuctionFiltersSchema.parse(search),
  component: AuctionsListPage,
});

function AuctionsListPage() {
  const navigate = useNavigate({ from: '/auctions' });
  const filters = Route.useSearch();
  const queryClient = useQueryClient();

  const apiParams = {
    page: filters.page,
    per_page: filters.per_page,
    cargo_num: filters.cargo_num || undefined,
    status: filters.status || undefined,
    auc_type: filters.auc_type || undefined,
    load_city: filters.load_city || undefined,
    unload_city: filters.unload_city || undefined,
    load_date_from: filters.load_date_from || undefined,
    load_date_to: filters.load_date_to || undefined,
    is_available: filters.is_available ?? undefined,
    is_bidder: filters.is_bidder ?? undefined,
    price_from: filters.price_from || undefined,
    price_to: filters.price_to || undefined,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: auctionKeys.list(apiParams),
    queryFn: () => auctionsApi.list(apiParams),
  });

  const updateFilters = (next: Partial<AuctionFilters>) => {
    navigate({
      search: (prev) => ({ ...prev, ...next }),
      replace: true,
    });
  };

  const prefetchDetail = (uuid: string) => {
    queryClient.prefetchQuery({
      queryKey: auctionKeys.detail(uuid),
      queryFn: () => auctionsApi.detail(uuid),
      staleTime: 30_000,
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Аукционы</h1>

      <AuctionFiltersWidget values={filters} onChange={updateFilters} />

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <AuctionCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-medium">Не удалось загрузить аукционы</p>
          <p className="text-red-400 text-sm mt-1">
            {error instanceof Error ? error.message : 'Неизвестная ошибка'}
          </p>
        </div>
      )}

      {data && data.data.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-500 text-lg">Аукционы не найдены</p>
          <p className="text-gray-400 text-sm mt-1">Попробуйте изменить фильтры</p>
        </div>
      )}

      {data && data.data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.data.map((auction) => (
              <AuctionCard
                key={auction.main.order_uid}
                auction={auction}
                onPrefetch={() => prefetchDetail(auction.main.order_uid)}
              />
            ))}
          </div>

          <Pagination
            page={data.meta.current_page}
            lastPage={data.meta.last_page}
            total={data.meta.total}
            onPageChange={(p) => updateFilters({ page: p })}
          />
        </>
      )}
    </div>
  );
}
