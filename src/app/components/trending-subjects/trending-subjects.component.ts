import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { Book } from 'src/app/core/interfaces/book.interface';
import { BookService } from 'src/app/core/services/book.service';

@Component({
  selector: 'front-end-internship-assignment-trending-subjects',
  templateUrl: './trending-subjects.component.html',
  styleUrls: ['./trending-subjects.component.scss'],
})
export class TrendingSubjectsComponent implements OnInit {

  isLoading: boolean = true;

  subjectName: string = '';

  allBooks: Book[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
  ) {}

  getAllBooks() {
    this.bookService.getBooks(this.subjectName)
      .pipe(
        map(data => {
          this.allBooks = data.works;
          console.log('allBooks', this.allBooks);
          
          this.saveToCache(this.subjectName, this.allBooks);
        }),
        catchError(() => {
          console.log('Error fetching books.');
          return of(null);
        })
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.subjectName = params.get('name') || '';
      this.isLoading = true;
      const cachedBooks = this.getFromCache(this.subjectName);
      if (cachedBooks) {
        this.allBooks = cachedBooks;
        this.isLoading = false;
      } else {
        this.getAllBooks();
      }
    });
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

  private saveToCache(key: string, data: Book[]): void {
    const expiration = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    const cacheData = { data, expiration };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

}