import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment'; 
import { ITypeProductRequest } from '../../interfaces/type-product/type-product.interface';
import {
  addDoc,
  collectionData,
  CollectionReference, deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  updateDoc,
  where
} from '@angular/fire/firestore';

import { collection, DocumentData } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class TypeProductService {

  private url = environment.BACKEND_URL;
  private api = { typesProduct: `${this.url}/typesProduct` };
  private typeProductCollection!: CollectionReference<DocumentData>;
  private productCollection!: CollectionReference<DocumentData>;
  
  constructor(
    private http: HttpClient,
    private afs: Firestore
  ) {
    this.typeProductCollection = collection(this.afs, 'typesProduct');
    this.productCollection = collection(this.afs, 'products');
  }


  getAllFirebase() {
    return collectionData(this.typeProductCollection, { idField: 'id' });
  }

  // getAllByCategoryFirebase(nameCategory: string) {
  //   let productByCategory  = query(this.typeProductCollection, (where ('category.path','==', `${nameCategory}`)));
  //   return collectionData(productByCategory,  { idField: 'id' });
  // }

  getOneFirebase(id: string) {
    const typeProductDocumentReference = doc(this.afs, `typesProduct/${id}`);
    return docData(typeProductDocumentReference, { idField: 'id' });
  }

  createFirebase(typeProduct: ITypeProductRequest) {
    return addDoc(this.typeProductCollection, typeProduct);
  }

  updateFirebase(typeProduct: ITypeProductRequest, id: string) {
    const typeProductDocumentReference = doc(this.afs, `typesProduct/${id}`);
    return updateDoc(typeProductDocumentReference, {...typeProduct});
  }

  deleteFirebase(id: string) {
    const typeProductDocumentReference = doc(this.afs, `typesProduct/${id}`);
    return deleteDoc(typeProductDocumentReference);
  }


}

