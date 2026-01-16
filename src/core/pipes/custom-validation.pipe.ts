import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { Result } from "@app/feature/common/result";
import { plainToClass } from "class-transformer";
import { ValidationError, validate } from "class-validator";
@Injectable()
export class CustomValidationPipe implements PipeTransform<any>{
    async transform(value:any , {metatype}: ArgumentMetadata){
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value,{});
        const errors = await validate(object,);
        if(errors.length > 0){
            const errorMessage = await this.getErrorMessageFromNestedErrorObjects(errors);
            return Result.createErrorWithMessage(new BadRequestException(errorMessage), errorMessage);
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }

    private async getErrorMessageFromNestedErrorObjects(errors: ValidationError[], errorMessageList:string[] = []): Promise<string> {
        errors.forEach((err)=> {                
            if(err.children && err.children.length > 0){
                this.getErrorMessageFromNestedErrorObjects(err.children, errorMessageList);
            }
            typeof err.constraints==='object' && Object.values(err.constraints).forEach((val)=> typeof val==='string' && errorMessageList.push(val))
        });
        return errorMessageList.join(', ');
    }
}