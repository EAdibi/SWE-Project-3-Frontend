import Admin from "../components/Admin/admin";
import { ScrollView } from "react-native";

const Page = () => {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
            <Admin />
        </ScrollView>
    );
};

export default Page;