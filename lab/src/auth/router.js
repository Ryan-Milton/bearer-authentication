'use strict';

import express from 'express';

const authRouter = express.Router();

import Player from './model.js';
import auth from './middleware.js';

// These routes should support a redirect instead of just spitting out the token ...
authRouter.post('/signup', (req, res, next) => {
  let player = new Player(req.body);
  player.save()
    .then( (player) => {
      req.token = player.generateToken();
      req.player = player;
      res.send(req.token);
    }).catch(next);
});

authRouter.post('/signin', auth(), (req, res) => {
  res.send(req.token);
});

export default authRouter;