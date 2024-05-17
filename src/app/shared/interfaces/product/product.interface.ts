import { ICategoryResponse } from "../category/category.interface";
import { ITypeAdditionResponse } from "../type-addition/type-addition.interfaces";
import { ITypeProductResponse } from "../type-product/type-product.interface";

export interface IProductRequest {
    category: ICategoryResponse;
    type_product: ITypeProductResponse;
    type_addition: ITypeAdditionResponse[];
    selected_addition: ITypeAdditionResponse[];
    name: string;
    path: string;
    ingredients: string;
    weight: string;
    price: number;
    addition_price: number;
    bonus:number;
    imagePath: string;
    count: number
}

export interface IProductResponse extends IProductRequest {
    id: number | string;
}
