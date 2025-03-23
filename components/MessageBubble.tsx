import Colors from "@/constants/Colors";
import VectorGraphics from "@/constants/VectorGraphics";
import { Image, StyleSheet, View, Text, ViewProps } from "react-native";
import { SvgXml } from "react-native-svg";

const MESSAGE_DIRECTIONS = {
    LEFT: 1,
    RIGHT: 2
} as const;
interface BubbleProps {
    message: string,
    direction: number,
    source: string
}
export default function MessageBubble(props: BubbleProps, viewProps: ViewProps) {
    return (
        <View style={{...styles.overallMessageContainer, alignItems: props.direction === MESSAGE_DIRECTIONS.RIGHT ? 'flex-end' : 'flex-start'}} {...viewProps}>
            {props.direction == MESSAGE_DIRECTIONS.LEFT && (
            <View style={styles.messageContainer}>
                <Image source={{ uri: props.source }} style={{...styles.genericImageContainer, marginRight: 10}} />
                <View>
                <SvgXml xml={VectorGraphics.bubbleChatLeftWhite} style={styles.messageBubbleLeftISaid} width={24} height={24}/>
                <View style={styles.messageBubbleLeftDialogue}>
                    <Text style={styles.messageBubbleLeftText}>{props.message}</Text>
                </View>
                </View>
            </View>
            )}
            {props.direction == MESSAGE_DIRECTIONS.RIGHT && (
            <View style={styles.messageContainer}>
                <SvgXml xml={VectorGraphics.bubbleChatRightBlue} style={styles.messageBubbleRightISaid} width={24} height={24}/>
                <View style={styles.messageBubbleRightDialogue}>
                    <Text style={styles.messageBubbleRightText}>{props.message}</Text>
                </View>
                <Image source={{ uri: props.source }} style={{...styles.genericImageContainer, marginLeft: 10}} />
            </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    overallMessageContainer: {
        display: 'flex',
        marginTop: 10
    },
    messageContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    messageBubbleRightDialogue: {
        padding: 5,
        borderRadius: 50,
        backgroundColor: Colors.default.rightBubbleChat,
        paddingLeft: 7,
        paddingRight: 7
    },
    messageBubbleRightText: {
        color: Colors.default.rightBubbleChatText,
        fontFamily: 'ZZZWebFont',
        fontSize: 16
    },
    messageBubbleRightISaid: {
        position: 'absolute',
        top: -4,
        right: 37
    },
    messageBubbleLeftDialogue: {
        padding: 5,
        marginLeft: 3,
        borderRadius: 50,
        backgroundColor: Colors.default.leftBubbleChat,
        paddingLeft: 7,
        paddingRight: 7
    },
    messageBubbleLeftText: {
        color: Colors.default.leftBubbleChatText,
        fontFamily: 'ZZZWebFont',
        fontSize: 16
    },
    messageBubbleLeftISaid: {
        position: 'absolute',
        top: -5
    },
    genericImageContainer: {
        width: 32, 
        height: 32, 
        borderRadius: 50 
    }
})