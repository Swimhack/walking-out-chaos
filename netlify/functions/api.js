const path = require('path');

exports.handler = async (event, context) => {
  // For now, return a simple response since PHP backend needs conversion
  // This would need to be converted from PHP to Node.js for full functionality
  
  const { httpMethod, path: requestPath, body, headers } = event;
  
  // Health check endpoint
  if (requestPath.includes('/health')) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Request-ID',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: 'netlify',
        message: 'WOOC API is running on Netlify Functions'
      })
    };
  }
  
  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Request-ID',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      },
      body: ''
    };
  }
  
  // For demonstration - return mock responses for key endpoints
  if (requestPath.includes('/assessments') && httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        assessments: [
          {
            id: 1,
            assessment_type: 'quick',
            chaos_score: 6,
            created_at: new Date().toISOString(),
            ai_insights: ['Demo mode - Connect backend for full functionality']
          }
        ],
        pagination: {
          total: 1,
          limit: 20,
          offset: 0,
          has_more: false
        }
      })
    };
  }
  
  // Default response for unimplemented endpoints
  return {
    statusCode: 501,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      error: 'Not Implemented',
      message: 'This endpoint requires PHP backend conversion to Node.js for Netlify deployment',
      path: requestPath,
      method: httpMethod,
      note: 'Frontend demo mode active - backend conversion needed for full functionality'
    })
  };
};