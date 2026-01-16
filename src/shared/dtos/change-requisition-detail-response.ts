export class Field{
    label:string;
    value:string;
}

export class ChangeRequisitionDetailResponseDto {
    id:string;
    refId:string;
    fields:Field[];
    originalValue:object;
    changedValue:object;
    type:string;
    status:string;
    requestedBy:string;
    userName:string;
}