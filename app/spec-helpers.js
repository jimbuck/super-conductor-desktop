
export const customMatchers = {

  toBeTypeof: function(util, customEqualityTesters) {

    return {

      compare: function(actual, expected) {
        
        if (typeof expected === 'undefined') {
          throw new Error(`Expected type was 'undefined'!`);
        }
        
        let result = {};
        
        result.pass = typeof actual === expected;
        
        if (result.pass) {
          result.message = 'Expected ' + actual + ' to not be a type of ' + expected;
        } else {
          result.message = 'Expected ' + actual + ' to be a type of ' + expected;
        }
        
        return result;
      }
    };
  },  
  toBeInstanceOf: function(util, customEqualityTesters) {

    return {

      compare: function(actual, expected) {
        
        if (typeof expected === 'undefined') {
          throw new Error(`Expected type was 'undefined'!`);
        }
        
        let result = {};
        
        result.pass = actual instanceof expected;
        
        if (result.pass) {
          result.message = 'Expected ' + actual + ' to not be an instance of ' + expected;
        } else {
          result.message = 'Expected ' + actual + ' to be an instance of ' + expected;
        }
        
        return result;
      }
    };
  }
}