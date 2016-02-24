
export default class Enum
{
  constructor(keys) {
    
    // Convert array of keys into object hash...  
    if (Array.isArray(keys)) {
      let keyArray = keys;
      keys = Object.create(null); 
      for (let i = 0; i < keyArray.length; i++) {
        keys[keyArray[i]] = 1<<i;
      }
    }
    
    _init.call(this, keys);
  }
  
  // Helper method, used to check if an arbitrary value equals/contains a enum value.
  hasFlag(enumValue, flag) {
    return _hasFlag(enumValue, flag);
  }
}

// Add the helper method to the Enum class...
Enum.hasFlag = _hasFlag;

function _hasFlag(enumValue, flag) {
  return (enumValue & flag) == flag;
}

// Provides an easy method to check if a flag is set.


function _init(keys) {
  for (let key in keys) {
    let props = {};
    props[key] = {
      enumerable: false,
      value: keys[key]
    };
    props[keys[key]] = {
      enumerable: true,
      value: key
    };

    Object.defineProperties(this, props);
  }
}