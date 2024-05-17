import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
    addDoc,
    collectionData,
    CollectionReference,
    doc,
    Firestore, increment, orderBy, query, where,
    updateDoc
} from '@angular/fire/firestore';
import { collection, DocumentData } from '@firebase/firestore';
import { IOrderRequest } from '../../interfaces/order/order.interface';


@Injectable({
    providedIn: 'root'
})
export class OrderService {

    public changeBasket = new Subject<boolean>();
    private orderCollection!: CollectionReference<DocumentData>;


    constructor(
        private afs: Firestore,

    ) {
        this.orderCollection = collection(this.afs, 'orders');
    }


    getAllFirebase() {
        const orderCollectionSort = query(this.orderCollection, orderBy ('date_order', 'desc'));
        return collectionData(orderCollectionSort, { idField: 'id' });
    }

    getUserFirebase(uid: string) {
        const orderCollectionSort = query(this.orderCollection, where ('uid', '==', `${uid}`), orderBy ('date_order', 'desc'));
        return collectionData(orderCollectionSort, { idField: 'id' });
    }

    createFirebase(order: IOrderRequest) {
        return addDoc(this.orderCollection, order);
    }

    updateFirebase(order: IOrderRequest, id: string) {
        const orderDocumentReference = doc(this.afs, `orders/${id}`);
        return updateDoc(orderDocumentReference, {...order});
    }

}
