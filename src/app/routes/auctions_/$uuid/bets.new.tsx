import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auctionsApi } from '../../../../shared/api/auctions.api';
import { auctionKeys } from '../../../../shared/api/query-keys';
import { createBetSchema, type BetFormValues } from '../../../../shared/lib/schemas';
import { formatPrice } from '../../../../shared/lib/formatters';
import { ApiError } from '../../../../shared/api/client';
import { toast } from '../../../../shared/ui/toast.store';
import type { ValidationProblem } from '../../../../shared/types/api.types';

export const Route = createFileRoute('/auctions_/$uuid/bets/new')({
  component: PlaceBetPage,
});

function PlaceBetPage() {
  const { uuid } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: detail, isLoading } = useQuery({
    queryKey: auctionKeys.detail(uuid),
    queryFn: () => auctionsApi.detail(uuid),
  });

  const trading = detail?.trading;
  const price = trading?.price;

  const schema = createBetSchema({
    min: price?.min,
    max: price?.max,
    step: price?.step,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: price?.available ?? price?.current ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (values: BetFormValues) =>
      auctionsApi.setBet(uuid, { price: values.price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: auctionKeys.detail(uuid) });
      queryClient.invalidateQueries({ queryKey: auctionKeys.bets(uuid) });
      toast.success('Ставка принята!');
      navigate({ to: '/auctions/$uuid', params: { uuid } });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 422) {
        const body = err.body as ValidationProblem;
        body.errors?.forEach((e) => {
          if (e.field === 'price') {
            setError('price', { message: e.message });
          }
        });
        toast.error(body.message ?? 'Ошибка валидации');
      } else {
        toast.error('Не удалось разместить ставку');
      }
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white border border-gray-200 rounded-lg">
        <p className="text-gray-400 text-center">Загрузка...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 border border-red-200 rounded-lg text-center">
        <p className="text-red-600">Аукцион не найден</p>
        <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          ← Вернуться к списку
        </Link>
      </div>
    );
  }

  if (!trading?.can_set_bet) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <p className="text-yellow-700 font-medium">Ставка сейчас недоступна</p>
        <p className="text-yellow-600 text-sm mt-1">Торги не активны для этого аукциона</p>
        <Link
          to="/auctions/$uuid"
          params={{ uuid }}
          className="text-blue-600 text-sm mt-3 inline-block hover:underline"
        >
          ← Вернуться к аукциону
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="hover:text-blue-600">Аукционы</Link>
        <span>/</span>
        <Link to="/auctions/$uuid" params={{ uuid }} className="hover:text-blue-600">
          #{detail.main.cargo_num}
        </Link>
        <span>/</span>
        <span className="text-gray-800">Ставка</span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
        <h1 className="text-xl font-bold text-gray-900">
          {trading.your.bet ? 'Изменить ставку' : 'Сделать ставку'}
        </h1>

        {/* Price hints */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
          {price?.current != null && (
            <div className="flex justify-between">
              <span className="text-gray-600">Текущая цена:</span>
              <span className="font-semibold text-gray-800">{formatPrice(price.current)}</span>
            </div>
          )}
          {price?.available != null && (
            <div className="flex justify-between">
              <span className="text-gray-600">Доступная цена:</span>
              <span className="font-semibold text-blue-700">{formatPrice(price.available)}</span>
            </div>
          )}
          {price?.step != null && (
            <div className="flex justify-between">
              <span className="text-gray-600">Шаг ставки:</span>
              <span className="font-medium text-gray-700">{formatPrice(price.step)}</span>
            </div>
          )}
          {price?.min != null && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Мин:</span>
              <span>{formatPrice(price.min)}</span>
            </div>
          )}
          {price?.max != null && (
            <div className="flex justify-between text-xs text-gray-500">
              <span>Макс:</span>
              <span>{formatPrice(price.max)}</span>
            </div>
          )}
          {trading.your.last_bet != null && (
            <div className="pt-2 border-t border-blue-200 flex justify-between">
              <span className="text-gray-600">Моя текущая ставка:</span>
              <span className="font-semibold text-orange-600">
                {formatPrice(trading.your.last_bet)}
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Цена ставки (₽)
            </label>
            <input
              type="number"
              step={price?.step ?? 1}
              min={price?.min ?? 1}
              max={price?.max ?? undefined}
              {...register('price', { valueAsNumber: true })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={String(price?.available ?? price?.current ?? '')}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {mutation.isPending ? 'Отправка...' : 'Подтвердить ставку'}
            </button>
            <Link
              to="/auctions/$uuid"
              params={{ uuid }}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 text-center transition-colors"
            >
              Отмена
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
