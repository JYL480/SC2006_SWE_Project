/**
 * Provides a convenient interface to interact with the database that is tied to this project (Firebase)
 */

import { database } from "src/main.js";
import { ref as dbRef, get as dbGet, set as dbSet } from "firebase/database";

/**
 * Retrieve recent locations of the currently logged in user from Database
 * @param {string} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
 * @returns {Promise<{carpark: Set<string>, erp: Set<string>}>} Object with .carpark and .erp, each being an Set of the bookmarked IDs
 */
async function dbGetUserBookmarks(userID) {
  let bookmarkArrays = null;
  if (userID) {
    const userBookmarksRef = dbRef(database, "users/" + userID + "/bookmarks");

    try {
      console.log("GET DB Bookmarks: " + userID);
      const response = await dbGet(userBookmarksRef);
      if (response.exists()) {
        console.log(response.val());
        bookmarkArrays = response.val(); // DB can only store JSON, Sets are not supported in JSON
      }
    } catch (e) {
      console.log(e);
      return;
    }
  }

  if (bookmarkArrays) {
    return {
      carpark: new Set(bookmarkArrays["carpark"]),
      erp: new Set(bookmarkArrays["erp"]),
    };
  } else {
    return {
      carpark: new Set(),
      erp: new Set(),
    };
  }
}

/**
 * Sets bookmarks of the currently logged in user in Database
 * @param {Set<string>} carparkBookmarkSet Set of bookmarked Carpark IDs
 * @param {Set<string>} erpBookmarkSet Set of IDs bookmarked ERP IDs
 * @param {string|null} userID Unique ID of the user (i.e. as per firebase getAuth().currentUser.uid)
 */
async function dbSetUserBookmarks(carparkBookmarksSet, erpBookmarkSet, userID) {
  const bookmarks = {
    carpark: [...carparkBookmarksSet],
    erp: [...erpBookmarkSet],
  }; // JSON doesn't support Set, just Array
  if (userID) {
    const userBookmarksRef = dbRef(database, "users/" + userID + "/bookmarks");
    console.log("SET DB Bookmarks: " + userID);
    try {
      await dbSet(userBookmarksRef, bookmarks);
    } catch (e) {
      console.log(e);
      return;
    }
  }
}

export { dbGetUserBookmarks, dbSetUserBookmarks };
