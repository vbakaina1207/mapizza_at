import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ITypeAdditionRequest } from '../../interfaces/type-addition/type-addition.interfaces';
import {
  addDoc,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  Firestore, query,
  updateDoc, where
} from '@angular/fire/firestore';

import { collection, DocumentData } from '@firebase/firestore';


@Injectable({
  providedIn: 'root'
})
    
export class AdditionProductService {

private url = environment.BACKEND_URL;
  private api = { additionProduct: `${this.url}/additionProduct` };
  private additionProductCollection!: CollectionReference<DocumentData>;
  constructor(
    private http: HttpClient,
    private afs: Firestore
  ) {
    this.additionProductCollection = collection(this.afs, 'additionProduct');
  }

  getAllFirebase() {
    return collectionData(this.additionProductCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const additionProductDocumentReference = doc(this.afs, `additionProduct/${id}`);
    return docData(additionProductDocumentReference, { idField: 'id' });
  }

  getAllBySauceFirebase(isSauce: boolean) {
    // let additionProductBySauce = query(this.additionProductCollection, where('isSauce', '==', `${isSauce}`));    
    let additionProductBySauce = query(this.additionProductCollection, where('isSauce', '==', isSauce)); 
      return collectionData(additionProductBySauce,  { idField: 'id' });
  }

  createFirebase(additionProduct: ITypeAdditionRequest) {
    return addDoc(this.additionProductCollection, additionProduct);
  }

  updateFirebase(additionProduct: ITypeAdditionRequest, id: string) {
    const additionProductDocumentReference = doc(this.afs, `additionProduct/${id}`);
    return updateDoc(additionProductDocumentReference, {...additionProduct});
  }

  deleteFirebase(id: string) {
    const additionProductDocumentReference = doc(this.afs, `additionProduct/${id}`);
    return deleteDoc(additionProductDocumentReference);
  }


}
