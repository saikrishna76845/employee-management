import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, updateDoc, deleteDoc, query, where, getDoc, doc } from 'firebase/firestore';
import { Employee } from '../employee';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  firestore: Firestore;

  constructor() { const firebaseApp = initializeApp(environment.firebase);
    this.firestore = getFirestore(firebaseApp);}

    async fetchEmployees(): Promise<Employee[]> {
      const employees: Employee[] = [];
      const itemsCollection = collection(this.firestore, 'Employees');
      try {
        const querySnapshot = await getDocs(itemsCollection);
        querySnapshot.forEach((doc) => {
          employees.push(doc.data() as Employee);
        });
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
      return employees;
    }

 

}