import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useOActions } from "../../../store/overmind";
import { getPersonDetails, movieGetPersonCredits } from "@markmccoid/tmdb_api";
import { Button } from "../../../components/common/Buttons";
import { colors } from "../../../globalStyles";
import DataRow from "../../../components/common/DataRow";
import SearchResultItem from "../../../components/search/SearchResultItem";
import { useGetPersonMovies } from "../../../hooks/useGetPersonMovies";

const { width, height } = Dimensions.get("window");
const PICTURE_WIDTH = (width - 5) / 3;
const PICTURE_HEIGHT = PICTURE_WIDTH * (9 / 6);

const returnImageURI = (imageURL) => {
  let imageSource;
  if (imageURL) {
    imageSource = { uri: imageURL };
  } else {
    imageSource = require("../../../../assets/personplaceholder.png");
  }
  return imageSource;
};
//--Main Component
const DetailPerson = ({ navigation, route }) => {
  const { personId, fromRouteName } = route.params;
  const [personInfo, setPersonInfo] = useState(undefined);
  const [showBio, setShowBio] = useState(false);
  const [personMovieData, isLoading] = useGetPersonMovies(personId);
  const actions = useOActions();
  const { saveMovie, deleteMovie } = actions.oSaved;

  const toggleShowBio = () => setShowBio((prevState) => !prevState);
  //loads personDetails and movies that person was in(personCredits)
  useEffect(() => {
    const getPersonInfo = async (personId) => {
      const personDetails = await getPersonDetails(personId);
      //const personCredits = await movieGetPersonCredits(personId);
      // also get person movies?
      setPersonInfo(personDetails.data);
    };

    getPersonInfo(personId);
  }, [personId]);

  //Set the navigation title to the persons name
  useEffect(() => {
    navigation.setOptions({
      title: personInfo?.name,
    });
  }, [personInfo]);

  if (!personInfo) {
    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          <Image style={styles.profilePic} source={returnImageURI(personInfo?.profileImage)} />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginTop: 10,
            marginHorizontal: 5,
            marginBottom: 5,
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
        >
          <View>
            <DataRow label="Born:" value={personInfo?.birthday?.formatted} newLine />
            <DataRow label="Died:" value={personInfo?.deathDay?.formatted} newLine />
            <DataRow label="Birthplace:" value={personInfo?.placeOfBirth?.trim()} newLine />
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Button
              onPress={() =>
                Linking.openURL(`imdb:///name/${personInfo.imdbId}`).catch((err) => {
                  Linking.openURL(
                    "https://apps.apple.com/us/app/imdb-movies-tv-shows/id342792525"
                  );
                })
              }
              title="Open in IMDB"
              bgOpacity="ff"
              bgColor={colors.primary}
              small
              width={width / 2}
              wrapperStyle={{
                borderRadius: 0,
              }}
              color="#fff"
              noBorder
            />
          </View>
        </View>
      </View>

      <View style={{}}>
        <Text style={styles.bio} numberOfLines={showBio ? 100 : 5}>
          {personInfo.biography}
        </Text>
        <View
          style={{ alignItems: "flex-end", marginRight: 15, marginBottom: 15, marginTop: -5 }}
        >
          <Button
            onPress={toggleShowBio}
            title={showBio ? "Less" : "More"}
            small
            width={width / 3}
          />
        </View>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {isLoading ? (
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: 25 }}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          personMovieData.map((item) => {
            return (
              <SearchResultItem
                key={item.id}
                movie={item}
                saveMovie={saveMovie}
                deleteMovie={deleteMovie}
                setOnDetailsPage={() => {}}
                navigateToScreen={fromRouteName}
              />
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
// profile image is a 6 x 9 ratio
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  profilePic: {
    width: PICTURE_WIDTH,
    height: PICTURE_HEIGHT,
    margin: 5,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  bio: {
    padding: 10,
    fontSize: 16,
  },
});

export default DetailPerson;