import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IDialogData} from "../models/idialog-data";
import {Subject, takeUntil} from "rxjs";
import {StudentsListService} from "../services/students-list.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public target: boolean = false;
  private unsubscribe$: Subject<boolean>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    public dialogRef: MatDialogRef<FormComponent>,
    private formBuilder: FormBuilder,
    private studentService: StudentsListService
  )
  { this.unsubscribe$ = new Subject<boolean>(); }

  ngOnInit(): void {
    this.definitionTarget(this.data)
    this.formInitialization();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  private formInitialization() {
    this.form = this.formBuilder.group({
      name: new FormControl(this.target ? null : this.data.object.name, [Validators.required, Validators.pattern(/[a-z]{3,16}$/)]),
      surname: new FormControl(this.target ? null : this.data.object.surname, [Validators.required, Validators.pattern(/[a-z]{3,16}$/)]),
      age: new FormControl(this.target ? null : this.data.object.age, [Validators.required, Validators.min(18), Validators.max(90)])
    })
  }

  public closeModal() {
    this.dialogRef.close();
  }

  public createStudent() {
    this.studentService.addStudent({
      name: this.form.value.name,
      surname: this.form.value.surname,
      age: this.form.value.age
    }).pipe(
      takeUntil(this.unsubscribe$)).subscribe(() =>  this.dialogRef.close());
  }

  public editStudent() {
    this.studentService.updateStudentInfo(this.form.value, this.data.object.id).pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(() => this.dialogRef.close());
  }

  public definitionTarget(currentTarget: IDialogData) {
    currentTarget.target === 'add-btn' ? this.target = true : this.target = false
  }
}
