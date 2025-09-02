import { Client, Databases, Query, Models } from "appwrite";
import { TrendingMovie } from "./types/movie";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID as string;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID as string;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID as string;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Your Appwrite Endpoint
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (
  searchTerm: string,
  movie: { id: number; poster_path: string | null }
) => {
  try {
    const response = await database.listDocuments<TrendingMovie>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("searchTerm", searchTerm)]
    );

    if (response.documents.length > 0) {
      const doc = response.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, "unique()", {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
          : "./no-movie.png",
      });
    }
  } catch (error) {
    console.error("Error checking search term:", error);
  }
};

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
  try {
    const response = await database.listDocuments<TrendingMovie>(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.limit(5), Query.orderDesc("count")]
    );
    return response.documents;
  } catch (error) {
    console.error(error);
    return [];
  }
};
