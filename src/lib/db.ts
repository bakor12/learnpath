// src/lib/db.ts (Corrected)
import { MongoClient, Db, ObjectId } from 'mongodb'; // Import Db and ObjectId

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

if (!dbName) {
  throw new Error('Please define the MONGODB_DB environment variable inside .env.local');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null; // Use Db type from mongodb

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function updateUserProgress(userId: string, moduleId: string) {
    const { db } = await connectToDatabase();
    return db.collection('users').updateOne(
      { _id: new ObjectId(userId) }, // Use _id and ObjectId
      { $addToSet: { completedModules: moduleId } }
    );
  }

  export async function awardBadges(userId: string) {
      const { db } = await connectToDatabase();
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) }); // Use _id and ObjectId

      if (!user) {
          throw new Error('User not found');
      }

      const completedModules = user.completedModules || [];
      const newBadges: string[] = [];

      // Example badge criteria (replace with your actual logic)
      if (completedModules.length >= 3 && !user.badges.includes('three-modules-complete')) {
          newBadges.push('three-modules-complete');
      }
      if (completedModules.includes("module-id-for-specific-skill") && !user.badges.includes('specific-skill-badge'))
      {
          newBadges.push('specific-skill-badge');
      }

      if (newBadges.length > 0) {
          await db.collection('users').updateOne(
              { _id: new ObjectId(userId) }, // Use _id and ObjectId
              { $addToSet: { badges: { $each: newBadges } } }
          );
          return newBadges;
      }

      return [];
  }