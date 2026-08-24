/**
 * Regenerates the KRX listing master.
 *
 * Yahoo's search endpoint rejects Korean queries outright
 * ("Invalid Search Query"), so a Korean-language app cannot rely on it to
 * find domestic names. KIND publishes the full listed-company table without
 * an API key, which is enough to resolve a name to a ticker locally.
 *
 * Run when listings change: `node scripts/sync-krx.mjs`
 */
import { writeFile } from "node:fs/promises";

const URL_ALL = "http://kind.krx.co.kr/corpgeneral/corpList.do?method=download&searchType=13";

// The market is a column, not a request parameter, and it decides the suffix
// Yahoo expects. KONEX is dropped: Yahoo carries almost none of it.
const SUFFIX = { 유가: ".KS", 코스닥: ".KQ" };

function stripTags(html) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const res = await fetch(URL_ALL);
if (!res.ok) throw new Error(`HTTP ${res.status}`);
// KIND serves EUC-KR, which fetch will not decode on its own.
const html = new TextDecoder("euc-kr").decode(await res.arrayBuffer());

const listings = [];
const counts = {};

for (const row of html.split(/<tr>/i).slice(2)) {
  const cells = row
    .split(/<td[^>]*>/i)
    .slice(1)
    .map(stripTags);
  if (cells.length < 3) continue;

  const [name, market, code] = cells;
  const suffix = SUFFIX[market];
  // Codes are six alphanumerics, not six digits — newer listings carry letters.
  if (!suffix || !/^[0-9A-Z]{6}$/.test(code)) continue;

  listings.push([name, code + suffix]);
  counts[market] = (counts[market] ?? 0) + 1;
}

listings.sort((a, b) => a[0].localeCompare(b[0], "ko"));

await writeFile(
  new URL("../src/lib/market/krx-listings.json", import.meta.url),
  JSON.stringify(listings) + "\n",
);
console.log(counts, `총 ${listings.length}종목`);
