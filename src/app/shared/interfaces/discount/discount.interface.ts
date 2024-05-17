import {Timestamp} from "@angular/fire/firestore";

export interface IDiscountRequest {
    date: Timestamp;
    name: string;
    title: string;
    description: string;
    imagePath: string;
}

export interface IDiscountResponse extends IDiscountRequest {
    id:  string;
}
