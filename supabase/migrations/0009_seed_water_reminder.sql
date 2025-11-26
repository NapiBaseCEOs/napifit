-- Ensure founder profile & Su İçme Hatırlatıcısı feature request always exist
-- Ensure soft delete columns exist (in case migration 0008 hasn't run)
alter table if exists public.feature_requests
  add column if not exists deleted_at timestamptz,
  add column if not exists deleted_reason text;

do $$
declare
  founder_profile_id constant uuid := 'ce507534-ab1a-4ccf-b0c3-4d42e8a608b1'::uuid;
  feature_request_id constant uuid := '00000000-0000-4000-8000-0000000000b1'::uuid;
  water_title constant text := 'Su İçme Hatırlatıcısı';
begin
  -- Keep founder profile public if it already exists
  update public.profiles
  set
    show_public_profile = true,
    show_community_stats = true,
    updated_at = now()
  where id = founder_profile_id;

  -- Soft delete all old "Su İçme Hatırlatıcısı" requests except the canonical one
  update public.feature_requests
  set
    deleted_at = now(),
    deleted_reason = 'Duplicate removed by migration 0009',
    updated_at = now()
  where user_id = founder_profile_id
    and title = water_title
    and id != feature_request_id
    and deleted_at is null;

  -- Water reminder feature request (canonical one)
  insert into public.feature_requests (
    id,
    user_id,
    title,
    description,
    is_implemented,
    implemented_at,
    implemented_version,
    created_at,
    updated_at,
    deleted_at,
    deleted_reason
  )
  values (
    feature_request_id,
    founder_profile_id,
    water_title,
    'Su içme hatırlatıcısı olsa çok güzel olur',
    true,
    coalesce((select implemented_at from public.feature_requests where id = feature_request_id limit 1), '2024-01-01 00:00:00+00'),
    '0.1.53',
    coalesce((select created_at from public.feature_requests where id = feature_request_id limit 1), '2024-01-01 00:00:00+00'),
    now(),
    null,
    null
  )
  on conflict (id) do update
    set user_id = excluded.user_id,
        title = excluded.title,
        description = excluded.description,
        is_implemented = true,
        implemented_at = excluded.implemented_at,
        implemented_version = excluded.implemented_version,
        deleted_at = null,
        deleted_reason = null,
        updated_at = now();
end;
$$;

