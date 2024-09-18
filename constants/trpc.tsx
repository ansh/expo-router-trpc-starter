import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import * as Device from "expo-device";
import { Platform } from "react-native";

import { useState } from "react";
import { AppRouter } from "@/server/router";
import SuperJSON from "superjson";

// Figure out the base URL of the API
const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (__DEV__) {
    const isEmulator = !Device.isDevice;
    const localUrl =
      Platform.OS === "ios" ? "http://localhost:8081" : "http://10.0.2.2:8081";
    return isEmulator ? localUrl : "http://192.168.68.111:8081"; // Change to your local IP for real device
  }
  return "https://your-production-url.com"; // TODO: Add your production URL here
};
const BASE_URL = getBaseUrl();
const TRPC_BASE_URL = `${BASE_URL}/api/trpc`;

// Create tRPC and react-query client
const trpc = createTRPCReact<AppRouter>();
const queryClient = new QueryClient();

// infer types from tRPC for specific use-cases when the type is required before the trpc function is called
type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

// Wrap the app in a provider for tRPC and react-query
function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchLink({
          url: TRPC_BASE_URL,
          async headers() {
            const isLoggedIn = false; // TODO: Replace with real auth state
            if (isLoggedIn) {
              const token = "TODO"; // TODO: Replace with real token
              return {
                Authorization: `Bearer ${token}`,
              };
            }
            return {};
          },
          transformer: SuperJSON,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </trpc.Provider>
    </QueryClientProvider>
  );
}

export {
  trpc,
  queryClient,
  BASE_URL,
  RouterInput,
  RouterOutput,
  TRPCReactProvider,
};
