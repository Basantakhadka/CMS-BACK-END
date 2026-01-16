import Schema, {Field} from "./schema";


// Define a precise return type for the validateSchema function
type ValidationErrors = { [key: string]: string } | { [key: string]: ValidationErrors };

// Function to validate the schema
export function validateSchema(_schema: Schema, data: any): ValidationErrors {
  const errors: ValidationErrors = {};

  let schema = _schema.getSchema();
  
  for (const key in schema) {
    const fieldOrSchema = schema[key];


    if (fieldOrSchema instanceof Schema) {
      // Nested schema (object)
      const nestedSchema = fieldOrSchema;
      const nestedData = data[key];
      const nestedErrors = validateSchema(nestedSchema, nestedData);

      if (Object.keys(nestedErrors).length > 0) {
        errors[key] = nestedErrors;
      }
    } else {
      // Simple field
      const field = fieldOrSchema as Field;
      const value = data[key];
      const validationError = validateField(field, value);

      if (validationError) {
        errors[key] = validationError;
      }
    }
  }

  return errors;
}

// Function to validate a field
function validateField(field: Field, value: any): string | null {
  if (field.required && (value === undefined || value === "")) {
    return field.errorMessages?.required || `${field.label} is required.`;
  }

  return null;
}