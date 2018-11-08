'use strict';

// Custom 404 Handler because we always want to return a JSON response
export default (request,response) => {
  let error = {error:'Resource Not Found'};
  response.statusCode = 404;
  response.statusMessage = 'Not Found';
  response.setHeader('Content-Type', 'application/json');
  response.write( JSON.stringify(error) );
  response.end();
};