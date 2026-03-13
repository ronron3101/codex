insert into fixtures (sku, name, wattage, supported_voltages)
values
  ('LUM-SPK-6W', 'Spike Accent 6W', 6, '{12,24}'),
  ('LUM-WLL-4W', 'Wall Wash 4W', 4, '{12,24}'),
  ('LUM-PTH-3W', 'Path Light 3W', 3, '{12}'),
  ('LUM-UPL-9W', 'In-ground Uplight 9W', 9, '{24}')
on conflict (sku) do nothing;

insert into cables (name, resistance_ohm_per_metre, max_recommended_current)
values
  ('14/2 Direct Burial', 0.008286, 15),
  ('12/2 Direct Burial', 0.005211, 20),
  ('10/2 Direct Burial', 0.003277, 30);

insert into transformers (name, size_watt)
values
  ('LUMINI 60W Transformer', 60),
  ('LUMINI 100W Transformer', 100),
  ('LUMINI 150W Transformer', 150),
  ('LUMINI 200W Transformer', 200),
  ('LUMINI 300W Transformer', 300);

insert into calculation_rules (default_headroom_percent, good_voltage_drop_percent_max, caution_voltage_drop_percent_max)
values (25, 3, 8);
