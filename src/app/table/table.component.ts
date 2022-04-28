import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IStudent} from "../models/istudent";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatDialog} from "@angular/material/dialog";
import {FormComponent} from "../form/form.component";
import {StudentsListService} from "../../services/students-list.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {map, Subject, takeUntil} from "rxjs";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy{

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[];
  public studentsData: IStudent[];
  public dataSource: MatTableDataSource<IStudent>;
  private unsubscribe$: Subject<boolean>;

  constructor(
    private liveAnnouncer: LiveAnnouncer,
    private studentService: StudentsListService,
    public dialog: MatDialog,
  )
  {
    this.displayedColumns = ['name', 'surname', 'age', 'edit-btn', 'btnDelete'];
    this.unsubscribe$ = new Subject<boolean>();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  ngOnInit() {
    this.getAllStudents();
  }

  public search($event: any) {
    this.dataSource.filter = $event.target.value;
  }

  public sortChange(sort: Sort) {
    if (sort.direction) {
      this.liveAnnouncer.announce(`Sorted ${sort.direction} ending`).then();
    } else {
      this.liveAnnouncer.announce(`Sorting cleared`).then();
    }
  }

  public dropSort($event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, $event.previousIndex, $event.currentIndex)
  }

  public editStudent(selectedStudent: IStudent) {
      this.openDialog('edit-btn', selectedStudent)
  }

  public createStudent() {
    this.openDialog('add-btn')
  }

  public openDialog(target: string, object?: IStudent): void {
    const dialogRef = this.dialog.open(FormComponent, {
      width: '400px',
      height: '380px',
      data: {target: target, object: object}
  });

    dialogRef.afterClosed()
      .subscribe(() => {
        this.getAllStudents();
      });
  }

  public getAllStudents() {
    this.studentService.getAllStudents().pipe(
      takeUntil(this.unsubscribe$),
      map(data => {
        return Object.keys(data)
          .map(key => ({
            ...data[key],
            id: key
          }))
      })
    ).subscribe(modData => {
      this.dataSource = new MatTableDataSource<IStudent>(modData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  public deleteStudent(id: string) {
      this.studentService.deleteStudent(id).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe();
      this.getAllStudents();
  }
}
