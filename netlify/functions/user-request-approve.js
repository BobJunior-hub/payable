import { getUserRequests, getUsers } from './db.js';

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
    const usersCollection = await getUsers();

    if (event.httpMethod === 'PATCH') {
      const { role, approvedBy } = JSON.parse(event.body);
      
      const request = await requestsCollection.findOne({ id: requestId });
      if (!request || request.status !== 'pending') {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Request not found or already processed' }),
        };
      }

      // Update request status
      await requestsCollection.updateOne(
        { id: requestId },
        {
          $set: {
            status: 'approved',
            role,
            approvedBy,
            approvedAt: new Date().toISOString(),
          },
        }
      );

      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name: request.name,
        email: request.email,
        role,
        status: 'active',
      };

      await usersCollection.insertOne(newUser);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(newUser),
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

