import {
  type LoaderFunctionArgs,
  json,
  type HeadersArgs,
} from "@remix-run/cloudflare";
import { Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { boundary } from "@shopify/shopify-app-remix";

import { createShopify } from "~/shopify.server";

export const loader = async ({ request, context }: LoaderFunctionArgs) => {
  await createShopify(context).authenticate.admin(request);

  return json({
    apiKey: context.env.SHOPIFY_API_KEY,
  });
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider apiKey={apiKey} isEmbeddedApp>
      <Outlet />
    </AppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs: HeadersArgs) => {
  return boundary.headers(headersArgs);
};
