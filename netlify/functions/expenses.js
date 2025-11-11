import { getExpenses } from './db.js';

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
    const expensesCollection = await getExpenses();

    if (event.httpMethod === 'GET') {
      const expenses = await expensesCollection.find({}).sort({ createdAt: -1 }).toArray();
      
      // Ensure all expenses have createdAt
      const expensesWithCreatedAt = expenses.map(exp => {
        if (!exp.createdAt) {
          const timestamp = exp.id.replace('exp-', '');
          exp.createdAt = timestamp ? new Date(parseInt(timestamp)).toISOString() : new Date().toISOString();
        }
        return exp;
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(expensesWithCreatedAt),
      };
    }

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body);
      const expense = {
        ...body,
        id: `exp-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      await expensesCollection.insertOne(expense);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(expense),
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

