import "node-libs-react-native/globals";
import { btoa } from "Base64";
import nodeUrl from "url";
import {polyfillGlobal} from 'react-native/Libraries/Utilities/PolyfillFunctions';

global.btoa = btoa;
global.URL = class URL {
  constructor(url) {
    return nodeUrl.parse(url);
  }
};

polyfillGlobal('URLSearchParams', () => require('whatwg-url').URLSearchParams);
polyfillGlobal('URL', () => require('whatwg-url').URL);

Object.defineProperty(Object, "assign", {
  value: function assign(target, varArgs) {
    "use strict";
    if (target == null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }

    let to = Object(target);

    for (let index = 1; index < arguments.length; index++) {
      let nextSource = arguments[index];

      if (nextSource != null) {
        for (let nextKey in nextSource) {
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  },
  writable: true,
  configurable: true
});
