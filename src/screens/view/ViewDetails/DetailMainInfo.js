import * as React from "react";
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import DetailMainInfoHoldMenu from "./DetailMainInfoHoldMenu";

import { useDimensions } from "@react-native-community/hooks";
import { LessIcon, MoreIcon } from "../../../components/common/Icons";
import { useOActions, useOState } from "../../../store/overmind";
import LongTouchUserRating from "./LongTouchUserRating";
import { Button } from "../../../components/common/Buttons";
import PosterImage from "../../../components/common/PosterImage";
import { colors, styleHelpers } from "../../../globalStyles";

const DetailMainInfo = ({ movie, isInSavedMovies, viewTags, setViewTags, transitionRef }) => {
  const [overviewHeight, setOverviewHeight] = React.useState(205);
  const actions = useOActions();
  const state = useOState();
  const { updateUserRatingToMovie, refreshMovie } = actions.oSaved;
  const { getMovieUserRating } = state.oSaved;
  const navigation = useNavigation();
  const route = useRoute();
  // maybe needs to be in useEffect??? or memoized
  const movieUserRating = getMovieUserRating(movie.id);

  const { width } = useDimensions().window;

  const posterWidth = width * 0.35;
  const posterHeight = posterWidth * 1.5;

  // Get data to use from movie object
  const { overview = "", releaseDate = "", imdbURL = "", runtime = "" } = movie;

  const toggleOverview = () => setOverviewHeight((curr) => (curr ? undefined : 205));
  const navigateToRoute = () =>
    navigation.navigate(route.name, {
      movieId: movie.id,
      movie: undefined,
      notSaved: false,
    });
  return (
    <View style={styles.container}>
      {/* {!ForceTouchGestureHandler.forceTouchAvailable && isInSavedMovies && (
        <UserRating movieId={movie.id} />
      )} */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-start",
          width: width,
          paddingTop: 5,
          paddingBottom: 15,
          marginBottom: 20,
        }}
      >
        <View
          style={[
            styles.posterWrapper,
            styles.posterImage(posterWidth, posterHeight),
            { zIndex: 200 },
          ]}
        >
          <View
            style={{
              position: "absolute",
              left: 35,
              bottom: -40,
              zIndex: 200,
            }}
          >
            {isInSavedMovies && (
              <LongTouchUserRating
                movieId={movie.id}
                userRating={movieUserRating}
                updateUserRating={(userRating) =>
                  updateUserRatingToMovie({ movieId: movie.id, userRating })
                }
              />
            )}
          </View>

          {/* Need to build the items array so that we don't show the updateMovie option for movies NOT added yet 
                NOTE: the .filter is just to get rid of the undefined for movies NOT added yet.
          */}

          <DetailMainInfoHoldMenu
            movie={movie}
            navigateToRoute={navigateToRoute}
            isInSavedMovies={isInSavedMovies}
            refreshMovie={refreshMovie}
          >
            <View style={styleHelpers.posterImageShadow}>
              <PosterImage
                uri={movie.posterURL}
                posterWidth={posterWidth}
                posterHeight={posterHeight}
                placeholderText={movie?.title}
                style={{
                  borderRadius: 10,
                }}
              />
            </View>
          </DetailMainInfoHoldMenu>
        </View>
        {/*---------------------
          ------------------------*/}
        <View style={{ flex: 1, paddingHorizontal: 8, height: overviewHeight }}>
          <ScrollView style={{ overflow: "scroll" }}>
            <Text style={{ fontSize: 18 }}>{overview}</Text>
          </ScrollView>
          {overview.length > 270 && (
            <View
              style={{
                position: "absolute",
                bottom: -30,
                right: 0,
                margin: 10,
                // backgroundColor: "#ffffff",
                zIndex: 100,
                // borderColor: "black",
                // borderWidth: 1,
                // borderRadius: 10,
                padding: 5,
              }}
            >
              <TouchableOpacity onPress={toggleOverview}>
                {overviewHeight ? (
                  <MoreIcon size={20} color="black" />
                ) : (
                  <LessIcon size={20} color="black" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {/* Release Date, Length, Genres + ShowTags button */}
      <View style={{ flexDirection: "row", flex: 1 }}>
        <View>
          <View style={styles.textRow}>
            <Text style={styles.textRowLabel}>Released:</Text>
            <Text style={{ fontSize: 18 }}>{releaseDate.formatted}</Text>
          </View>
          {runtime ? (
            <View style={styles.textRow}>
              <Text style={styles.textRowLabel}>Length: </Text>
              <Text style={{ fontSize: 18 }}>{runtime} minutes</Text>
            </View>
          ) : null}
          <View style={[styles.textRow, { flexWrap: "wrap", width: width / 1.5 }]}>
            <Text style={styles.textRowLabel}>Genre(s): </Text>

            {movie.genres.map((genre, idx) => (
              <Text key={genre} style={{ fontSize: 18 }}>{`${genre}  `}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginLeft: 5,
    marginTop: 10,
    marginBottom: 5,
  },
  posterWrapper: {
    borderWidth: 1,
    backgroundColor: "white",
    borderColor: "#ddd",
    borderBottomWidth: 0,
    marginRight: 5,
  },
  posterImage: (width, height) => ({
    width,
    height,
  }),
  textRow: {
    flexDirection: "row",
  },
  textRowLabel: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
});
export default DetailMainInfo;
