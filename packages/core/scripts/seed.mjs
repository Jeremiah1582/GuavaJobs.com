/**
 * Seeds dev user + sample data from app/.env.local:
 * SEED_USER_EMAIL, SEED_USER_PASSWORD, DATABASE_URL, DIRECT_URL
 * Optional: SUPABASE_SERVICE_ROLE_KEY (preferred) or SQL fallback via DIRECT_URL
 *
 * Auth users are created with email_confirmed_at set so password sign-in works.
 * For auth E2E (confirm-email flow), use normal sign-up instead of relying on seed.
 */
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { deriveSupabaseUrl, loadAppEnv } from "./load-app-env.mjs";

loadAppEnv();

const email = process.env.SEED_USER_EMAIL?.trim();
const password = process.env.SEED_USER_PASSWORD;

if (!email || !password) {
  console.error(
    "Set SEED_USER_EMAIL and SEED_USER_PASSWORD in app/.env.local",
  );
  process.exit(1);
}

if (!process.env.DIRECT_URL) {
  console.error("Set DIRECT_URL in app/.env.local");
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL } },
});

async function ensureAuthUserViaAdmin(supabaseUrl, serviceRoleKey) {
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listed, error: listError } =
    await admin.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw listError;

  const existing = listed.users.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(
      existing.id,
      { password, email_confirm: true },
    );
    if (error) throw error;
    console.log(`Updated existing auth user: ${email}`);
    return data.user.id;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  console.log(`Created auth user: ${email}`);
  return data.user.id;
}

async function ensureAuthUserViaSql() {
  const rows = await prisma.$queryRaw`
    SELECT id FROM auth.users WHERE email = ${email} LIMIT 1
  `;
  if (rows.length > 0) {
    const userId = rows[0].id;
    await prisma.$executeRaw`
      UPDATE auth.users
      SET encrypted_password = crypt(${password}, gen_salt('bf')),
          email_confirmed_at = COALESCE(email_confirmed_at, timezone('utc', now())),
          updated_at = timezone('utc', now())
      WHERE id = ${userId}::uuid
    `;
    console.log(`Updated password for existing auth user: ${email}`);
    return userId;
  }

  const inserted = await prisma.$queryRaw`
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token,
      raw_app_meta_data,
      raw_user_meta_data
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      ${email},
      crypt(${password}, gen_salt('bf')),
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now()),
      '',
      '',
      '',
      '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb
    )
    RETURNING id
  `;

  const userId = inserted[0].id;

  await prisma.$executeRaw`
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      ${userId}::uuid,
      jsonb_build_object('sub', ${userId}::text, 'email', ${email}),
      'email',
      ${userId}::text,
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now())
    )
    ON CONFLICT DO NOTHING
  `;

  console.log(`Created auth user via SQL: ${email}`);
  return userId;
}

async function ensureAppUser(userId) {
  await prisma.user.upsert({
    where: { id: userId },
    create: { id: userId, email },
    update: { email },
  });
  console.log(`Synced public.users row for ${email}`);
}

async function seedSampleApplications(userId) {
  const count = await prisma.application.count({ where: { userId } });
  if (count > 0) {
    console.log(`User already has ${count} application(s); skipping samples.`);
    return;
  }

  await prisma.application.createMany({
    data: [
      {
        userId,
        title: "Frontend Developer",
        company: "Sample Tech Ltd",
        status: "DRAFT",
        jobDescriptionSnapshot:
          "Seed application — replace with a real role from the job board.",
      },
      {
        userId,
        title: "Full Stack Engineer",
        company: "Example Startup GmbH",
        status: "APPLIED",
        jobDescriptionSnapshot: "Second seed row for dashboard testing.",
      },
    ],
  });
  console.log("Created 2 sample applications.");
}

async function main() {
  const supabaseUrl = deriveSupabaseUrl();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let userId;

  if (supabaseUrl && serviceRoleKey) {
    userId = await ensureAuthUserViaAdmin(supabaseUrl, serviceRoleKey);
  } else {
    if (!supabaseUrl) {
      console.warn(
        "Could not derive SUPABASE_URL; using SQL auth seed with DIRECT_URL.",
      );
    } else {
      console.warn(
        "SUPABASE_SERVICE_ROLE_KEY not set; using SQL auth seed (add service role key for Admin API).",
      );
    }
    userId = await ensureAuthUserViaSql();
  }

  await ensureAppUser(userId);
  await seedSampleApplications(userId);

  console.log("\nSeed complete. Sign in at http://localhost:3001/sign-in");
  console.log(`  Email: ${email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
