import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
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

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: wrap(HomePage) });
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: "/auth/login", component: wrap(LoginPage) });
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: "/auth/register", component: wrap(RegisterPage) });
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: "/profile/$uid", component: wrap(ProfilePage) });
const uploadRoute = createRoute({ getParentRoute: () => rootRoute, path: "/upload", component: wrap(UploadPage) });
const searchRoute = createRoute({ getParentRoute: () => rootRoute, path: "/search", component: wrap(SearchPage) });
const marketplaceRoute = createRoute({ getParentRoute: () => rootRoute, path: "/marketplace", component: wrap(MarketplacePage) });
const postRoute = createRoute({ getParentRoute: () => rootRoute, path: "/post/$postId", component: wrap(PostDetailPage) });
const reelsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/reels", component: wrap(ReelsPage) });
const notificationsRoute = createRoute({ getParentRoute: () => rootRoute, path: "/notifications", component: wrap(NotificationsPage) });
const storyRoute = createRoute({ getParentRoute: () => rootRoute, path: "/story", component: wrap(StoryPage) });

const routeTree = rootRoute.addChildren([
  indexRoute, loginRoute, registerRoute, profileRoute,
  uploadRoute, searchRoute, marketplaceRoute, postRoute,
  reelsRoute, notificationsRoute, storyRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router; }
}

export { profileRoute, postRoute };

export default function App() {
  return <RouterProvider router={router} />;
}
