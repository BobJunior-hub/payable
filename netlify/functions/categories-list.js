import { getCategories } from './db.js';

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const categoriesCollection = await getCategories();

    if (event.httpMethod === 'GET') {
      const categories = await categoriesCollection.find({}).toArray();
      const categoryNames = categories.map(c => c.name);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(categoryNames),
      };
    }

    if (event.httpMethod === 'POST') {
      const { name } = JSON.parse(event.body);
      const trimmedName = name.trim();
      
      const existing = await categoriesCollection.findOne({ name: trimmedName });
      if (existing) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Category already exists' }),
        };
      }

      await categoriesCollection.insertOne({ name: trimmedName });
      const categories = await categoriesCollection.find({}).toArray();
      const categoryNames = categories.map(c => c.name);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, categories: categoryNames }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}

