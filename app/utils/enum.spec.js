
import Enum from './enum';

import {customMatchers} from '../spec-helpers';
beforeEach(() => {
  jasmine.addMatchers(customMatchers);
});

describe('Utils#Enum', () => {

  it('should be a constructor function', () => {
    expect(Enum).toBeTypeof('function');
  });

  it('should provide integers when iterating', () => {
    const actuals = {
      RED: 1 << 0,
      GREEN: 1 << 1,
      BLUE: 1 << 2,
      CYAN: 1 << 1 | 1 << 2 // Same as `actuals.GREEN | actuals.BLUE`
    };

    const COLORS = new Enum(actuals);

    for (let c in COLORS) {
      expect(isNaN(c)).toBe(false);
    }
  });

  it('should provide a hasFlag method', () => {

    const actuals = {
      RED: 1 << 0,
      GREEN: 1 << 1,
      BLUE: 1 << 2,
      CYAN: 1 << 1 | 1 << 2 // Same as `actuals.GREEN | actuals.BLUE`
    };

    const COLORS = new Enum(actuals);

    let selectedColor = COLORS.CYAN;

    expect(COLORS.hasFlag(selectedColor, COLORS.GREEN)).toBe(true);
    expect(COLORS.hasFlag(selectedColor, COLORS.BLUE)).toBe(true);
    expect(COLORS.hasFlag(selectedColor, COLORS.RED)).toBe(false);
    expect(COLORS.hasFlag(selectedColor, 88)).toBe(false);
  });

  describe('From Object Hash', () => {
    it('should accept an object hash', () => {

      expect(() => {
        new Enum({
          RED: 1,
          GREEN: 2,
          BLUE: 3
        });
      }).not.toThrow();
    });

    it('should maintain the supplied integer values', () => {

      const actuals = {
        RED: 100,
        GREEN: 10,
        BLUE: 1
      };

      const COLORS = new Enum(actuals);

      for (let prop in actuals) {
        expect(COLORS[prop]).toBe(actuals[prop]);
      }
    });
  });

  describe('From String Array', () => {

    it('should accept an array of strings', () => {

      expect(() => {
        new Enum(['BANANA', 'ORANGE', 'APPLE'])
      }).not.toThrow();
    });

    it('should auto-flag an array of strings', () => {

      const expected = {
        'BANANA': 1 << 0,
        'ORANGE': 1 << 1,
        'APPLE': 1 << 2
      };

      const actuals = Object.keys(expected);

      const FRUITS = new Enum(actuals);

      for (let prop in expected) {
        expect(FRUITS[prop]).toBe(expected[prop]);
      }
    });
  });
});