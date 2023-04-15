import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, filter, map, switchMap } from 'rxjs';
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
    this.bookSearch.valueChanges
      .pipe(
        debounceTime(300),
        filter((value: string) => value.length > 2),
        switchMap((value: string) => {
          this.isLoading = true;
          return this.bookService.searchBooks(value)
        })
      )
      .subscribe((books: Book[]) => {
        this.searchResults = books;
        console.log(this.searchResults);
        this.isLoading = false;
        console.log('search', this.searchResults);
      });
  }
}
