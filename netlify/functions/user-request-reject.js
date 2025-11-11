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
    const pathParts = event.path.split('/');
    const requestId = pathParts[pathParts.length - 2];
    
    const requestsCollection = await getUserRequests();

    if (event.httpMethod === 'PATCH') {
      const request = await requestsCollection.findOne({ id: requestId });
      if (!request || request.status !== 'pending') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Request not found or already processed' }),
        };
      }

      await requestsCollection.updateOne(
        { id: requestId },
        { $set: { status: 'rejected' } }
      );

      const updatedRequest = await requestsCollection.findOne({ id: requestId });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedRequest),
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

