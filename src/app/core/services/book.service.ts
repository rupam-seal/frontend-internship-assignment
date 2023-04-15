import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, map } from 'rxjs';
import { BookResponse } from '../interfaces/book-response.interface';
import { Book } from '../interfaces/book.interface';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private apiService: ApiService) {}

  getBooks(subjectName: string): Observable<any> {
    const limit = 10;
    return this.apiService
      .get(
        `/subjects/${subjectName
          .toLowerCase()
          .split(' ')
          .join('_')}.json?limit=${limit}`
      )
      .pipe(map((response) => this.processResponse(response as BookResponse)));
  }

  private processResponse(response: BookResponse): BookResponse {
    return {
      key: response.key,
      name: response.name,
      subject_type: response.subject_type,
      work_count: response.work_count,
      works: response.works.map(
        (book: any) =>
          <Book>{
            key: book.key,
            title: book.title,
            authors: book.authors,
            publish: book.first_publish_year,
          }
      ),
    };
  }
}
