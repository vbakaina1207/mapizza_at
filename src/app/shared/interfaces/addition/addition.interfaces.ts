import { ITypeAdditionResponse } from "../type-addition/type-addition.interfaces"; 

export interface IAdditionRequest {
    type_addition: ITypeAdditionResponse;
    name: string;
    description: string;
    weight: string;
    price: number;
    path: string;
    imagePath: string;
}

export interface IAdditionResponse extends IAdditionRequest {
    id: number | string;
}
