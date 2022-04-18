import { Validatable } from "../model/validatable";

//method which will actually perform validation
export function validate(validatable: Validatable): boolean {
    let isValid = true;
  
    if (validatable.required) {
      isValid = isValid && validatable.value.toString().trim().length != 0;
    }
    if (validatable.minLength != null && typeof validatable.value === "string") {
      isValid =
        isValid &&
        validatable.value.toString().trim().length > validatable.minLength;
    }
    if (validatable.maxLength != null && typeof validatable.value === "string") {
      isValid =
        isValid &&
        validatable.value.toString().trim().length <= validatable.maxLength;
    }
    if (validatable.min != null && typeof validatable.value === "number") {
      isValid = isValid && +validatable.value > validatable.min;
    }
    if (validatable.max != null && typeof validatable.value === "number") {
      isValid = isValid && +validatable.value <= validatable.max;
    }
    return isValid;
  }
  