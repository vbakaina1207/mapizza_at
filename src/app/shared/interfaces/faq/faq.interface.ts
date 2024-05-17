import { Timestamp } from "@angular/fire/firestore";

export interface IFaqRequest {
    name: string;
    email: string;
    phone: string;
    stars: number;
    comments: string;
    imagePath: string;
    date_massage: Timestamp;
}

export interface IFaqResponse extends IFaqRequest {
    id: number | string;
}
