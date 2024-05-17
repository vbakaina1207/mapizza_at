import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ICategoryRequest } from '../../interfaces/category/category.interface';
import {
    addDoc,
    collectionData,
    CollectionReference,
    deleteDoc,
    doc,
    docData,
    Firestore,
    updateDoc
} from '@angular/fire/firestore';
import { DocumentData, collection } from '@firebase/firestore';

@Injectable({
    providedIn: 'root'
})
    
export class CategoryService {

    // private url = environment.BACKEND_URL;
    private categoryCollection!: CollectionReference<DocumentData>;


constructor(private afs: Firestore
    ) {
        this.categoryCollection = collection(this.afs, 'categories');
    }
    
    getAllFirebase() {
        return collectionData(this.categoryCollection, { idField: 'id' });
    }

    getOneFirebase(id: string) {
        const categoryDocumentReference = doc(this.afs, `categories/${id}`);
        return docData(categoryDocumentReference, { idField: 'id' });
    }

    createFirebase(category: ICategoryRequest) {
        return addDoc(this.categoryCollection, category);
    }

    updateFirebase(category: ICategoryRequest, id: string) {
        const categoryDocumentReference = doc(this.afs, `categories/${id}`);
        return updateDoc(categoryDocumentReference, {...category});
    }

    deleteFirebase(id: string) {
        const categoryDocumentReference = doc(this.afs, `categories/${id}`);
        return deleteDoc(categoryDocumentReference);
    }

}
