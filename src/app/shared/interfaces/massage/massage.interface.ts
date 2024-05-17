import { Timestamp } from "@angular/fire/firestore";

export interface IMassageRequest {
    name: string;
    phone: string;
    email: string;
    description: string;
    imagePath: string;
    date_massage: Timestamp;
}

export interface IMassageResponse extends IMassageRequest {
    id: number | string;
}
