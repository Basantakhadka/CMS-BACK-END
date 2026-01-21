import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { PasswordPolicy } from "./create-general-policy.dto";

@ValidatorConstraint({name:'customMinimumPasswordLength', async: false})
export class CustomMinimumPasswordLengthValidator implements ValidatorConstraintInterface{

    validate(minimumLength: number, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const {minimumUppercase, minimumNumbers, minimumSpecialCharacters} = validationArguments.object as PasswordPolicy;
        const sum = parseInt(minimumNumbers) + parseInt(minimumSpecialCharacters) + parseInt(minimumUppercase);
        if(sum <= minimumLength){
            return true;
        }
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        return 'The sum of minimum upper case, minimum numbers and minimum special characters should be less than or equal to the minimum length.';
    }
    
}