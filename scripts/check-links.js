// Check every store link in data.js and fail when a link is clearly broken.
// Run with: npm run check:links

import { wishlistData } from "../data.js";

const TIMEOUT_MS = 15000;
const WARN_STATUSES = new Set([401, 403, 405, 429]);
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (compatible; WishlistLinkChecker/1.0; +https://vde-maga.github.io/wishlist/)";

const urls = new Map();

for (const item of wishlistData) {
  const links =
    Array.isArray(item.links) && item.links.length > 0
      ? item.links.map((link) => link?.url)
      : [item.link];

  for (const url of links) {
    if (typeof url !== "string" || !/^https?:\/\//i.test(url)) continue;
    if (!urls.has(url)) urls.set(url, []);
    urls.get(url).push(item.title);
  }
}

const checkUrl = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const options = {
    redirect: "follow",
    signal: controller.signal,
    headers: { "user-agent": BROWSER_USER_AGENT },
  };

  try {
    let response = await fetch(url, { ...options, method: "HEAD" });

    // Some stores reject HEAD requests; retry with GET before reporting.
    if ([400, 403, 405, 501].includes(response.status)) {
      response = await fetch(url, { ...options, method: "GET" });
      await response.body?.cancel();
    }

    if (WARN_STATUSES.has(response.status)) {
      return { url, status: response.status, kind: "warn" };
    }
    if (response.ok) {
      return { url, status: response.status, kind: "ok" };
    }
    return { url, status: response.status, kind: "error" };
  } catch (error) {
    const status =
      error?.name === "AbortError" ? "timeout" : (error?.message ?? "erro");
    return { url, status, kind: "error" };
  } finally {
    clearTimeout(timeout);
  }
};

if (urls.size === 0) {
  console.log("Nenhum link encontrado em data.js.");
  process.exit(0);
}

console.log(`A verificar ${urls.size} links…`);
const results = await Promise.all([...urls.keys()].map(checkUrl));

for (const result of results) {
  const titles = urls.get(result.url).join(", ");
  const prefix =
    result.kind === "ok" ? "✓" : result.kind === "warn" ? "!" : "✗";
  console.log(`${prefix} ${result.status} ${result.url} (${titles})`);
}

const warnings = results.filter((result) => result.kind === "warn");
const errors = results.filter((result) => result.kind === "error");

if (warnings.length > 0) {
  console.warn(
    `\n${warnings.length} link(s) bloqueados para pedidos automáticos; verifica manualmente.`,
  );
}

if (errors.length > 0) {
  console.error(`\n${errors.length} link(s) com problemas.`);
  process.exitCode = 1;
} else {
  console.log(`\n${results.length} links verificados sem erros.`);
}
