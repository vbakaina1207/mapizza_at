export interface ITypeProductRequest {
    name: string;
    path: string;
    imgPath: string;
}

export interface ITypeProductResponse extends ITypeProductRequest {
    id: string | number;
}
