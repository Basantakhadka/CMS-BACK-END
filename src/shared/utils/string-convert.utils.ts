export function camelToSnake(camelCaseString: string): string {
  if (!camelCaseString) {
    throw new Error("Input string must not be empty or null");
  }
  // Check if the input string is already in snake_case
  if (/^[a-z_]+$/.test(camelCaseString)) {
    return camelCaseString;
  }
  return camelCaseString.replace(
    /[A-Z]/g,
    (match) => `_${match.toLowerCase()}`
  );
}
