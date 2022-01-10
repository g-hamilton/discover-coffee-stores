export const isEmptyObj = (obj) => {
  if (!obj) {
    return true; // return true even if not an object type
  }
  return Object.keys(obj).length === 0;
};
