
export default class Dictionary extends Map
{
  constructor(items) {
    super();

    // Allow array pairs...    
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        this.set(items[i][0], items[i][1]);
      }
    // And hash objects...
    } else {
      for (let key in items) {
        this.set(key, items[key]);
      }
    }
  }
  
  get count() {
    let c = 0;
    this.forEach((value, key) => c++);
    return c;
  }
  
  set(key, value) {
    if (typeof key !== 'string') throw new Error(`Dictionary 'key' must be a string! (Actual type '${typeof key}')`);
    
    if (this.has(key)) throw new Error('Key already present in Dictionary!');
    
    super.set(key, value);
  }
  
  // Spits out an object, which is fine since all keys are strings...
  toJSON() {
    let obj = Object.create(null);
    this.forEach((value, key) => obj[key] = value);
    return obj;
  }
}  