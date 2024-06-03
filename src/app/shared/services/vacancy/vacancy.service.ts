import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, Firestore, addDoc, collection, collectionData, deleteDoc, doc, docData, updateDoc } from '@angular/fire/firestore';
import { IVacancyRequest } from '../../interfaces/vacancy/vacancy.interface';


@Injectable({
    providedIn: 'root'
})
export class VacancyService {

    private vacancyCollection!: CollectionReference<DocumentData>;

constructor(private afs: Firestore
  ) {

    this.vacancyCollection = collection(this.afs, 'vacancies');

  }

    
  getAllFirebase() {
    return collectionData(this.vacancyCollection, { idField: 'id' });
  }

  getOneFirebase(id: string) {
    const vacancyDocumentReference = doc(this.afs, `vacancies/${id}`);
    return docData(vacancyDocumentReference, { idField: 'id' });
  }

  createFirebase(vacancy: IVacancyRequest) {
    return addDoc(this.vacancyCollection, vacancy);
  }

  updateFirebase(vacancy: IVacancyRequest, id: string) {
    const vacancyDocumentReference = doc(this.afs, `vacancies/${id}`);
    return updateDoc(vacancyDocumentReference, {...vacancy});
  }

  deleteFirebase(id: string) {
    const vacancyDocumentReference = doc(this.afs, `vacancies/${id}`);
    return deleteDoc(vacancyDocumentReference);
  }


}
