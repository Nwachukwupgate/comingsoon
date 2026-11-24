import { basePath } from "@/content/site";
import { isLocale, languageCookie } from "@/i18n/config";

/** Remembers the visitor's language. Set by the server because some browsers
    forget cookies set by scripts after a week. Works without JavaScript too. */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const to = String(form?.get("to") ?? "");
  if (!isLocale(to)) return new Response(null, { status: 400 });

  // Return to the page they were on, and only ever to this site.
  const path = String(form?.get("path") ?? "");
  const back = /^\/(?![/\\])/.test(path) ? path : basePath || "/";
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return new Response(null, {
    status: 303,
    headers: {
      Location: back,
      "Set-Cookie": `${languageCookie}=${to}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`,
    },
  });
}
