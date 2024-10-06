import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TermsOfServiceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 py-6 pt-12">
        <Text className="font-inter text-base text-gray-500 mb-1">
          AGREEMENT
        </Text>
        <Text className="font-inter font-bold text-3xl text-primaryColor mb-1">
          Terms of Services
        </Text>
        <Text className="font-inter text-sm text-gray-500 mb-2">
          Last updated on 8/12/2024
        </Text>
        <View className="items-center mt-5">
          <Image
            source={require("../../assets/logo.png")}
            className="w-35 h-35 resize-contain"
          />
        </View>
      </View>
      <ScrollView className="px-5 py-4">
        {/* Clause 1 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          What is CommuniTree ?
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          CommuniTree is designed to promote sustainable living within housing
          schemes and apartment complexes. It connects residents with local
          initiatives, events, and resources aimed at fostering an eco-friendly
          community. The goal is to enhance community engagement, support green
          initiatives, and provide valuable information for residents to live
          more sustainably within their residential environment.
        </Text>

        {/* Clause 2 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Key Features of the Application
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          1. Interactive Event Calendar :The calendar showcases upcoming events
          such as community clean-ups, recycling drives, tree-planting,
          get-togethers, arm-giving events, and blood donation drives. This
          feature allows residents to RSVP and share these events, promoting
          engagement and collective responsibility for a greener community.
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          2. User Management : Residents can view, update, and manage their
          personal accounts. The platform allows residents to engage with
          essential features such as shared resource booking, event management,
          and carpooling. Admins are responsible for overseeing the smooth
          operation of the platform by managing accounts, permissions, and
          resolving any user issues.
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          3. Priority Notification Center & Ticketing System :The notification
          center delivers alerts about significant updates such as power
          outages, scheduled maintenance, elevator malfunctions, and other
          urgent matters. Residents can report issues via a ticketing system,
          which allows them to track the progress of maintenance requests and
          other inquiries.
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          4. Shared Resources Management:Residents can easily book shared
          resources such as parking spaces, community halls, swimming pools, and
          playgrounds. The system also provides real-time availability, booking
          confirmations, and notifications to ensure organized usage.
        </Text>

        {/* Clause 3 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Resident Responsibilities
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          Residents are expected to use the CommuniTree platform responsibly.
          This includes keeping personal account details up to date, complying
          with community rules when reserving shared resources, and reporting
          issues promptly. Abuse of the platform, such as booking resources
          without using them or providing inaccurate details, may lead to
          restricted access or account suspension.
        </Text>

        {/* Clause 4 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Admin Responsibilities
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          Admins are tasked with ensuring the proper operation of the platform.
          They must regularly update event calendars, respond to ticket requests
          in a timely manner, and manage resident accounts. Admins are also
          responsible for moderating the platform to prevent misuse and ensuring
          a fair system for resource reservations and other community
          engagements.
        </Text>

        {/* Clause 5 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Privacy and Data Protection
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          CommuniTree values your privacy. All personal data collected through
          the platform will be securely stored and only used for the purpose of
          enhancing user experience within the community. Your data will not be
          shared with third parties without your consent, unless required by
          law.
        </Text>

        {/* Clause 6 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Amendments to the Terms
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          CommuniTree reserves the right to modify these Terms of Services at
          any time. Significant changes will be communicated to users through
          in-app notifications. Continued use of the platform after changes to
          the terms indicates acceptance of the new terms.
        </Text>

        {/* Clause 7 */}
        <Text className="font-inter text-xl text-gray-900 mb-2 mt-4">
          Dispute Resolution
        </Text>
        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          In the event of a dispute between a resident and the platform, we
          encourage parties to resolve the issue amicably through discussion. If
          no resolution is reached, the issue may be escalated to the housing
          scheme's administration or, if necessary, legal channels.
        </Text>

        <Text className="font-inter text-sm text-gray-700 leading-5 mb-4">
          By using CommuniTree, you agree to abide by the terms outlined above.
          These terms are designed to ensure a positive, eco-friendly, and
          cooperative living experience for all residents.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-primaryColor rounded-full py-3 px-6 mt-8 mb-10 self-center"
          style={{ width: 200 }} // Adjust the width value as needed
        >
          <Text className="text-white text-center text-base font-inter font-bold">
            Accept & Continue
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsOfServiceScreen;
