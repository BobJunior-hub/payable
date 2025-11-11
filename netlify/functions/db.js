import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/payable';
  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db('payable');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getUsers() {
  const { db } = await connectToDatabase();
  return db.collection('users');
}

export async function getExpenses() {
  const { db } = await connectToDatabase();
  return db.collection('expenses');
}

export async function getUserRequests() {
  const { db } = await connectToDatabase();
  return db.collection('userRequests');
}

export async function getCategories() {
  const { db } = await connectToDatabase();
  return db.collection('categories');
}

// Initialize default data
export async function initializeData() {
  const { db } = await connectToDatabase();
  
  const usersCount = await db.collection('users').countDocuments();
  if (usersCount === 0) {
    await db.collection('users').insertMany([
      { id: '1', name: 'John Viewer', email: 'viewer@company.com', role: 'viewer', status: 'active' },
      { id: '2', name: 'Sarah Creator', email: 'creator@company.com', role: 'creator', status: 'active' },
      { id: '3', name: 'Mike Payer', email: 'payer@company.com', role: 'payer', status: 'active' },
      { id: 'admin-1', name: 'Admin User', email: 'admin@company.com', role: 'admin', status: 'active' },
    ]);
  }

  const categoriesCount = await db.collection('categories').countDocuments();
  if (categoriesCount === 0) {
    await db.collection('categories').insertMany([
      { name: 'Office Supplies' },
      { name: 'Travel' },
      { name: 'Meals' },
      { name: 'Software' },
      { name: 'Utilities' },
      { name: 'Marketing' },
    ]);
  }
}

