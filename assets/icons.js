import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
  home: (props) => <AntDesign name="home" size={26} {...props} />,
  reserve: (props) => <Feather name="compass" size={26} {...props} />,
  complaints: (props) => <AntDesign name="warning" size={26} {...props} />,
  calendar: (props) => <AntDesign name="calendar" size={26} {...props} />,
  profile: (props) => <AntDesign name="user" size={26} {...props} />,
};
