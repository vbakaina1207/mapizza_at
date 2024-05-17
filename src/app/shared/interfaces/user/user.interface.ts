//import { IAddressResponse } from "../user/user.interface";


// export interface IUserRequest {
    
//     address: [IAddressResponse];
//     name: string;
//     path: string;
//     ingredients: string;
//     weight: string;
//     price: number;
//     bonus:number;
//     imagePath: string;
//     count: number
// }

// export interface IUserResponse extends IUserRequest {
//     id: string;
// }

export interface IAddressRequest {
    typeAddress: string;
    city: string;
    street: string;
    house: string;
    entrance: number;
    floor: number;
    flat: number;
}

export interface IAddressResponse extends IAddressRequest {
    id: string;
}
