alter table feature_requests
add column if not exists deleted_at timestamptz;

alter table feature_requests
add column if not exists deleted_reason text;


