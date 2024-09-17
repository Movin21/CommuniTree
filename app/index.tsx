import React, { useEffect, useRef, useState } from "react";
import { Redirect, router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";

const PageIndicator = ({ currentPage, totalPages }: any) => {
  return (
    <View className="flex flex-row space-x-1 mt-14">
      {[...Array(totalPages)].map((_, index) => (
        <View
          key={index}
          className={`bg-white p-1 ${
            index === currentPage ? "rounded-3xl px-4" : "rounded-full"
          }`}
        />
      ))}
    </View>
  );
};

const Onboarding = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Sustainable Living for you!",
      description:
        "CommuniTree equips you with knowledge and tools to live more sustainably.",
      image: require("../assets/obi1.png"),
    },
    {
      title: "It’s your perfect home!",
      description:
        "Let's explore how CommuniTree can help you connect, engage, and thrive in your residential community!",
      image: require("../assets/obi2.png"),
    },
  ];

  useEffect(() => {
    animateContent();
  }, [currentPage]);

  const animateContent = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center px-5 mt-14 mb-8">
        <Image
          source={require("../assets/logo.png")}
          className="w-40 h-40 object-contain"
        />
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Text className="text-3xl font-inter mt-9 text-center font-bold">
            {pages[currentPage].title}
          </Text>
          <Text
            style={{ lineHeight: 22 }}
            className="text-center mt-6 mx-10 font-inter font-semibold text-greyColor text-lg leading-tight"
          >
            {pages[currentPage].description}
          </Text>
        </Animated.View>
        <PageIndicator currentPage={currentPage} totalPages={pages.length} />
      </View>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}
        className="mt-2 overflow-hidden rounded-t-obi"
      >
        <Image
          source={pages[currentPage].image}
          className="w-full h-auto object-fill"
        />
      </Animated.View>
      <TouchableOpacity
        onPress={handleNext}
        className="bg-white py-3 px-24 rounded-full absolute bottom-8 self-center"
      >
        <Text className="text-black text-lg font-bold font-inter">
          {currentPage === pages.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Onboarding;
