create table if not exists fixtures (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  wattage numeric not null,
  supported_voltages int[] not null,
  created_at timestamptz not null default now()
);

create table if not exists cables (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  resistance_ohm_per_metre numeric not null,
  max_recommended_current numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists transformers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  size_watt int not null,
  created_at timestamptz not null default now()
);

create table if not exists calculation_rules (
  id uuid primary key default gen_random_uuid(),
  default_headroom_percent numeric not null,
  good_voltage_drop_percent_max numeric not null,
  caution_voltage_drop_percent_max numeric not null,
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  project_type text not null,
  created_by_email text,
  created_at timestamptz not null default now()
);

create table if not exists project_runs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  voltage int not null,
  topology text not null,
  cable_id uuid not null references cables(id),
  run_length_metres numeric not null,
  headroom_percent numeric not null,
  reserve_capacity_watt numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists project_run_fixtures (
  id uuid primary key default gen_random_uuid(),
  project_run_id uuid not null references project_runs(id) on delete cascade,
  fixture_id uuid not null references fixtures(id),
  quantity int not null
);

create table if not exists calculation_results (
  id uuid primary key default gen_random_uuid(),
  project_run_id uuid not null references project_runs(id) on delete cascade,
  total_connected_load_watt numeric not null,
  design_load_watt numeric not null,
  current_draw_amp numeric not null,
  voltage_drop_volt numeric not null,
  voltage_drop_percent numeric not null,
  end_of_run_voltage numeric not null,
  status text not null,
  transformer_id uuid references transformers(id),
  recommendations text[] not null,
  created_at timestamptz not null default now()
);
