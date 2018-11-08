'use strict';

// Custom Error Handler because we always want to return a JSON response
export default  (err,request,response) => {
  let error = {
    error:(typeof err==='object' && err.message) || err,
  };
  response.statusCode = (typeof err==='object' && err.status) || 500;
  response.statusMessage = (typeof err==='object' && err.statusMessage) || 'Server Error';
  response.setHeader('Content-Type', 'application/json');
  response.write( JSON.stringify(error) );
  response.end();
};