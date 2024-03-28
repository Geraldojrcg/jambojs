export function validateObjectRecursive(object) {
  if (object && Object.keys(object).length) {
    Object.keys(object).forEach((key) => {
      if (object[key] === "undefined") {
        object[key] = undefined;
      }
      if (object[key] === "null") {
        object[key] = null;
      }
      if (typeof object[key] === "object") {
        validateObjectRecursive(object[key]);
      }
      if (Array.isArray(object[key])) {
        object[key].forEach((child) => {
          validateObjectRecursive(child);
        });
      }
    });
  }
}
