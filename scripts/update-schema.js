const { Client } = require('pg');

async function updateSchema() {
  const client = new Client({
    user: 'postgres.zmwkntfflkmumuwyhmjj',
    password: 'i9p4Vk?zU9.qYai',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected to DB');

  // 1. Add show_on_home column to categories
  await client.query(`
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT TRUE;
  `);
  console.log('Added show_on_home to categories');

  // 2. Make title optional in banners and simplify
  await client.query(`
    ALTER TABLE public.banners ALTER COLUMN title DROP NOT NULL;
    ALTER TABLE public.banners ALTER COLUMN subtitle DROP NOT NULL;
    ALTER TABLE public.banners ALTER COLUMN button_text DROP NOT NULL;
  `);
  console.log('Simplified banners table');

  // 3. Clear existing banners to replace with clean banners
  await client.query(`DELETE FROM public.banners;`);
  console.log('Cleared old banners');

  await client.end();
}

updateSchema().catch(console.error);
