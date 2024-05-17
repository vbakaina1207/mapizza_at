import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { IMassageRequest } from '../../interfaces/massage/massage.interface';


@Injectable({
    providedIn: 'root'
})
    

export class MassageService {

    private massageCollection!: CollectionReference<DocumentData>;
    

constructor(private afs: Firestore
    ) {
        this.massageCollection = collection(this.afs, 'massages');
    }
    
    getAllFirebase() {
        return collectionData(this.massageCollection, { idField: 'id' });
    }

    getOneFirebase(id: string) {
        const massageDocumentReference = doc(this.afs, `massages/${id}`);
        return docData(massageDocumentReference, { idField: 'id' });
    }

    createFirebase(massage: IMassageRequest) {
        return addDoc(this.massageCollection, massage);
    }

    updateFirebase(massage: IMassageRequest, id: string) {
        const massageDocumentReference = doc(this.afs, `massages/${id}`);
        return updateDoc(massageDocumentReference, {...massage});
    }

    deleteFirebase(id: string) {
        const massageDocumentReference = doc(this.afs, `massages/${id}`);
        return deleteDoc(massageDocumentReference);
    }

}
