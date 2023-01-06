import { encrypt } from "decrypt-core";
const key = "159strongest-qiang-110119120";
export function useKey() {
  const array = [];
  Array.from(arguments).forEach((item) => {
    array.push(encrypt(item, key));
  });
    return array;
}
