'use strict';

import Player from './model.js';

export default (capability) => {

  //*
  return (req, res, next) => {

    try {

      console.log('auth header', req.headers.authorization);

      let [authType, authString] = req.headers.authorization.split(/\s+/);

      console.log('auth info', authType, authString);

      // BASIC Auth  ... Authorization:Basic ZnJlZDpzYW1wbGU=
      // BEARER Auth ... Authorization:Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }

    } catch (e) {
      return _authError();
    }

    function _authBasic(authString) {
      let base64Buffer = Buffer.from(authString, 'base64'); // <Buffer 01 02...>
      let bufferString = base64Buffer.toString(); // john:mysecret
      let [username, password] = bufferString.split(':'); // variables username="john" and password="mysecret"
      let auth = {
        username,
        password,
      }; // {username:"john", password:"mysecret"}

      console.log('player info', auth);

      return Player.authenticateBasic(auth)
        .then(player => _authenticate(player));
    }

    function _authBearer(authString) {
      return Player.authenticateToken(authString)
        .then(player => _authenticate(player));
    }

    function _authenticate(player) {
      if (player && (!capability || (player.can(capability)))) {
        req.player = player;
        req.token = player.generateToken();
        next();
      } else {
        _authError();
      }
    }

    function _authError() {
      next({
        status: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid Player ID/Password',
      });
    }

  };
  //*/
};