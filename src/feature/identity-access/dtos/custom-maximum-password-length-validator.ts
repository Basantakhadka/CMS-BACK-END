import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PasswordPolicy } from "./create-general-policy.dto";

@ValidatorConstraint({name:'customMaximumPasswordLength', async: false})
export class CustomMaximumPasswordLengthValidator implements ValidatorConstraintInterface{
    validate(maximumLength: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const {minimumLength} = validationArguments.object as PasswordPolicy;
        if(maximumLength >= parseInt(minimumLength)){
            return true;
        }
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return `Maximum password length must be greater or equal to minimum length`
    }    
}
