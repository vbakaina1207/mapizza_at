import {IProductResponse} from "../product/product.interface";
import {Timestamp} from "@angular/fire/firestore";



export interface IOrderRequest {
  order_number: number;
  uid: string;
  date_order: Timestamp;
  total: number;
  status: boolean;
  product: IProductResponse[];
  name: string;
  phone: string;
  email: string;
  delivery_method: string;
  payment_method: string;
  cash: number;
  isWithoutRest: boolean;
  at_time: boolean;
  delivery_date: Date;
  delivery_time: string;
  self_delivery_address: string;
  city: string;
  street: string;
  house: string;
  entrance: string;
  flor: number;
  flat: string;
  use_bonus: boolean;
  summa_bonus: number;
  promocode: string;
  action: string;
  isCall: boolean;
  isComment: boolean;
  comment: string;
  discount: number;
  summa: number;
  address: []
}



export interface IOrderResponse extends IOrderRequest {
  id: string;
}
