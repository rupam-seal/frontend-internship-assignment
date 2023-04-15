import { Book } from "./book.interface";

export interface BookResponse {
  key: string,
  name: string,
  subject_type: string,
  work_count: string,
  works: Book[];
}