/**
 * Appwrite service — Search analytics (Community Trends), watchlist CRUD. NoSQL Databases API.
 */
import { Client, Databases, ID, Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;
const WATCHLIST_TABLE_ID = import.meta.env.VITE_APPWRITE_WATCHLIST_TABLE_ID;

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);
const database = new Databases(client);

/**
 * Upsert search count for "Community Trends": update if exists, else create. Silent fail (analytics only).
 *
 * @param {string} searchTerm - User search query
 * @param {Object} movie - TMDB movie (id, poster_path) for metadata
 */

export const updateSearchCount = async (searchTerm, movie) => {
    try {
        /* Step 1: Check if search term already exists */
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.equal(`searchTerm`, searchTerm),
        ]);

        /* Step 2: Update existing document or create new one */
        if (result.documents.length > 0) {
            const doc = result.documents[0];
            await database.updateDocument(DATABASE_ID, TABLE_ID, doc.$id, {
                count: doc.count + 1,
            });
        } else {
            await database.createDocument(DATABASE_ID, TABLE_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            });
        }
    } catch (error) {
        console.error("Appwrite updateSearchCount:", error);
        /* Silently fail - analytics should not block main flow */
    }
};


/**
 * Retrieves top 5 most-searched terms (Community Trends). Ordered by count desc.
 *
 * @returns {Promise<Array>} List of documents; empty array on error (silent fail).
 */
export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, TABLE_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);
        return result.documents;
    } catch (error) {
        console.error("Appwrite getTrendingMovies:", error);
        return [];
    }
};

/**
 * Fetches the user's personal watchlist. Throws on error so callers can handle.
 *
 * @param {string} userId - Guest UUID or logged-in user ID
 * @returns {Promise<Array>} List of watchlist documents from Appwrite
 */
export const getWatchList = async (userId) => {
    const response = await database.listDocuments(
        DATABASE_ID,
        WATCHLIST_TABLE_ID,
        [Query.equal(`user_id`, userId)]
    );
    return response.documents;
};

/**
 * Adds a movie to the user's watchlist. Stores minimal metadata for offline display.
 *
 * @param {string} userId - Guest or user ID
 * @param {Object} movie - TMDB movie object (id, title, poster_path, vote_average, original_language)
 */
export const addToWatchList = async (userId, movie) => {
    /* Only fields that exist in the Appwrite collection schema. Add original_language in console if you want it stored. */
    await database.createDocument(
        DATABASE_ID,
        WATCHLIST_TABLE_ID,
        ID.unique(),
        {
            user_id: userId,
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path ?? null,
            vote_average: movie.vote_average ?? null,
        }
    );
};

/**
 * Removes a movie from the watchlist.
 *
 * @param {string} dbDocumentId - Appwrite document $id (not TMDB movie id)
 */
export const removeFromWatchList = async (dbDocumentId) => {
    await database.deleteDocument(
        DATABASE_ID,
        WATCHLIST_TABLE_ID,
        dbDocumentId
    );
};