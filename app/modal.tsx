import { StatusBar } from 'expo-status-bar';
import { Image, Platform, ScrollView, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SvgXml } from 'react-native-svg';
import Colors from '@/constants/Colors';

import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import VectorGraphics from '@/constants/VectorGraphics';
import TextField from '@/components/TextField';
import CircularButton from '@/components/CircularButton';
// Add this at the top with other imports
import { useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageBubble from '@/components/MessageBubble';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AISettings from '../components/config/AISettings';

// Add these type definitions
type MessageType = {
  type: 'user' | 'robot';
  message: string;
};

export default function ModalScreen() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTextValid, setIsTextValid] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Initialize Gemini AI with token from settings
  const genAI = new GoogleGenerativeAI(AISettings.geminiToken);

  const handleSendMessage = async () => {
    if (currentText.trim()) {
      const userMessage: MessageType = {
        type: 'user',
        message: currentText
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentText('');
      setIsTextValid(false);
      // Add typing indicator after a small delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const typingMessage: MessageType = {
        type: 'robot',
        message: 'Typing...'
      };
      setMessages(prev => [...prev, typingMessage]);
      scrollViewRef?.current?.scrollToEnd({animated: true});

      try {
        const model = genAI.getGenerativeModel({ model: "learnlm-1.5-pro-experimental" });
        const prompt = `${AISettings.trainingData}\n\nUser: ${currentText}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        console.log(`AI said: ${aiText}`)

        // Replace typing indicator with actual message
        setMessages(prev => prev.slice(0, -1).concat({
          type: 'robot',
          message: aiText
        }));
      } catch (error) {
        console.error('AI Error:', error);
        // Replace typing indicator with error message
        setMessages(prev => prev.slice(0, -1).concat({
          type: 'robot',
          message: 'Oooopsies! I encountered an error!'
        }));
      }
      scrollViewRef?.current?.scrollToEnd({animated: true});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <SvgXml xml={VectorGraphics.backButton} width={54} height={54} />
        </TouchableOpacity>
        <View>
          <Image source={{
            uri: AISettings.profilePicture
            }} 
            width={40} 
            height={40} 
            style={styles.imageContainer}
          />
        </View>
        <Text style={{...styles.title, marginLeft: 10}}>{AISettings.name}</Text>
      </View>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.mainMessageView}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        scrollEnabled={true}
        bounces={true}
      >     
        <View style={styles.introduction}>
          <Image 
            source={{
              uri: AISettings.profilePicture
            }}
            width={128}
            height={128}
            style={{borderRadius: 500}}
          />
          <Text style={{fontSize: 24, fontFamily: 'ZZZWebFont', marginTop: 10}}>{AISettings.name}</Text>
          <Text style={{fontSize: 16, fontFamily: 'ZZZWebFont', marginTop: 10, color: Colors.default.secondaryBackground, textAlign: 'center'}}>
            This is the start of your Knock Knock conversation with {AISettings.name}
          </Text>
        </View>
        {messages.map((message, index) => (
          <MessageBubble 
            message={message.message} 
            key={index} 
            direction={message.type === 'user' ? 2 : 1} 
            source={message.type === 'user' 
              ? AISettings.profilePicture
              : AISettings.profilePicture} 
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.leftActions}>
          <TextField 
            placeholder='Send a message' 
            value={currentText}
            onChangeText={text => {
              setCurrentText(text);
              setIsTextValid(text.length > 0);
            }} 
          />
        </View>
        <View style={styles.sideButton}>
          <CircularButton 
            xml={VectorGraphics.sendMessageInactive} 
            isActive={isTextValid}
            xmlIfActive={VectorGraphics.sendMessageActive}
            onPress={handleSendMessage}
          />
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: Colors.default.background,
    padding: 20
  },
  introduction: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainMessageView: {
    flex: 1,
    marginTop: 15
  }, // For naming purposes only so it's convenient
  messageTest: {
    fontFamily: 'ZZZWebFont',
  },
  leftActions: {
    borderRadius: 50,
    display: 'flex',
    flex: 1,
    marginRight: 10
  },
  sideButton: {
    marginLeft: 'auto', // This will push the button to the right
    display: 'flex',
    alignSelf:'flex-start',
    borderRadius: 50
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row'
  },
  imageContainer: {
    marginLeft: 20,
    borderRadius: 50
  },
  footer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.default.secondaryBackground,
    alignItems: 'center', // This will vertically center the items
  },
  title: {
    fontSize: 20,
    fontFamily: 'ZZZWebFont',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

