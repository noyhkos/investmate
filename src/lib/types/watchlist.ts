export interface WatchlistItem {
  assetId: string;
  /** Free-form, user-defined. Not a fixed taxonomy. */
  group: string;
  sortOrder: number;
  note: string | null;
}
