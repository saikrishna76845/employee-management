// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));

import { bootstrapApplication } from '@angular/platform-browser';
import { HomeComponent } from './app/home/home.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

bootstrapApplication(HomeComponent, {
  providers: [provideFirebaseApp(() => initializeApp({ projectId: "employee-management-58ab3", appId: "1:424429851154:web:ed6bee56faa7bfa8a37ecb", databaseURL: "https://employee-management-58ab3-default-rtdb.firebaseio.com", storageBucket: "employee-management-58ab3.firebasestorage.app", apiKey: "AIzaSyAIVQuTXA4Im26nR-cB1CpNHg3Ugj46dM4", authDomain: "employee-management-58ab3.firebaseapp.com", messagingSenderId: "424429851154", measurementId: "G-EHR8B09LZV" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "employee-management-58ab3", appId: "1:424429851154:web:ed6bee56faa7bfa8a37ecb", databaseURL: "https://employee-management-58ab3-default-rtdb.firebaseio.com", storageBucket: "employee-management-58ab3.firebasestorage.app", apiKey: "AIzaSyAIVQuTXA4Im26nR-cB1CpNHg3Ugj46dM4", authDomain: "employee-management-58ab3.firebaseapp.com", messagingSenderId: "424429851154", measurementId: "G-EHR8B09LZV" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({ projectId: "employee-management-58ab3", appId: "1:424429851154:web:ed6bee56faa7bfa8a37ecb", databaseURL: "https://employee-management-58ab3-default-rtdb.firebaseio.com", storageBucket: "employee-management-58ab3.firebasestorage.app", apiKey: "AIzaSyAIVQuTXA4Im26nR-cB1CpNHg3Ugj46dM4", authDomain: "employee-management-58ab3.firebaseapp.com", messagingSenderId: "424429851154", measurementId: "G-EHR8B09LZV" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
}).catch(err => console.error(err));


