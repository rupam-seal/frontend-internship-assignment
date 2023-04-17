import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, of, switchMap } from 'rxjs';
import { Book } from 'src/app/core/interfaces/book.interface';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'front-end-internship-assignment-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  bookSearch: FormControl;
  searchResults: Array<Book> = [];
  isLoading: boolean;
  subjectName: string = '';
  errorMessage: string = '';
  page = 1;
  count = 0;
  pageSize = 10;
  pageSizes = [3, 6, 9];

  constructor(private bookService: BookService) {
    this.bookSearch = new FormControl('');
    this.searchResults = [];
    this.isLoading = false;
  }

  trendingSubjects: Array<any> = [
    { name: 'JavaScript' },
    { name: 'CSS' },
    { name: 'HTML' },
    { name: 'Harry Potter' },
    { name: 'Crypto' },
  ];


  ngOnInit(): void {
    this.getBooks(this.page);
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        filter((value: string) => value === '' || value.length > 2),
        switchMap((value: string) => {
          this.isLoading = true;
          const cachedData = this.getFromCache(value);
          if (cachedData) {
            return of(cachedData);
          } else {
            return this.bookService.searchBooks(value).pipe(
              map(books => {
                this.saveToCache(value, books);
                return books;
              })
            );
          }
        })
      )
      .subscribe(
        (books: Book[]) => {
          this.searchResults = books;
          this.isLoading = false;
          this.errorMessage = '';
        },
        error => {
          this.errorMessage = 'An error occurred while fetching data.';
          this.isLoading = false;
          console.error(error);
        }
      );
  }
  

  private getFromCache(key: string): Book[] | null {
    const cachedData = localStorage.getItem(key);
    if (cachedData) {
      const { data, expiration } = JSON.parse(cachedData);
      if (expiration && expiration > Date.now()) {
        return data;
      } else {
        localStorage.removeItem(key);
      }
    }
    return null;
  }

  getBooks(page: number): void {
    const query = this.bookSearch.value;
    this.bookService.pageBooks(query, page, this.pageSize).subscribe(
      (result: any) => {
        this.searchResults = result.docs;
        this.count = result.numFound;
        this.isLoading = false;
        this.errorMessage = '';
      },
      error => {
        this.errorMessage = 'An error occurred while fetching data.';
        this.isLoading = false;
        console.error(error);
      }
    );
  }
  

  handlePageChange(event: any): void {
    console.log(event);
    
    this.page = event.pageIndex + 1;
    this.getBooks(this.page);
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getBooks(this.page);
  }

  private saveToCache(key: string, data: Book[]): void {
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const cacheData = { data, expiration };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }
}