import { useForm } from 'react-hook-form';
import type { AuctionFilters } from '../../shared/lib/schemas';
import { CITIES } from '../../shared/mocks/store';

interface AuctionFiltersProps {
  values: AuctionFilters;
  onChange: (filters: Partial<AuctionFilters>) => void;
}

export function AuctionFilters({ values, onChange }: AuctionFiltersProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      cargo_num: values.cargo_num ?? '',
      auc_type: values.auc_type ?? '',
      status: values.status ?? '',
      load_city: values.load_city ?? '',
      unload_city: values.unload_city ?? '',
      load_date_from: values.load_date_from ?? '',
      load_date_to: values.load_date_to ?? '',
      price_from: values.price_from ?? '',
      price_to: values.price_to ?? '',
      is_available: values.is_available ?? false,
      is_bidder: values.is_bidder ?? false,
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    onChange({
      page: 1,
      per_page: values.per_page,
      cargo_num: (data.cargo_num as string) || undefined,
      auc_type: (data.auc_type as AuctionFilters['auc_type']) || undefined,
      status: (data.status as AuctionFilters['status']) || undefined,
      load_city: data.load_city ? Number(data.load_city) : undefined,
      unload_city: data.unload_city ? Number(data.unload_city) : undefined,
      load_date_from: (data.load_date_from as string) || undefined,
      load_date_to: (data.load_date_to as string) || undefined,
      price_from: data.price_from ? Number(data.price_from) : undefined,
      price_to: data.price_to ? Number(data.price_to) : undefined,
      is_available: data.is_available ? true : undefined,
      is_bidder: data.is_bidder ? true : undefined,
    });
  };

  const handleReset = () => {
    reset({
      cargo_num: '', auc_type: '', status: '',
      load_city: '', unload_city: '', load_date_from: '',
      load_date_to: '', price_from: '', price_to: '',
      is_available: false, is_bidder: false,
    });
    onChange({ page: 1, per_page: 10 });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white border border-gray-200 rounded-lg p-4 space-y-3"
    >
      <h3 className="font-semibold text-gray-700 text-sm">Фильтры</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Номер заявки</label>
          <input
            {...register('cargo_num')}
            placeholder="00000001059"
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Тип аукциона</label>
          <select
            {...register('auc_type')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Все типы</option>
            <option value="Request">Заявочный</option>
            <option value="Up">На повышение</option>
            <option value="Down">На понижение</option>
            <option value="FixPrice">Фикс. цена</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Статус</label>
          <select
            {...register('status')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Все статусы</option>
            <option value="Planning">Планирование</option>
            <option value="Auction">Торги идут</option>
            <option value="DeterminateWinner">Определение победителя</option>
            <option value="WaitDeal">Ожидание сделки</option>
            <option value="Finished">Завершён</option>
            <option value="Canceled">Отменён</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Город погрузки</label>
          <select
            {...register('load_city')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Все города</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Город выгрузки</label>
          <select
            {...register('unload_city')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Все города</option>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Погрузка от</label>
          <input
            type="date"
            {...register('load_date_from')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Погрузка до</label>
          <input
            type="date"
            {...register('load_date_to')}
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Цена от</label>
          <input
            type="number"
            {...register('price_from')}
            placeholder="0"
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">Цена до</label>
          <input
            type="number"
            {...register('price_to')}
            placeholder="999999"
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 pt-1">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" {...register('is_available')} className="rounded" />
          Доступные
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input type="checkbox" {...register('is_bidder')} className="rounded" />
          Я участвую
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Применить
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          Сбросить
        </button>
      </div>
    </form>
  );
}
