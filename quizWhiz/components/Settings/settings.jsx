import React, {useState} from "react";
import {
    View, // Fundamental component, works like a div in HTML. Container for other components.
    Text, //Used to render text on screen, like a p or span tag in HTML.
    Switch, // For toggle settings like dark mode or sound options
    TouchableOpacity, // For buttons like "Save Changes" or "Reset"
    TextInput, // For inputs like username, email, etc.
    StyleSheet, // For styling the page
    ScrollView, // For allowing the settings page to be scrollable
    Alert, // To display confirmation dialogs for actions like "Reset Settings"
    Platform, // For platform-specific styles or settings
    Dimensions, // To adapt the layout to screen size
} from "react-native";
import { useRouter } from "expo-router";

const SettingsPage = () => {
    const router = useRouter();

    const [email, setEmail] = useState("") //Change name
    const [password, setPassword] = useState(""); //Change password
    const [isLoading, setIsLoading] = useState(false); //Loading indicator

    const windowWidth = Dimensions.get("window").width;
    const isMobile = windowWidth < 768;

    //! Likely need to fix, my validation seems sort of bad.
    //Function to update email or password
    const updateEmailOrPassword = async => {
        setIsLoading(true); //Start Loading
        try {
            //Validation
            if (!email && !password) {
                Alert.alert("Error", "Please enter an email or password to update.");
                setIsLoading(false);
                return;
            }
        }

        //Need to fetch the url idk what it will be called CHANGE ME
        const response 
    }

    const deleteAccount = async () => {
        try {
            router.push("/settings")
        } catch (error) {
            console.log(error);
        }
    }

    // MY HTML:
    const renderForm = () => (
        <View style = {styles.formWrapper}>
            <Text style={styles.title}>Settings Page</Text>
            <View>

            </View>
        </View>
    );
    

    // STYLE SHEET:
    const styles = StyleSheet.create({
        formWrapper: {
            width: "100%",
            maxWidth: 400,
            backgroundColor: "#ffffff",
            padding: 32,
            borderRadius: 16,
            boxShadowColor: "#000",
            boxShadowOffset: { width: 0, height: 2 },
            boxShadowOpacity: 0.1,
            boxShadowRadius: 8,
            elevation: 4,
        }
    });

    if (isMobile) {
        return (
        <View style={styles.mobileLayout}>
            <View>{renderForm()}</View>
        </View>
        );
    }
}

export default SettingsPage;