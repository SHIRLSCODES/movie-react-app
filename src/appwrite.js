import { Client, Databases, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1') // Your Appwrite Endpoint
  .setProject(PROJECT_ID)

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    //1. use appwrite sdk to check if the search term already exists in the database
    try{
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ]);  
    //2. If it exists, increment the count
        if (response.documents.length > 0) {

            const doc = response.documents[0];
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1
            });
    //3. If it doesn't exist, create a new document with count 1
        } else{         
            await database.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
                searchTerm: searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url : movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : './no-movie.png',
            });
        }
    }catch(error){
        console.error('Error checking search term:', error);
    }
}

export const getTrendingMovies = async () => {
    try{
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ])
        return response.documents;
    }catch(error){
        console.log(error);
    }
}