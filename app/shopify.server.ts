import {
  DeliveryMethod,
  LATEST_API_VERSION,
  shopifyApp,
} from "@shopify/shopify-app-remix";
import { KVSessionStorage } from "@shopify/shopify-app-session-storage-kv";
import type { AppLoadContext } from "@remix-run/cloudflare";

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: {
      SHOPIFY_API_KEY: string;
      SHOPIFY_API_SECRET: string;
      SHOPIFY_APP_URL: string;
      SESSION: KVNamespace;
    };
  }
}

export const createShopify = (context: AppLoadContext) => {
  const shopify = shopifyApp({
    apiKey: context.env.SHOPIFY_API_KEY,
    apiSecretKey: context.env.SHOPIFY_API_SECRET,
    scopes: ["read_products"],
    appUrl: context.env.SHOPIFY_APP_URL,
    apiVersion: LATEST_API_VERSION,
    sessionStorage: new KVSessionStorage(context.env.SESSION),
    isEmbeddedApp: true,
    webhooks: {
      APP_UNINSTALLED: {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: "/webhooks",
      },
    },
    hooks: {
      afterAuth: async ({ session }) => {
        shopify.registerWebhooks({ session });
      },
    },
  });

  return shopify;
};
