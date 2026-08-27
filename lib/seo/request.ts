import { headers } from "next/headers";
import { PATHNAME_HEADER } from "@/lib/seo/constants";

export async function getRequestPathname(fallback = "/"): Promise<string> {
  try {
    const headerList = await headers();
    return headerList.get(PATHNAME_HEADER) ?? fallback;
  } catch {
    return fallback;
  }
}
