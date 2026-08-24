import type { AssetType } from "@/lib/types/asset";

export const ASSET_TYPE_LABEL: Record<AssetType, string> = {
  stock: "주식",
  etf: "ETF",
  fx: "환율",
  metal: "귀금속",
  index: "지수",
  crypto: "코인",
};

/**
 * Hairline colour per asset type. Returned as a custom property so light and
 * dark resolve from one place, and so the value can never be read as a series
 * colour by accident.
 */
export function assetTypeBorder(type: AssetType): string {
  return `var(--type-${type})`;
}
