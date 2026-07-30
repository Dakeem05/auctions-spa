import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatPrice = (value: number | null | undefined, currency = '₽') => {
  if (value == null) return '—';
  return new Intl.NumberFormat('ru-RU').format(value) + ' ' + currency;
};

export const formatDate = (iso: string | null | undefined, fmt = 'dd.MM.yyyy') => {
  if (!iso) return '—';
  try {
    return format(new Date(iso), fmt, { locale: ru });
  } catch {
    return '—';
  }
};

export const formatDateTime = (iso: string | null | undefined) =>
  formatDate(iso, 'dd.MM.yyyy HH:mm');

export const AUC_TYPE_LABELS: Record<string, string> = {
  Request: 'Заявочный',
  Up: 'На повышение',
  Down: 'На понижение',
  FixPrice: 'Фикс. цена',
  Unknown: 'Неизвестно',
};

export const STATUS_LABELS: Record<string, string> = {
  Planning: 'Планирование',
  Auction: 'Торги идут',
  DeterminateWinner: 'Определение победителя',
  WaitDeal: 'Ожидание сделки',
  InProgress: 'В работе',
  Finished: 'Завершён',
  Stopped: 'Остановлен',
  Canceled: 'Отменён',
  Unknown: 'Неизвестно',
};

export const TRADING_STATUS_LABELS: Record<string, string> = {
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
