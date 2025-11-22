-- Kullanıcı yorumları tablosu
create table if not exists public.user_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text not null,
  is_featured boolean default false, -- Ana sayfada gösterilecek mi?
  ai_sentiment_score numeric, -- AI tarafından hesaplanan övgü skoru (0-1)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_reviews_featured_idx on public.user_reviews(is_featured, ai_sentiment_score desc nulls last) where is_featured = true;
create index if not exists user_reviews_user_idx on public.user_reviews(user_id, created_at desc);
create index if not exists user_reviews_sentiment_idx on public.user_reviews(ai_sentiment_score desc nulls last);

-- RLS (Row Level Security) politikaları
alter table public.user_reviews enable row level security;

-- Herkes okuyabilir (public reviews)
drop policy if exists "user_reviews_select_all" on public.user_reviews;
create policy "user_reviews_select_all" on public.user_reviews
  for select using (true);

-- Kullanıcılar kendi yorumlarını ekleyebilir/güncelleyebilir
drop policy if exists "user_reviews_insert_own" on public.user_reviews;
create policy "user_reviews_insert_own" on public.user_reviews
  for insert with check (auth.uid() = user_id);

drop policy if exists "user_reviews_update_own" on public.user_reviews;
create policy "user_reviews_update_own" on public.user_reviews
  for update using (auth.uid() = user_id);

-- Updated_at trigger
drop trigger if exists user_reviews_set_updated_at on public.user_reviews;
create trigger user_reviews_set_updated_at
  before update on public.user_reviews
  for each row
  execute function public.handle_updated_at();

comment on table public.user_reviews is 'Kullanıcı yorumları ve değerlendirmeleri';
comment on column public.user_reviews.ai_sentiment_score is 'AI tarafından hesaplanan övgü skoru (0-1 arası, yüksek = daha övgü dolu)';

