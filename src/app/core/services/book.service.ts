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

  searchBooks(query: string, limit: number = 10): Observable<Book[]> {
    return this.apiService
      .get(`/search.json?q=${query}&fields=title,author_name,key,first_publish_year&limit=${limit}`)
      .pipe(
        map((response: any) => {
          console.log('bookService: ',response);
          
          return response.docs.map((book: any) => {
            return {
              key: book.key,
              title: book.title,
              authors: [{key: book.key, name:book.author_name}],
              publish: book.first_publish_year,
            };
          });
        })
      );
  }

  pageBooks(query: string, page: number, pageSize: number): Observable<Book[]> {
    const startIndex = (page - 1) * pageSize;
    const fields = 'title,author_name,key,first_publish_year';
    return this.apiService
      .get(`/search.json?q=${query}&fields=${fields}&limit=${pageSize}&offset=${startIndex}`)
      .pipe(
        map((response: any) => {
          console.log('bookService: ',response);
          return response.docs.map((book: any) => {
            return {
              key: book.key,
              title: book.title,
              authors: [{key: book.key, name:book.author_name}],
              publish: book.first_publish_year,
            };
          });
        })
      );
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
