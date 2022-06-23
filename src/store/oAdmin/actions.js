import Firebase from "../../storage/firebase";

export const logUserIn = ({ state }, user) => {
  state.oAdmin.isLoggedIn = true;
  state.oAdmin.email = user.email;
  state.oAdmin.uid = user.uid;
};

export const logUserOut = async ({ state, effects, actions }) => {
  //Before reset, see if we have any debounced functions to flush
  await effects.oSaved.flushDebounced();
  Firebase.auth().signOut();
  //Clear User Data is called in the onInitialize.js function
  // in response to a change in the user id (i.e. there being none because we logged out)
};

export const clearUserData = async ({ state, effects, actions }) => {
  //Before reset, see if we have any debounced functions to flush
  // await effects.oSaved.flushDebounced();

  state.oAdmin.isLoggedIn = false;
  state.oAdmin.email = "";
  state.oAdmin.uid = "";
  // When user logs out reset the oSaved state to it's default state
  // Found that could set directly from here, but needed to call action to do it.
  actions.oSaved.resetOSaved();
};

export const setDeepLink = ({ state, effects, actions }, deepLink) => {
  state.oAdmin.appState.deepLink = deepLink;
};
