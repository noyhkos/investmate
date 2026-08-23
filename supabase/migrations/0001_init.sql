-- Assets, prices and watchlists.
--
-- One prices table holds every asset class. A KRW quote, a gold future and
-- a stock close are all "a price on a date", so splitting by type or by
-- symbol would multiply DDL and make cross-asset queries a UNION.

create type asset_type as enum ('stock', 'etf', 'fx', 'metal', 'index', 'crypto');

create table assets (
  id          uuid primary key default gen_random_uuid(),
  symbol      text not null unique,
  name        text not null,
  type        asset_type not null,
  currency    text not null default 'USD',
  -- Cached so MAX-scope resolution does not scan prices for MIN(date).
  first_date  date,
  created_at  timestamptz not null default now()
);

create table prices (
  asset_id  uuid not null references assets(id) on delete cascade,
  date      date not null,
  open      numeric(20, 6) not null,
  high      numeric(20, 6) not null,
  low       numeric(20, 6) not null,
  close     numeric(20, 6) not null,
  volume    bigint not null default 0,
  primary key (asset_id, date)
);

create table watchlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  asset_id    uuid not null references assets(id) on delete cascade,
  -- Free text, not an enum: "핵심자산" / "헤지" beats a fixed taxonomy.
  "group"     text not null default '',
  sort_order  int not null default 0,
  note        text,
  created_at  timestamptz not null default now(),
  primary key (user_id, asset_id)
);

create index watchlist_user_order_idx on watchlist (user_id, "group", sort_order);

alter table watchlist enable row level security;

create policy "watchlist is private"
  on watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Assets and prices are shared reference data: readable by all, written
-- only by the ingest job via the service role.
alter table assets enable row level security;
alter table prices enable row level security;

create policy "assets are readable" on assets for select using (true);
create policy "prices are readable" on prices for select using (true);
