import React, { useRef, useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const PageIndicator = ({ currentPage, totalPages }) => {
  return (
    <View className="flex flex-row space-x-1 my-4">
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
  const scrollViewRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const pages = [
    {
      title: "Sustainable Living for you!",
      description:
        "CommuniTree equips you with knowledge and tools to live more sustainably.",
      image: require("../assets/obi1.png"),
    },
    {
      title: "It's your perfect home!",
      description:
        "Let's explore how CommuniTree can help you connect, engage, and thrive in your residential community!",
      image: require("../assets/obi2.png"),
    },
  ];

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / width);
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      scrollViewRef.current.scrollTo({
        x: (currentPage + 1) * width,
        animated: true,
      });
      setCurrentPage(currentPage + 1);
    } else {
      router.push("/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center px-5 mt-14 ">
        <Image
          source={require("../assets/logo.png")}
          className="w-40 h-40 object-contain"
        />
      </View>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        {pages.map((page, index) => (
          <View key={index} style={{ width }}>
            <Text className="text-3xl font-inter mt-7 text-center font-bold px-5">
              {page.title}
            </Text>
            <Text
              style={{ lineHeight: 22 }}
              className="text-center mt-6 mx-10 font-inter font-semiBold text-greyColor text-xl leading-tight"
            >
              {page.description}
            </Text>
            <View className="items-center">
              <PageIndicator
                currentPage={currentPage}
                totalPages={pages.length}
              />
            </View>
            <View className="mt-10 overflow-hidden rounded-t-obi">
              <Image
                source={page.image}
                style={{ width, height: 500 }}
                resizeMode="cover"
              />
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={handleNext}
        className="bg-white py-3 px-14 rounded-full absolute bottom-8 self-center w-50 text-center" // Fixed width with center alignment
      >
        <Text className="text-black text-lg font-bold font-inter text-center">
          {currentPage === pages.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Onboarding;
