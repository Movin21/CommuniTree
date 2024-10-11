import React from "react";
import { Modal, View, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CIRCLE_SIZE = SCREEN_WIDTH * 0.3; // 30% of screen width
const CHECKMARK_SIZE = CIRCLE_SIZE * 0.6;

const LoadingAnimation = ({ visible, isSuccess }) => {
  const backgroundOpacity = useSharedValue(0);
  const outerCircleScale = useSharedValue(1);
  const innerCircleOpacity = useSharedValue(0);
  const successScale = useSharedValue(0);
  const loadingRotation = useSharedValue(0);

  React.useEffect(() => {
    if (visible) {
      backgroundOpacity.value = withTiming(1, { duration: 300 });

      // Rotating animation for loading state
      loadingRotation.value = withRepeat(
        withTiming(360, {
          duration: 2000,
          easing: Easing.linear,
        }),
        -1
      );

      // Pulsing animation
      outerCircleScale.value = withRepeat(
        withSequence(
          withTiming(1.1, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
          withTiming(1, {
            duration: 1000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          })
        ),
        -1,
        true
      );

      innerCircleOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      backgroundOpacity.value = withTiming(0, { duration: 300 });
      outerCircleScale.value = 1;
      innerCircleOpacity.value = 0;
      loadingRotation.value = 0;
    }
  }, [visible]);

  React.useEffect(() => {
    if (isSuccess) {
      // Fade out loading animation
      outerCircleScale.value = withTiming(0, { duration: 200 });
      innerCircleOpacity.value = withTiming(0, { duration: 200 });
      loadingRotation.value = 0;

      // Show success animation
      backgroundOpacity.value = withTiming(0.3, { duration: 300 });
      successScale.value = withSequence(
        withDelay(
          200,
          withSpring(1, {
            damping: 10,
            stiffness: 100,
          })
        )
      );
    } else {
      successScale.value = 0;
    }
  }, [isSuccess]);

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  const outerCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: outerCircleScale.value },
      { rotate: `${loadingRotation.value}deg` },
    ],
  }));

  const innerCircleStyle = useAnimatedStyle(() => ({
    opacity: innerCircleOpacity.value,
  }));

  const successStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
    opacity: successScale.value,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={visible}>
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
          backgroundStyle,
        ]}
      >
        {!isSuccess && (
          <Animated.View
            style={[
              {
                width: CIRCLE_SIZE,
                height: CIRCLE_SIZE,
                borderRadius: CIRCLE_SIZE / 2,
                borderWidth: 3,
                borderColor: "#1e40af",
                justifyContent: "center",
                alignItems: "center",
              },
              outerCircleStyle,
            ]}
          >
            <Animated.View
              style={[
                {
                  width: CIRCLE_SIZE * 0.7,
                  height: CIRCLE_SIZE * 0.7,
                  borderRadius: (CIRCLE_SIZE * 0.7) / 2,
                  backgroundColor: "#1e40af",
                },
                innerCircleStyle,
              ]}
            />
          </Animated.View>
        )}

        {isSuccess && (
          <Animated.View
            style={[
              {
                width: CHECKMARK_SIZE,
                height: CHECKMARK_SIZE,
                justifyContent: "center",
                alignItems: "center",
              },
              successStyle,
            ]}
          >
            <View
              style={{
                width: CHECKMARK_SIZE * 0.6,
                height: CHECKMARK_SIZE * 0.35,
                borderBottomWidth: 4,
                borderLeftWidth: 4,
                borderColor: "#ffffff",
                transform: [
                  { rotate: "-45deg" },
                  { translateY: -CHECKMARK_SIZE * 0.1 },
                ],
              }}
            />
          </Animated.View>
        )}
      </Animated.View>
    </Modal>
  );
};

export default LoadingAnimation;
