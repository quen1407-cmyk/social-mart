import {
  Link,
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

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          className:
            "!bg-card !text-foreground !border-border !rounded-xl font-body text-sm",
        }}
      />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <HomePage />
    </Suspense>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/login",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <LoginPage />
    </Suspense>
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/register",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <RegisterPage />
    </Suspense>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$uid",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <ProfilePage />
    </Suspense>
  ),
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/upload",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <UploadPage />
    </Suspense>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/search",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <SearchPage />
    </Suspense>
  ),
});

const marketplaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marketplace",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <MarketplacePage />
    </Suspense>
  ),
});

const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/post/$postId",
  component: () => (
    <Suspense fallback={<SpinnerOverlay fullScreen />}>
      <PostDetailPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  uploadRoute,
  searchRoute,
  marketplaceRoute,
  postRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export { profileRoute, postRoute };

export default function App() {
  return <RouterProvider router={router} />;
}
