import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClientPromise(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set. Add it to .env.local");
    }
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(process.env.MONGODB_DB || "brainstory");
}

export type ProfileDoc = {
  _id: string;
  full_name: string;
  username: string;
  email: string;
  password_hash: string;
  phone: string | null;
  title: string | null;
  description: string | null;
  avatar_url: string | null;
  role: "super_admin" | "admin" | "author";
  created_at: string;
  updated_at: string;
};

export type CategoryDoc = {
  _id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogDoc = {
  _id: string;
  title: string;
  slug: string;
  small_description: string;
  content: string;
  image_url: string | null;
  status: "draft" | "published";
  featured: boolean;
  category_id: string | null;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgramDoc = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  image_url?: string;
  status: "draft" | "published";
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export async function getCollections() {
  const db = await getDb();
  return {
    profiles: db.collection<ProfileDoc>("profiles"),
    categories: db.collection<CategoryDoc>("categories"),
    blogs: db.collection<BlogDoc>("blogs"),
    programs: db.collection<ProgramDoc>("programs"),
  };
}
