import React from "react";
import { useDimensions } from "@react-native-community/hooks";
import { useNavigation } from "@react-navigation/native";
import _ from "lodash";

import MovieColumnLayout from "./MovieColumnLayout";
import MoviePortraitLayout from "./MoviePortraitLayout";

//NOTE: posterURL is being passed to force a rerender when the image is changed
// Since we are memoizing this component, it won't rerender when the poserURL
// is changed because it is stored in the movie object (must be shallow compare on objects?)
const ViewMoviesListItem = ({ movie, setMovieEditingId }) => {
  //Bool letting us know if we are in edit mode for this movieId
  const { navigate } = useNavigation();
  const navigateToDetails = () => {
    navigate("Details", { movieId: movie.id });
  };

  return (
    <MoviePortraitLayout
      // posterURL={posterURL}
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
    />
  );
};

function areEqual(prevProps, nextProps) {
  return _.isEqual(prevProps.movie, nextProps.movie);
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
}

export default React.memo(ViewMoviesListItem, areEqual);

/* <MovieColumnLayout
      movie={movie}
      setMovieEditingId={setMovieEditingId}
      navigateToDetails={navigateToDetails}
      inEditState={inEditState}
    /> */
