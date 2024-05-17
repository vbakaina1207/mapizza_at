export interface ITypeAdditionRequest {
    name: string;
    path: string;
    description: string;
    weight: string;
    price: number;
    imagePath: string;
    isSauce: boolean;
}

export interface ITypeAdditionResponse extends ITypeAdditionRequest {
    id: string | number;
}
