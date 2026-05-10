import {
  Outlet, RouterProvider, createRootRoute,
  createRoute, createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { Toaster } from "sonner";
import { SpinnerOverlay } from "./components/shared/SpinnerOverlay";

const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const UploadPage = lazy(() => import("./pages/UploadPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const MarketplacePage = lazy(() => import("./pages/MarketplacePage"));
const PostDetailPage = lazy(() => import("./pages/PostDetailPage"));
const ReelsPage = lazy(() => import("./pages/ReelsPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const StoryPage = lazy(() => import("./pages/StoryPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Outlet />
      <Toaster position="top-center" toastOptions={{ className: "!bg-card !text-foreground !border-border !rounded-xl font-body text-sm" }} />
    </ThemeProvider>
  ),
});

function wrap(Component: React.ComponentType) {
  return () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <Component />
    </Suspense>
  );
}

const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: "/", component: wrap(HomePage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/auth/login", component: wrap(LoginPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/auth/register", component: wrap(RegisterPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/profile/$uid", component: wrap(ProfilePage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/upload", component: wrap(UploadPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/search", component: wrap(SearchPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/marketplace", component: wrap(MarketplacePage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/post/$postId", component: wrap(PostDetailPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/reels", component: wrap(ReelsPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/notifications", component: wrap(NotificationsPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/story", component: wrap(StoryPage) }),
  createRoute({ getParentRoute: () => rootRoute, path: "/settings", component: wrap(SettingsPage) }),
];

const routeTree = rootRoute.addChildren(routes);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}

export default function App() {
  return <RouterProvider router={router} />;
}
