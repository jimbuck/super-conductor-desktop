
import Dictionary from './dictionary';

describe('Utils#Dictionary', () => {

  it('should be a constructor function', () => {
    expect(typeof Dictionary).toBe('function');
  });

  it('should fail for non-string keys', () => {

    const d = new Dictionary();

    expect(() => {
      d.set(4, {});
    }).toThrow();
  });

  it('should fail for duplicate keys', () => {

    const d = new Dictionary();
    const key = 'test';
    const expectedValue = 4;

    expect(() => {
      d.set(key, expectedValue);
      d.set(key, 6);
    }).toThrow();

    expect(d.get(key)).toBe(expectedValue);
  });
});