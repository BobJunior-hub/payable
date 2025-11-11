import { getCategories, getExpenses } from './db.js';

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
    const expensesCollection = await getExpenses();
    
    const pathParts = event.path.split('/');
    const categoryName = decodeURIComponent(pathParts[pathParts.length - 1]);

    if (event.httpMethod === 'DELETE') {
      // Check if category is in use
      const isUsed = await expensesCollection.findOne({ category: categoryName });
      if (isUsed) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Category is in use and cannot be deleted' }),
        };
      }

      await categoriesCollection.deleteOne({ name: categoryName });
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

