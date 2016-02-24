import path from 'path';
import {EventEmitter} from 'events';

import express from 'express';
import bodyParser from 'body-parser';

import logger from '../logging/logger';

export default class HttpServer extends EventEmitter
{
  constructor(opts) {
    opts = opts || {};

    if (!opts.server) {
      throw new Error('Must provide `server`!');
    }
    
    super();

    this._baseServer = opts.server;
    
    this.server = express();

    // parse application/x-www-form-urlencoded...
    this.server.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json...
    this.server.use(bodyParser.json());    

    this._baseServer.on('request', this.server);    
  }
}