import PublicFlashCards from "../components/Flashcards/flashcards";
import { View } from "react-native";

const Page = () => {
  return ( 
    <View style={{ flex: 1 }}>  
      <PublicFlashCards />
    </View>
  );
}

export default Page;