import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { useOState, useOActions } from "../../../store/overmind";
import _ from "lodash";

import SavedFiltersItem from "../SavedFiltersItem";

import SortableList from "../sortable/SortableList";

const ITEM_HEIGHT = 40.333;
const { width, height } = Dimensions.get("window");

const SavedFiltersSort = () => {
  const state = useOState();
  const actions = useOActions();

  const { savedFilters } = state.oSaved;
  const { updateSavedFilterOrder } = actions.oSaved;
  console.log(
    "SaveFilterSort",
    savedFilters.map((el) => el.name)
  );

  const reSort = async (positions) => {
    // "worklet";
    // positions is object { [id_of_filter]: index position}
    // Flip positions object so it is { 0: 'id', 1: 'id', ... }
    const orderedObject = Object.keys(positions).reduce((final, key) => {
      final = { ...final, [positions[key]]: key };
      return final;
    }, {});

    let newSavedFilters = [];
    // loop through Object.values (which will be the ids for filters)
    // on flipped object getting id to pull from the saved filters
    Object.values(orderedObject).forEach((id) => {
      newSavedFilters.push(savedFilters.find((filter) => filter.id === id));
    });

    updateSavedFilterOrder(newSavedFilters);
  };
  return (
    <View style={styles.container}>
      <SortableList item={{ height: ITEM_HEIGHT }} reSort={reSort}>
        {savedFilters.map((item, index) => {
          return (
            <View
              style={{
                width: "90%",
                borderColor: "#ccc",
                borderWidth: 1,
              }}
              key={index}
              id={item.id}
            >
              <SavedFiltersItem savedFilter={item} />
            </View>
          );
        })}
      </SortableList>
    </View>
  );
};

export default SavedFiltersSort;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
  },
  item: {
    height: ITEM_HEIGHT,
    width: "95%",
    borderColor: "#ddd",
    borderWidth: 1,
    // flex: 1,
    // alignItems: "center",
    // backgroundColor: "red",
    // marginTop: 32,
  },
});
