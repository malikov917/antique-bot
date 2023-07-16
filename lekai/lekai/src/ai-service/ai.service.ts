import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GenerateExerciseModel } from './generate-exercise.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  // inject the HttpClient service
  constructor(private http: HttpClient) { }

  generateTest(model: GenerateExerciseModel): Observable<any> {
    return this.http.post('/ai/generate-exercise', model);
  }
}
