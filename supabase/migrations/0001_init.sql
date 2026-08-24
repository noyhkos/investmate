-- Watchlist and per-user view settings.
--
-- Quotes are fetched live from the provider, so there is no assets or prices
-- table yet: a symbol registry would only add a foreign key to satisfy before
-- anyone can track a ticker. The batch ingester can introduce one when it
-- exists, keyed by symbol.

create type asset_type as enum ('stock', 'etf', 'fx', 'metal', 'index', 'crypto');

create table watchlist (
  user_id     uuid not null references auth.users(id) on delete cascade,
  -- Provider symbol, e.g. "005930.KS", "AAPL", "BTC-KRW".
  symbol      text not null,
  name        text not null,
  type        asset_type not null,
  currency    text not null default 'USD',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  primary key (user_id, symbol)
);

create index watchlist_user_order_idx on watchlist (user_id, sort_order);

-- One row per user. The view options are the reading, not the data, so they
-- live together rather than as columns spread over a profile.
create table user_settings (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  scope       text not null default '10Y',
  view_mode   text not null default 'grid',
  log         boolean not null default false,
  dividends   boolean not null default false,
  krw         boolean not null default false,
  inflation   boolean not null default false,
  -- Korea paints a rising price red, the US green; the convention is a
  -- preference, not a constant.
  up_color    text not null default 'red',
  theme       text not null default 'system',
  updated_at  timestamptz not null default now()
);

alter table watchlist enable row level security;
alter table user_settings enable row level security;

create policy "watchlist is private"
  on watchlist for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "settings are private"
  on user_settings for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Every signed-in user has a settings row from the first request, so the app
-- never has to distinguish "no row" from "defaults".
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_settings (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
