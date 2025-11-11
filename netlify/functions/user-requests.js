import { getUserRequests } from './db.js';

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
    const requestsCollection = await getUserRequests();

    if (event.httpMethod === 'GET') {
      const requests = await requestsCollection.find({}).sort({ requestedAt: -1 }).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(requests),
      };
    }

    if (event.httpMethod === 'POST') {
      const { name, email } = JSON.parse(event.body);
      const request = {
        id: `req-${Date.now()}`,
        name,
        email,
        requestedAt: new Date().toISOString(),
        status: 'pending',
      };

      await requestsCollection.insertOne(request);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(request),
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

