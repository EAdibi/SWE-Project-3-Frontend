import PublicLessons from "../components/Lessons/lessons";
import { View } from "react-native";

const Page = () => {
  return (
    <View style={{ flex: 1 }}>
      <PublicLessons />
    </View>
  );
}

export default Page;