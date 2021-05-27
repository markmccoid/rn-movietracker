import * as React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
} from "react-native-reanimated";

import DefaultHandle from "./Handle";
import MoveableItem from "./MoveableItem";
import { Positions } from "./helperFunctions";

export type ScrollFunctions = {
  scrollToEnd: () => void;
  scrollToStart: () => void;
};

interface Props {
  updatePositions: (positions: Positions) => void;
  itemHeight: number;
  handle?: React.ReactNode;
  handlePosition?: "left" | "right";
  enableHapticFeedback?: boolean;
  scrollStyles?: ViewStyle;
  getScrollFunctions?: (funtionObj: ScrollFunctions) => void;
  children:
    | React.ReactElement<{ id: number | string }>[]
    | React.ReactElement<{ id: number | string }>;
}

const DragDropEntry = ({
  updatePositions,
  itemHeight,
  handle = DefaultHandle,
  handlePosition = "left",
  scrollStyles,
  getScrollFunctions,
  enableHapticFeedback = true,
  children,
}: Props) => {
  //*Scrollview animated ref
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const positions = useSharedValue<Positions>({});
  const scrollY = useSharedValue(0);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const numberOfItems = React.useMemo(() => React.Children.count(children), [children]);
  const prevNumberOfItems = React.useRef(numberOfItems);

  positions.value = Object.assign(
    {},
    ...React.Children.map(children, (child, idx) => ({
      [`${child.props.id}`]: idx,
    }))
  );

  // Assign scroll functions
  React.useEffect(() => {
    if (scrollViewRef.current && getScrollFunctions) {
      const scrollFuncs = {
        scrollToEnd: (): void => scrollViewRef.current?.scrollToEnd(),
        scrollToStart: (): void => scrollViewRef.current?.scrollTo({ y: 0, animated: true }),
      };
      getScrollFunctions(scrollFuncs);
    }
  }, []);

  // When scrollview gets children added or removed got to end or start of list
  React.useEffect(() => {
    // Item has been added (more items than before)
    if (numberOfItems > prevNumberOfItems.current && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    } else if (numberOfItems < prevNumberOfItems.current && scrollViewRef.current) {
      //Item has been removed
      const topBound = numberOfItems * itemHeight - containerHeight;
      if (scrollY.value > topBound) {
        scrollViewRef.current.scrollToEnd();
      }
    }
    prevNumberOfItems.current = numberOfItems;
  }, [numberOfItems]);

  // Wrap each child item in the MoveableItem component.
  const moveableItems = React.Children.map(children, (child) => {
    const id = child.props.id;
    return (
      <MoveableItem
        id={id}
        key={id}
        scrollY={scrollY}
        scrollViewRef={scrollViewRef}
        numberOfItems={numberOfItems}
        itemHeight={itemHeight}
        positions={positions}
        containerHeight={containerHeight}
        updatePositions={updatePositions}
        handle={handle}
        handlePosition={handlePosition}
        enableHapticFeedback={enableHapticFeedback}
      >
        {child}
      </MoveableItem>
    );
  });

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={scrollStyles}
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
      contentContainerStyle={{
        height: numberOfItems * itemHeight,
      }}
    >
      {moveableItems}
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: 100,
    padding: 10,
    borderWidth: 1,
  },
});

export default DragDropEntry;