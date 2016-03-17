import {connect, Document, EmbeddedDocument} from 'camo';
import appData from '../utils/app-data';

let database;
connect('nedb://' + appData.dir('data').cwd()).then(function(db) {
  database = db;
});


export class Event extends EmbeddedDocument
{
  constructor() {
    super();
    
    this.name = String;
    this.data = Object;
  }
}

export class Action extends EmbeddedDocument
{
  constructor() {
    super();
    
    this.name = String;
    this.params = [Object];
  }
}

export class Client extends Document {
  constructor() {
    super();

    this.name = String;
    this.connected = Date;
    
    this.events = [Object];
    this.actions = [Object];
  }
}

export class Rule extends Document {
  constructor() {
    super();

    this.name = String;
    this.enabled = Boolean;
    this.lastRan = Date;
    
    // if
    this.source = Client;
    this.eventName = String;
    
    // then
    this.target = Client;
    this.actionName = String;
  }
}