import Colors from "@/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from "react-native";
import { SvgXml } from "react-native-svg";

interface CircularButtonProps {
    onPress?: () => void;
    xml: string;
    xmlIfActive?: string;
    isActive: boolean;
    width?: number;
    height?: number;
    style?: ViewStyle;
}

export default function CircularButton(props: CircularButtonProps) {
    return (
        <View style={styles.primaryPadding}>
            <TouchableOpacity onPress={props.onPress} style={{...styles.button, backgroundColor: (props.isActive ? Colors.default.themeColor : Colors.default.background), ...props.style}}>
                <SvgXml xml={props.isActive ? (props.xmlIfActive ?? props.xml) : props.xml} width={props.width != null ? props.width : 20} height={props.height != null ? props.height : 20} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    primaryPadding: {
        padding: 5,
        borderRadius: 50,
        overflow: 'hidden', // This forces the child elements to respect the border radius
    },
    button: {
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