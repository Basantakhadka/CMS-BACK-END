export function checkArgument(value: unknown, name: string) {
  if (!value) {
    throw new Error(`The argument "${name}" cannot be empty`);
  }
}

export default async function filterAsync<T>(
  array: readonly T[],
  callback: (value: T, index: number) => Promise<boolean>
): Promise<T[]> {
  checkArgument(array, "array");
  checkArgument(callback, "callback");

  const results: boolean[] = await Promise.all(
    array.map((value, index) => callback(value, index))
  );
  return array.filter((_, i) => results[i]);
}

/**
 * Recursive diff between two objects or arrays
 * @param {Object|Array|null} base    Object, array, or null to compare with
 * @param {Object|Array} object       Object or array to compare
 * @param {Object} entity             Entity object (assuming you have it)
 * @returns {Array}                  Return an array of objects that represent the diff
 */

export function differenceBetweenObjects(base: any, object: any, entity: any, defaultValue = "-") {
  if (base === null) {
    return Object.keys(object).map((k) => {
      return {
        fieldName: entity?.getFieldNameToBeDisplayed(k),
        newValue: object[k] || defaultValue,
        oldValue: defaultValue,
        isChanged: false,
      };
    });
  }

  if (Array.isArray(object)) {
    if (Array.isArray(base)) {
      if (base.length === 1) {
        const diffObject = {
          fieldName: entity?.getFieldNameToBeDisplayed(Object.keys(object)[0]),
          newValue: object || defaultValue,
          oldValue: base || defaultValue,
          hasChanged: JSON.stringify(base) !== JSON.stringify(object),
        };
        return [diffObject];
      } else {
        return object.map((item, index) => {
          if (index < base.length) {
            return differenceBetweenObjects(base[index], item, entity);
          } else {
            return item;
          }
        });
      }
    } else {
      return object;
    }
  }

  if (typeof object === "object" && !Array.isArray(object)) {
    let diff = [];

    for (let k in object) {
      if (Array.isArray(object[k])) {
        const diffObject = {
          fieldName: entity?.getFieldNameToBeDisplayed(k),
          newValue: object[k] || defaultValue,
          oldValue: base[k] || defaultValue,
          hasChanged: JSON.stringify(base[k]) !== JSON.stringify(object[k]),
        };
        diff.push(diffObject);
      } else if (typeof object[k] !== "object") {
        const hasChanged = base[k] !== object[k];
        const diffObject = {
          fieldName: entity?.getFieldNameToBeDisplayed(k),
          newValue: object[k] || defaultValue,
          oldValue: base[k] || defaultValue,
          hasChanged: hasChanged,
        };
        diff.push(diffObject);
      } else {
        let subDiff = differenceBetweenObjects(base[k], object[k], entity);
        if (Object.keys(subDiff).length > 0) {
          diff.push(subDiff);
        }
      }
    }

    return diff;
  }

  return [];
}


/**
 * Recursive diff between two objects or arrays
 * @param {Object|Array} base    Object or array to compare with
 * @param {Object|Array} object  Object or array to compare
 * @param {Object} entity        Entity object (assuming you have it)
 * @returns {Object|Array}       Return a new object or array that represents the diff
 */
export function differenceBetweenObjectsAndReturnWithObject(base: any, object: any, entity: any, defaultValue = "-") {
  if (base === null) {
    return Object.keys(object).map((k) => {
      return {
        fieldName: entity?.getFieldNameToBeDisplayed(k),
        newValue: object[k] || defaultValue,
        oldValue: defaultValue,
        isChanged: false,
      };
    });
  }

  if (Array.isArray(object)) {
    if (Array.isArray(base)) {
      if (base.length === 1) {
        return {
          fieldName: entity?.getFieldNameToBeDisplayed(Object.keys(object)[0]),
          newValue: object || defaultValue,
          oldValue: base || defaultValue,
          hasChanged: JSON.stringify(base) !== JSON.stringify(object),
        };
      } else {
        return object.map((item, index) => {
          if (index < base.length) {
            return differenceBetweenObjects(base[index], item, entity);
          } else {
            return item;
          }
        });
      }
    } else {
      return object;
    }
  }

  if (typeof object === "object" && !Array.isArray(object)) {
    let diff = {};

    for (let k in object) {
      if (Array.isArray(object[k])) {
        diff[k] = {
          fieldName: entity?.getFieldNameToBeDisplayed(k),
          newValue: object[k] || defaultValue,
          oldValue: base[k] || "-",
          hasChanged: JSON.stringify(base[k]) !== JSON.stringify(object[k]),
        };
      } else if (typeof object[k] !== "object") {
        if (base[k] !== object[k]) {
          diff[k] = {
            fieldName: entity?.getFieldNameToBeDisplayed(k),
            newValue: object[k] || defaultValue,
            oldValue: base[k] || defaultValue,
            hasChanged: true,
          };
        } else {
          diff[k] = {
            fieldName: entity?.getFieldNameToBeDisplayed(k),
            newValue: object[k] || defaultValue,
            oldValue: base[k] || defaultValue,
            hasChanged: false,
          };
        }
      } else {
        let subDiff = differenceBetweenObjects(base[k], object[k], entity);
        diff[k] = subDiff;
      }
    }

    return diff;
  }

  return object;
}

/**
 * function to compare and initialize empty fields from a class if the field is not present
 * @param data data that needs to be compared with the class 
 * @param dto class with default values
 * @returns instance of the class with data 
 */
export async function compareAndIntializeFieldsFromClass(data: any, dto:any){
  function initializeKeys(dto: any, keys: any) {
    for (const key in dto) {
      if (keys.hasOwnProperty(key)) {
        if (typeof dto[key] === 'object' && !Array.isArray(dto[key])) {
          initializeKeys(dto[key], keys[key]);
        } else {
          dto[key] = keys[key];
        }
      } else {
        if (typeof dto[key] === 'object' && !Array.isArray(dto[key])) {
          initializeKeys(dto[key], dto[key]);
        }
        else if (Array.isArray(dto[key])) {
          dto[key] = [];
        } else {
          dto[key] = '';
        }
      }
    }
    return dto;
  }
  const transformedData = new dto();
  initializeKeys(transformedData, data);
  return transformedData;
}



