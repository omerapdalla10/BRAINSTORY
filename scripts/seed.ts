import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { MongoClient } from "mongodb";

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri || !email || !password) {
    throw new Error("MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
  }

  const client = await new MongoClient(uri).connect();
  const db = client.db(process.env.MONGODB_DB || "brainstory");

  await db.collection("profiles").createIndex({ email: 1 }, { unique: true });
  await db.collection("profiles").createIndex({ username: 1 }, { unique: true });
  await db.collection("categories").createIndex({ name: 1 }, { unique: true });
  await db.collection("blogs").createIndex({ slug: 1 }, { unique: true });
  await db.collection("blogs").createIndex({ status: 1, published_at: -1 });

  const now = new Date().toISOString();
  const username = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
  const result = await db.collection<{ _id: string }>("profiles").updateOne(
    { email },
    {
      $set: { password_hash: await bcrypt.hash(password, 10), updated_at: now },
      $setOnInsert: {
        _id: randomUUID(),
        full_name: process.env.ADMIN_NAME || "Super Admin",
        username,
        phone: null,
        title: null,
        description: null,
        avatar_url: null,
        role: "super_admin",
        created_at: now,
      },
    },
    { upsert: true },
  );

  console.log(result.upsertedCount ? `Created super_admin ${email}` : `Updated password for ${email}`);
  await client.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
