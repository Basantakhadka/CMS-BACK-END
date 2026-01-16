import { LabelValuePair } from "../entities/label-value-pair.view";
export function parseStringToLabelValuePairUtils(
  data?: string
): LabelValuePair {
  if (data === null || data === undefined || data === "") {
    return null;
  }
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch (error) {
    return null;
  }
}

/**
 * Parses JSON from a string.
 * @param {string} jsonString - The JSON string to parse.
 * @returns {T | null} The parsed JSON object, or null if parsing fails.
 */
export function parseJsonFromString<T>(jsonString: string): T | null {
  if (!jsonString) {
    return null;
  }
  const parsedJson = JSON.parse(jsonString) as T;
  // Check if parsedJson is a valid JSON value`
  if (typeof parsedJson !== "object" || parsedJson === null) {
    return null;
  }
  return parsedJson;
}
export function areArraysIdentical<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;

  if (arr1.length === 0) return true;

  // Determine the type of the first element in the arrays
  const elementType = typeof arr1[0];

  if (elementType === "string") {
    return areStringArraysIdentical(arr1 as string[], arr2 as string[]);
  } else if (elementType === "object" && arr1[0] !== null) {
    return areObjectArraysIdentical(
      arr1 as LabelValuePair[],
      arr2 as LabelValuePair[]
    );
  } else {
    throw new Error("Unsupported array element type.");
  }
}

function areStringArraysIdentical(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

function areObjectArraysIdentical(
  arr1: LabelValuePair[],
  arr2: LabelValuePair[]
): boolean {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (!isEqual(arr1[i], arr2[i])) return false;
  }
  return true;
}

function isEqual(obj1: any, obj2: any): boolean {
  if (typeof obj1 !== typeof obj2) return false;

  if (typeof obj1 === "object" && obj1 !== null && obj2 !== null) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key) || !isEqual(obj1[key], obj2[key])) return false;
    }

    return true;
  }

  return obj1 === obj2;
}
