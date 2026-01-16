enum Type {
  Text = "text",
  Password = "password",
  Section = "section",
}

interface Validation {
  criteria: number | string;
  errorMessage?: string;
}

interface Field {
  key: string;
  label: string;
  type: Type;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  validation?: Record<string, Validation>;
  fields?: Field[];
}

class Form {
  private fields: Field[];

  constructor(fields: Field[]) {
    this.fields = fields;
  }

  private mapFields(fields: Field[]): Field[] {
    return fields.map((field) => ({
      ...field,
      validation: prepareValidationWithErrorMessage(field),
      fields: field.fields ? this.mapFields(field.fields) : undefined,
    }));
  }

  toJSON() {
    return this.mapFields(this.fields);
  }
}

function prepareValidationWithErrorMessage(
  field: Field
): Record<string, Validation> | undefined {
  if (field.validation?.minLength) {
    field.validation.minLength.errorMessage =
      field.validation.minLength.errorMessage ||
      `${field.label} length must be minimum of ${field.validation.minLength.criteria}`;
  }
  if (field.validation?.maxLength) {
    field.validation.maxLength.errorMessage =
      field.validation.maxLength.errorMessage ||
      `${field.label} length must be maximum of ${field.validation.maxLength.criteria}`;
  }
  if (field.validation?.pattern) {
    field.validation.pattern.errorMessage =
      field.validation.pattern.errorMessage ||
      `${field.label} must be of pattern ${field.validation.pattern.criteria}`;
  }

  return field.validation;
}

export { Type, Field, Form };
