import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createShopify } from "~/shopify.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  await createShopify(context).authenticate.admin(request);

  return null;
}
