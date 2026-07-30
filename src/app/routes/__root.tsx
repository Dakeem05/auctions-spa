import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ToastContainer } from '../../shared/ui/toast.component';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/auctions" search={{ page: 1, per_page: 10 }} className="text-lg font-bold text-blue-600 hover:text-blue-700">
            Грузовые аукционы
          </Link>
          <nav className="flex gap-4 text-sm text-gray-600">
            <Link
              to="/auctions"
              search={{ page: 1, per_page: 10 }}
              className="hover:text-blue-600 [&.active]:text-blue-600 [&.active]:font-semibold"
            >
              Список аукционов
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      <ToastContainer />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </div>
  );
}
