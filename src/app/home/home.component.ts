import { Component, inject, OnInit, ViewChild,Input, OnChanges, SimpleChanges, AfterViewInit   } from '@angular/core';
import { Firestore, getFirestore, collection, getDocs, addDoc, updateDoc, doc, deleteDoc, where, query, getDoc  } from 'firebase/firestore'; 
import { environment } from '../../environments/environment';
import { initializeApp } from 'firebase/app';
import { Employee } from '../employee';
import { MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TemplateRef } from '@angular/core';
import { EmployeeService } from '../services/employee.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatFormFieldModule,  
    MatInputModule,      
    MatButtonModule,     
    ReactiveFormsModule,
  MatIconModule,
MatTableModule,
FormsModule,
CommonModule
],

  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit  {
  data: any[] = []; 
  firestore: Firestore; 
  employees: Employee[] = [];
  searchQuery: string = '';
  employeeForm: FormGroup;
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any> | undefined;
  dialogRef: any;
  dialogTemplateAvailable: boolean = false;

  displayedColumns: string[] = ['employeeId', 'name', 'email', 'phone', 'actions'];

  constructor( private dialog: MatDialog, private fb: FormBuilder, private employeeService: EmployeeService, private router: Router) {
    const firebaseApp = initializeApp(environment.firebase);
    
    // console.log('Firebase initialized:', firebaseApp);
    
    this.firestore = getFirestore(firebaseApp);
    //console.log('Firestore initialized:', this.firestore);

    this.employeeForm = this.fb.group({
      employeeId : [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    });
  }

  async ngOnInit() {
    this.fetchEmployees(); 
  }

  ngAfterViewInit(): void {
    this.dialogTemplateAvailable = !!this.dialogTemplate; //!! this express boolean
  }

  async fetchEmployees(): Promise<void> {
    try {
      this.employees = await this.employeeService.fetchEmployees();
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  }

  openDialog(): void {
    this.employeeForm.reset()
    const dialogRef = this.dialog.open(this.dialogTemplate!, {
      width: '2000px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onSave(); 
      } 
    });
  }

  checkPhoneExists(phone: string) {
    const employeesRef = collection(this.firestore, 'Employees');
    const q = query(employeesRef, where("phone", "==", phone));
  
    return getDocs(q).then(querySnapshot => {
      return querySnapshot.empty;  // Returns true if no document with the same phone exists
    });
  }

  onSave(): void {
    if (this.employeeForm.valid) {
      const phone = this.employeeForm.value.phone;
      const newEmployeeId = this.employees.length ? Math.max(...this.employees.map(emp => emp.employeeId)) + 1 : 1;
      // Check if the phone number already exists
      this.checkPhoneExists(phone).then(isPhoneAvailable => {
        if (!isPhoneAvailable) {
          // If the phone number already exists, update the employee's data
          this.updateEmployeeWithPhone(phone);
        } else {
          // Otherwise, create a new employee
          const newEmployee: Employee = {
            employeeId: newEmployeeId,
            name: this.employeeForm.value.name,
            email: this.employeeForm.value.email,
            phone: this.employeeForm.value.phone,
          };
  
          addDoc(collection(this.firestore, 'Employees'), newEmployee)
            .then((docRef) => {
              console.log('Employee added to Firestore with ID', docRef.id);
              this.fetchEmployees();
              this.employeeForm.reset();
            })
            .catch((error) => {
              console.error('Error adding employee to Firestore: ', error);
            });
        } 
      });
    }
  }

  updateEmployeeWithPhone(phone: string): void {
    const employeesRef = collection(this.firestore, 'Employees');
    const q = query(employeesRef, where("phone", "==", phone));
  
    getDocs(q).then(querySnapshot => {
      if (!querySnapshot.empty) {
        // If a matching employee is found, update their data
        const employeeDoc = querySnapshot.docs[0];  // Assuming we get the first match
  
        const updatedEmployeeData = {
          name: this.employeeForm.value.name,
          email: this.employeeForm.value.email,
          phone: this.employeeForm.value.phone,
        };
  
        const employeeRef = doc(this.firestore, 'Employees', employeeDoc.id);
        updateDoc(employeeRef, updatedEmployeeData)
          .then(() => {
            console.log('Employee updated in Firestore!');
            this.fetchEmployees();
            this.employeeForm.reset();
          })
      } 
    })
  }
  
  editEmployee(employeeId: number): void {
    console.log('Opening dialog to edit employee:', employeeId);
    const employee = this.employees.find(emp => emp.employeeId === employeeId);

  if (employee) {
    this.employeeForm.patchValue(employee);
    
    const dialogRef = this.dialog.open(this.dialogTemplate!, {
      width: '2000px',
      data: employee,  
    });

    dialogRef.afterClosed().subscribe((updatedEmployee: Employee) => {
      if (updatedEmployee) {
        this.onSave();
      }
    });
  } 
  }

  deleteEmployee(employeeId: number): void {
    const employeesRef = collection(this.firestore, 'Employees');
    
    const q = query(employeesRef, where("employeeId", "==", employeeId));

    getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((docSnapshot) => {
          console.log('Deleting document with ID:', docSnapshot.id);
          deleteDoc(docSnapshot.ref)
            .then(() => {
              console.log('Employee deleted from Firestore');
              this.fetchEmployees();
              // alert('Employee deleted successfully!');
            })
        });
      })
  }
  
  get filteredEmployees() {
    return this.employees.filter(emp => {
      return emp.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
             emp.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
             emp.phone.includes(this.searchQuery);
    });
  }
  
  }
