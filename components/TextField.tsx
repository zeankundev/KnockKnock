import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export default function TextField(props: TextInputProps) {
    return (
        <View style={styles.primaryPadding}>
            <TextInput 
            style={styles.textInput} 
            multiline={true}
            placeholderTextColor={Colors.default.secondaryBackground}
            numberOfLines={2}
            {...props}
            ></TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    primaryPadding: {
        padding: 5,
        backgroundColor: Colors.default.background,
        borderRadius: 50,
    },
    textInput: {
        padding: 10,
        borderColor: Colors.default.secondaryBackground,
        borderWidth: 3,
        borderRadius: 50,
        maxHeight: 100,
        fontFamily: 'ZZZWebFont',
        color: Colors.default.text,
        textAlignVertical: 'center',
    }
})