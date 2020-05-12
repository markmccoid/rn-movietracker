import _ from "lodash";
import uuidv4 from "uuid/v4";

//================================================================
// - INITIALIZE (Hydrate Store)
//================================================================
export const hyrdateStore = async ({ state, effects }, uid) => {
  let userDocData = await effects.oSaved.initializeStore(uid);
  state.oSaved.savedMovies = userDocData.savedMovies;
  state.oSaved.tagData = userDocData.tagData;
  state.oSaved.userData = userDocData.userData;
};

//================================================================
// - MOVIE (savedMovies) Actions
//================================================================
/**
 * saveMovie - save the passed movie object to state and firestore
 *
 * @param {*} context
 * @param {Object} movieObj
 */
export const saveMovie = async ({ state, effects, actions }, movieObj) => {
  const { tagResults } = actions.oSearch.internal;
  const searchData = state.oSearch.resultData;
  // check to see if movie exists
  if (state.oSaved.savedMovies.some((movie) => movie.id === movieObj.id)) {
    return;
  }
  state.oSaved.savedMovies = [movieObj, ...state.oSaved.savedMovies];
  // When saving movie user is left on search screen, this will update
  // the screen to show that the selected movie has been saved
  state.oSearch.isNewQuery = false;
  state.oSearch.resultData = tagResults(searchData);
  //----------------------------
  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};

/**
 * deleteMovie - delete the passed movieId and save to state and firestore
 *
 * @param {*} context
 * @param {string} movieId
 */
export const deleteMovie = async ({ state, effects }, movieId) => {
  // find and remove movie
  state.oSaved.savedMovies = state.oSaved.savedMovies.filter(
    (movie) => movie.id !== movieId
  );

  // Remove Tag information from oSaved.userData.tags
  delete state.oSaved.userData.tags[movieId];

  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};

/**
 * updateMovieBackdropImage - update the passed movieIds backdrop image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, backdropUrl}
 */
export const updateMovieBackdropImage = async ({ state, effects }, payload) => {
  const { movieId, backdropURL } = payload;
  //update the passed movieId's backdropURL
  state.oSaved.savedMovies.forEach((movie) => {
    if (movie.id === movieId) {
      return (movie.backdropURL = backdropURL);
    }
  });
  //Save to firestore
  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};
/**
 * updateMoviePosterImage - update the passed movieIds poster image and save to state and firestore
 *
 * @param {*} context
 * @param {Object} payload { movieId, posterUrl}
 */
export const updateMoviePosterImage = async ({ state, effects }, payload) => {
  const { movieId, posterURL } = payload;
  //update the passed movieId's posterURL
  state.oSaved.savedMovies.forEach((movie) => {
    if (movie.id === movieId) {
      return (movie.posterURL = posterURL);
    }
  });
  //Save to firestore
  await effects.oSaved.saveMovies(state.oSaved.savedMovies);
};
//================================================================
// - TAG (tagData) Actions
//================================================================
export const addNewTag = async ({ state, effects }, tagName) => {
  let existingTags = state.oSaved.tagData;
  // Check to see if tag with same name exists (disregard case)
  if (
    existingTags.some(
      (tag) => tag.tagName.toLowerCase() === tagName.toLowerCase()
    )
  ) {
    return;
  }
  let tagId = uuidv4();
  let newTag = {
    tagId,
    tagName,
  };

  state.oSaved.tagData.push(newTag);
  // Maybe will want to sort tags in some way??
  effects.oSaved.saveTags(state.oSaved.tagData);
};

/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const deleteTag = async ({ state, effects }, tagId) => {
  let existingTags = state.oSaved.tagData;
  let { userData } = state.oSaved;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.filter((tag) => tag.tagId !== tagId);
  await effects.oSaved.saveTags(state.oSaved.tagData);

  //Remove from userData.tags and save to storage
  Object.keys(userData.tags).forEach((movieKey) => {
    userData.tags[movieKey] = userData.tags[movieKey].filter(
      (id) => id !== tagId
    );
  });
  await effects.oSaved.saveUserData(userData);
};
/**
 * Handles deleting tag from oSaved.tagData
 * AND removing any instances of tagId from oSaved.userData.tags array of movies
 * @param {state, effects, actions} overmind params
 * @param {*} tagId
 */
export const editTag = async ({ state, effects }, payload) => {
  let { tagId, updatedTag } = payload;
  let existingTags = state.oSaved.tagData;
  //Remove from tagData and save to Storage
  state.oSaved.tagData = existingTags.map((tag) => {
    if (tag.tagId === tagId) {
      return { ...tag, tagName: updatedTag };
    }
    return tag;
  });
  await effects.oSaved.saveTags(state.oSaved.tagData);
};

//================================================================
// - USER DATA (userData) Actions
//================================================================
// -- Add a tagId to the userData Object
// -- payload = { movieId, tagId }
export const addTagToMovie = async ({ state, effects }, payload) => {
  let userData = state.oSaved.userData || {};
  const { movieId, tagId } = payload;
  // check to see if the tags property is available, if not create it
  if (!userData.tags) {
    userData.tags = {};
  }
  if (!userData.tags.hasOwnProperty(movieId)) {
    userData.tags[movieId] = [tagId];
  } else {
    userData.tags[movieId] = [...userData.tags[movieId], tagId];
  }
  // Add tag to movieId property on object
  // userData.tags[movieId] = userData.tags[movieId]
  //   ? [...userData.tags[movieId], tagId]
  //   : [tagId];
  // Save userData to local storage
  await effects.oSaved.saveUserData(userData);
};

export const removeTagFromMovie = async ({ state, effects }, payload) => {
  let userData = state.oSaved.userData || {};
  const { movieId, tagId } = payload;
  userData.tags[movieId] = userData.tags[movieId].filter(
    (tag) => tag !== tagId
  );
  // Save userData to local storage
  await effects.oSaved.saveUserData(userData);
};

//================================================================
// - FILTER DATA (filterData) Actions
//================================================================
export const addTagToFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags.push(tagId);
};

export const removeTagFromFilter = ({ state }, tagId) => {
  let filterData = state.oSaved.filterData;
  filterData.tags = filterData.tags.filter((item) => item !== tagId);
};

export const clearFilterTags = ({ state }) => {
  state.oSaved.filterData.tags = [];
};

export const setTagOperator = ({ state }, tagOperator) => {
  state.oSaved.filterData.tagOperator = tagOperator;
};
