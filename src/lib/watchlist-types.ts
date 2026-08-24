import type { AssetType } from "@/lib/types/asset";

export interface WatchedAsset {
  symbol: string;
  name: string;
  type: AssetType;
  currency: string;
}
