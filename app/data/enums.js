
import Enum from '../utils/enum';

export const MESSAGE_TYPE = new Enum({
  UNKNOWN:  1<<0,
  REGISTER: 1<<1,
  EVENT:    1<<2,
  ACTION:   1<<3,
  CLOSE:    1<<4
});