import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { IFaqRequest } from '../../interfaces/faq/faq.interface';

@Injectable({
    providedIn: 'root'
})
    
export class FaqService {

    private faqCollection!: CollectionReference<DocumentData>;

    constructor(private afs: Firestore) {
    this.faqCollection = collection(this.afs, 'faqs');
    }
    
    getAllFirebase() {
        return collectionData(this.faqCollection, { idField: 'id' });
    }

    getOneFirebase(id: string) {
        const faqDocumentReference = doc(this.afs, `faqs/${id}`);
        return docData(faqDocumentReference, { idField: 'id' });
    }

    createFirebase(faq: IFaqRequest) {
        return addDoc(this.faqCollection, faq);
    }

}
