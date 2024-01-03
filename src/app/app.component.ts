import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { Student } from './model/Student';
import { CrudService } from './service/crud.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild('studentForm') myStudentForm: NgForm;

  editMode: boolean = false;
  currentID: number;

  constructor(private serv: CrudService) {}

  allStudents: Student[] = [];

  ngOnInit(): void {
    this.getStudentsData();
  }

  onSubmit(students: Student) {
    console.log(students);

    if (!this.editMode) {
      this.serv.addStudent(students).subscribe({
        next: function (data) {
          console.log(data);
        },
        error: (err) => alert(err.message),
        complete: () => alert('completed'),
      });
    } else {
      students.studentId = this.currentID;
      this.serv.updateStudent(students).subscribe({
        next: (val) => console.log(val),
      });
    }

    location.reload();
  }

  getStudentsData() {
    this.serv.getStudent().subscribe({
      next: (data) => {
        this.allStudents = data;
        console.log(this.allStudents);
      },
    });
  }

  onDeleteStudent(id: number) {
    this.serv.deleteStudent(id).subscribe({
      next: (val) => alert(val),
    });
    location.reload();
  }

  onEditStudent(id: number) {
    this.currentID = id;

    // Get the student based on the ID
    let currentStudent = this.allStudents.find((arr) => {
      return arr.studentId == id;
    });

    console.log(currentStudent);

    // populate the form with the student details
    this.myStudentForm.setValue({
      studentName: currentStudent.studentName,
      studentAddress: currentStudent.studentAddress,
      studentAge: currentStudent.studentAge,
      studentEmail: currentStudent.studentEmail,
    });

    // change the button value from add student to update student
    this.editMode = true;
  }
}
