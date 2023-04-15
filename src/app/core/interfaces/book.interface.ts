import { Author } from "./author.interface";

export interface Book {
  key: string;
  title: string;
  authors: Author[];
  publish: number;
}