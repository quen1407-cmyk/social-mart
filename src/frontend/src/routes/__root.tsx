import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
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
  );
}
