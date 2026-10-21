const { Client } = require('pg');

async function check() {
  const client = new Client({
    user: 'postgres.zmwkntfflkmumuwyhmjj',
    password: 'i9p4Vk?zU9.qYai',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();

  // Ensure image_url column exists in categories
  await client.query(`
    ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;
  `);

  const catCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'categories';");
  console.log('Categories columns:', catCols.rows.map(r => r.column_name));

  const prodCols = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products';");
  console.log('Products columns:', prodCols.rows.map(r => r.column_name));

  // Also check sample products to see how images are stored
  const prods = await client.query("SELECT id, title, thumbnail_url, images, is_featured FROM public.products LIMIT 3;");
  console.log('Sample products:', JSON.stringify(prods.rows, null, 2));

  // Check sample categories
  const cats = await client.query("SELECT id, name, slug, image_url, show_on_home FROM public.categories LIMIT 5;");
  console.log('Sample categories:', JSON.stringify(cats.rows, null, 2));

  await client.end();
}

check().catch(console.error);
