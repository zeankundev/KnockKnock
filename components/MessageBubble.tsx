import Colors from "@/constants/Colors";
import VectorGraphics from "@/constants/VectorGraphics";
import * as Clipboard from 'expo-clipboard'
import { Image, StyleSheet, View, Text, ViewProps, TouchableOpacity,} from "react-native";
import { SvgXml } from "react-native-svg";

const MESSAGE_DIRECTIONS = {
    LEFT: 1,
    RIGHT: 2
} as const;
const MESSAGE_THRESHOLD = 25
interface BubbleProps {
    message: string,
    direction: number,
    source: string
}
export default function MessageBubble(props: BubbleProps, viewProps: ViewProps) {
    console.log(`Prop source: ${props.source}`)
    return (
        <TouchableOpacity activeOpacity={1} onLongPress={async () => Clipboard.setStringAsync(props.message)}>
            <View style={{...styles.overallMessageContainer, alignItems: props.direction === MESSAGE_DIRECTIONS.RIGHT ? 'flex-end' : 'flex-start'}} {...viewProps}>
                {props.direction == MESSAGE_DIRECTIONS.LEFT && (
                <View style={styles.messageContainer}>
                    <Image source={{ uri: props.source }} style={{...styles.genericImageContainer, marginRight: 10}} />
                        <View>
                        <SvgXml xml={VectorGraphics.bubbleChatLeftWhite} style={styles.messageBubbleLeftISaid} width={24} height={24}/>
                        <View style={{
                            ...styles.messageBubbleLeftDialogue,
                            borderRadius: props.message.includes('\n') || props.message.length > MESSAGE_THRESHOLD ? 20 : 50
                        }}>
                            <Text style={styles.messageBubbleLeftText}>
                                {(() => {
                                    const processedMessage = props.message.includes('\n')
                                        ? props.message
                                        : props.message.trim().split(' ').reduce((acc, word) => {
                                            const lastLine = acc.split('\n').pop() || '';
                                            const trimmedWord = word.trim();
                                            if (!trimmedWord) return acc;
                                            return lastLine.length + trimmedWord.length + 1 > MESSAGE_THRESHOLD - 5
                                                ? `${acc}${acc ? '\n' : ''}${trimmedWord}`
                                                : acc.length === 0 ? trimmedWord : `${acc} ${trimmedWord}`;
                                        }, '');
                                    console.log('Processed message:', processedMessage);
                                    return processedMessage;
                                })()}
                            </Text>
                        </View>
                    </View>
                </View>
                )}
                {props.direction == MESSAGE_DIRECTIONS.RIGHT && (
                <View style={styles.messageContainer}>
                    <SvgXml xml={VectorGraphics.bubbleChatRightBlue} style={styles.messageBubbleRightISaid} width={24} height={24}/>
                    <View style={{
                            ...styles.messageBubbleRightDialogue,
                            borderRadius: props.message.includes('\n') || props.message.length > MESSAGE_THRESHOLD ? 20 : 50
                        }}>
                        <Text style={styles.messageBubbleRightText}>
                            {props.message.includes('\n')
                                ? props.message
                                : props.message.trim().split(' ').reduce((acc, word) => {
                                    const lastLine = acc.split('\n').pop() || '';
                                    const trimmedWord = word.trim();
                                    if (!trimmedWord) return acc;
                                    return lastLine.length + trimmedWord.length + 1 > MESSAGE_THRESHOLD
                                        ? `${acc}${acc ? '\n' : ''}${trimmedWord}`
                                        : acc.length === 0 ? trimmedWord : `${acc} ${trimmedWord}`;
                                }, '')
                            }
                        </Text>
                    </View>
                    <Image source={{ uri: props.source }} style={{...styles.genericImageContainer, marginLeft: 10}} />
                </View>
                )}
            </View>
        </TouchableOpacity>
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
        maxWidth: 300,
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
        paddingRight: 7,
        maxWidth: 300
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