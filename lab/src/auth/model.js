'use strict';

import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const schema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String},
  role: {type: String, required:true, default:'user', enum:['admin','editor','user'] },
});

const capabilities = {
  user: ['read'],
  editor: ['create', 'read','update'],
  admin: ['create', 'read', 'update', 'delete'],
};

schema.pre('save', function(next) {
  bcrypt.hash(this.password,10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch( error => {throw error;} );
});

schema.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};


schema.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then(player => player && player.comparePassword(auth.password))
    .catch(console.error);
};

schema.statics.authenticateToken = function(token) {
  let parsedToken = jwt.verify(token, process.env.APP_SECRET);
  let query = {_id:parsedToken.id};
  return this.findOne(query)
    .then(player => {
      return player;
    })
    .catch(error => error);
};

// Compare a plain text password against the hashed one we have saved
schema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};

// Generate a JWT from the user id and a secret
schema.methods.generateToken = function() {
  let tokenData = {
    id:this._id,
    capabilities: capabilities[this.role],
  };
  return jwt.sign(tokenData, process.env.APP_SECRET);
};

export default mongoose.model('players', schema);