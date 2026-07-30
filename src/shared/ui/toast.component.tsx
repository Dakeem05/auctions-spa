import { useToastStore } from './toast.store';
import { clsx } from 'clsx';

const typeClasses = {
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  info: 'bg-blue-600 text-white',
};

export function ToastContainer() {
  const { toasts, remove } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={clsx(
            'flex items-center justify-between px-4 py-3 rounded-lg shadow-lg text-sm',
            typeClasses[t.type],
          )}
        >
          <span>{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="ml-4 opacity-70 hover:opacity-100 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
