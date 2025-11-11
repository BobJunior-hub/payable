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
    const pathParts = event.path.split('/');
    const id = pathParts[pathParts.length - 2];

    if (event.httpMethod === 'PATCH') {
      const { status, userId } = JSON.parse(event.body);
      
      const expense = await expensesCollection.findOne({ id });
      if (!expense) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Expense not found' }),
        };
      }

      const updateData = { status };
      if (status === 'paid') {
        updateData.paidBy = userId;
        updateData.paidAt = new Date().toISOString().split('T')[0];
      } else {
        updateData.paidBy = null;
        updateData.paidAt = null;
      }

      await expensesCollection.updateOne({ id }, { $set: updateData });
      const updatedExpense = await expensesCollection.findOne({ id });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedExpense),
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

