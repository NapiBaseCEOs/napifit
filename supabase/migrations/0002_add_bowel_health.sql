-- Bağırsak sağlığı takibi için yeni sütun ekle
alter table public.health_metrics
add column if not exists bowel_movement_days numeric;

comment on column public.health_metrics.bowel_movement_days is 'Kaç günde bir tuvalete çıktığı (örn: 1 = her gün, 2 = 2 günde bir)';

