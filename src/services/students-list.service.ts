import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IStudent} from "../app/models/istudent";
import {Observable} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StudentsListService {

  constructor(private http: HttpClient) { }

  public getAllStudents(): Observable<IStudent[]> {
    return this.http.get<IStudent[]>(`${environment.localDBUrl}/students.json`);
  }

  public addStudent(student: IStudent): Observable<void> {
    return this.http.post<void>(`${environment.localDBUrl}/students.json`, student);
  }

  public deleteStudent(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.localDBUrl}/students/${id}.json`)
  }

  public updateStudentInfo(student: IStudent, id: number): Observable<IStudent> {
    return this.http.put<IStudent>(`${environment.localDBUrl}/students/${id}.json`, student)
  }
}


