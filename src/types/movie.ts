import { Models } from "appwrite";

export interface TrendingMovie extends Models.Document {
  searchTerm: string;
  count: number;
  movie_id: number;
  poster_url: string;
}