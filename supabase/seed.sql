insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
)
values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'owner@natela.ge',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  '',
  '',
  '',
  ''
);

insert into auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
values (
  gen_random_uuid(),
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  '{"sub":"11111111-1111-1111-1111-111111111111","email":"owner@natela.ge"}',
  'email',
  now(),
  now(),
  now()
);

insert into public.businesses (
  id, name, slug, phone, email, address, timezone, plan, subscription_status, trial_ends_at
)
values (
  '22222222-2222-2222-2222-222222222222',
  'სილამაზის სალონი ნათელი',
  'natela',
  '+995322123456',
  'info@natela.ge',
  'ჭავჭავაძის გამზირი 12, თბილისი',
  'Asia/Tbilisi',
  'business',
  'trialing',
  now() + interval '14 days'
);

insert into public.users_businesses (user_id, business_id, role)
values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'owner'
);

insert into public.services (id, business_id, name, description, duration_minutes, price_tetri)
values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222222',
   'ქალის თმის შეჭრა', 'შეჭრა და დაშრობა', 60, 4000),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222222',
   'მამაკაცის თმის შეჭრა', null, 30, 2500),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222222',
   'თმის შეღებვა', 'ერთტონიანი შეღებვა', 120, 12000),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222222',
   'ვარცხნილობა', null, 45, 5000);

insert into public.staff (id, business_id, full_name, phone, email)
values
  ('44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222222',
   'ნინო ბერიძე', '+995555111222', 'nino@natela.ge'),
  ('44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222222',
   'თამარ კაპანაძე', '+995555333444', null);

insert into public.clients (id, business_id, full_name, phone, email, notes)
values
  ('55555555-5555-5555-5555-555555555501', '22222222-2222-2222-2222-222222222222',
   'მარიამ ლომიძე', '+995555123456', null, 'ურჩევნია დილის ჩაწერა'),
  ('55555555-5555-5555-5555-555555555502', '22222222-2222-2222-2222-222222222222',
   'გიორგი ჩხეიძე', '+995555987654', null, null);

insert into public.bookings (
  business_id, client_id, service_id, staff_id, starts_at, ends_at, status, price_tetri
)
values
  ('22222222-2222-2222-2222-222222222222',
   '55555555-5555-5555-5555-555555555501',
   '33333333-3333-3333-3333-333333333301',
   '44444444-4444-4444-4444-444444444401',
   '2026-09-01 10:00:00+04', '2026-09-01 11:00:00+04', 'confirmed', 4000),
  ('22222222-2222-2222-2222-222222222222',
   '55555555-5555-5555-5555-555555555502',
   '33333333-3333-3333-3333-333333333302',
   '44444444-4444-4444-4444-444444444402',
   '2026-09-01 12:00:00+04', '2026-09-01 12:30:00+04', 'pending', 2500);

insert into public.conversations (
  id, business_id, client_id, channel, external_id, status, last_message_at
)
values (
  '66666666-6666-6666-6666-666666666601',
  '22222222-2222-2222-2222-222222222222',
  '55555555-5555-5555-5555-555555555501',
  'instagram',
  'ig_17841400000000001',
  'open',
  now()
);

insert into public.messages (
  business_id, conversation_id, author, content, model, tokens_in, tokens_out
)
values
  ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601',
   'customer', 'გამარჯობა, ხვალ თავისუფალი დროა თმის შეჭრაზე?', null, null, null),
  ('22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666601',
   'assistant', 'გამარჯობა! ხვალ თავისუფალია 14:00 და 16:30. რომელი გერჩივნებათ?',
   'claude-haiku-4-5-20251001', 420, 38);
