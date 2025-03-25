import { StatusBar } from 'expo-status-bar';
import { Image, Platform, ScrollView, StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { SvgXml } from 'react-native-svg';
import Colors from '@/constants/Colors';

import { router, useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import VectorGraphics from '@/constants/VectorGraphics';
import TextField from '@/components/TextField';
import CircularButton from '@/components/CircularButton';
// Add this at the top with other imports
import { useEffect, useRef, useState } from 'react';
import Locales from '@/constants/Locales';
import { getLocales } from 'expo-localization';
import { SafeAreaView } from 'react-native-safe-area-context';
import MessageBubble from '@/components/MessageBubble';
import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Add these type definitions
type MessageType = {
  type: 'user' | 'robot';
  message: string;
};

type GenerativeAISettings = {
  name: string;
  tag: string;
  profilePicture: string;
  geminiToken: string;
  trainingData: string;
}

let aiSettings: GenerativeAISettings = {
  name: '',
  tag: '',
  profilePicture: '',
  geminiToken: '',
  trainingData: ''
};

export default function ModalScreen() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTextValid, setIsTextValid] = useState(false);
  const [AISettings, setAISettings] = useState<GenerativeAISettings | null>(null);
  const [locale, setLocale] = useState<keyof typeof Locales>('en');
  const { generativeAITag } = useLocalSearchParams<{generativeAITag: string}>();
  const scrollViewRef = useRef<ScrollView>(null);
  const PROD_JSON_URL = process.env['EXPO_PUBLIC_CONTACT_INFO_JSON'];

  // Initialize Gemini AI with token from settings
  useEffect(() => {
    const setDeviceLocale = async () => {
      const deviceLocales = getLocales();
      const preferredLocale = deviceLocales[0]?.languageCode || 'en';
      const supportedLocale = Object.keys(Locales).includes(preferredLocale) ? (preferredLocale as keyof typeof Locales) : 'en';
      setLocale(supportedLocale);
      console.log('📢 Locale set to:', supportedLocale);
    };

    setDeviceLocale();
  }, []);
  useEffect(() => {
    const loadAISettings = async () => {
      if (generativeAITag) {
        try {
          const response = await fetch(PROD_JSON_URL || '',{cache: 'no-cache'});
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          console.log(data)
          const foundAI = data.find((ai: any) => ai.tag === generativeAITag);
          console.log('[DEBUG] Found AI object:', foundAI);

          // Now set it
          if (foundAI) {
            setAISettings(foundAI);
          } else {
            console.warn('[WARN] No matching AI found for tag:', generativeAITag);
          }
        } catch (error) {
          console.error('💥 Error loading AI settings:', error);
        }
      }
    };
    loadAISettings();
  }, [generativeAITag])

  // Load conversation history from AsyncStorage
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('history.json');
        if (historyData) {
          const histories = JSON.parse(historyData);
            console.log('Loaded conversation histories:', histories);
            // Find history matching current AI tag
            if (generativeAITag) {
              const matchingHistory = histories.find((h: any) => h.tag === generativeAITag);
              if (matchingHistory && matchingHistory.history) {
                setMessages(matchingHistory.history);
                scrollViewRef?.current?.scrollToEnd({animated: true});
              }
            }
        }
      } catch (error) {
        console.error('Error loading history:', error);
      }
    };
    loadHistory();
  }, []);

  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);

  useEffect(() => {
    if (AISettings?.geminiToken) {
      setGenAI(new GoogleGenerativeAI(AISettings.geminiToken));
    }
  }, [AISettings]);

  const handleSendMessage = async () => {
    if (currentText.trim()) {
      const userMessage: MessageType = {
        type: 'user',
        message: currentText
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentText('');
      setIsTextValid(false);
      scrollViewRef?.current?.scrollToEnd({animated: true});
      // Add typing indicator after a small delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const typingMessage: MessageType = {
        type: 'robot',
        message: 'Typing...'
      };
      setMessages(prev => [...prev, typingMessage]);
      scrollViewRef?.current?.scrollToEnd({animated: true});

      try {
        if (!genAI) throw new Error('AI not initialized');
        const model = genAI.getGenerativeModel({ model: "learnlm-1.5-pro-experimental" });
        // Convert previous messages to conversation history format
        const conversationHistory = messages.map(msg => 
          msg.type === 'user' ? `user: ${msg.message}` : `you: ${msg.message}`
        ).join('\n');
        const prompt = `${AISettings?.trainingData}\n\nConversation history:\n${conversationHistory}\nuser: ${currentText}`;
        console.log(prompt)
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();

        console.log(`AI said: ${aiText}`)

        // Replace typing indicator with actual message
        setMessages(prev => {
          const updatedMessages = prev.slice(0, -1).concat({
            type: 'robot',
            message: aiText
          });

          // Save successful conversation to history.json
          const historyData = {
            tag: generativeAITag,
            history: updatedMessages
          };

          // Use AsyncStorage to save the history
          const saveHistory = async () => {
            try {
              const existingHistory = await AsyncStorage.getItem('history.json');
              let histories = existingHistory ? JSON.parse(existingHistory) : [];
              
              // Find and update existing history or add new one
              const existingIndex = histories.findIndex((h: any) => h.tag === generativeAITag);
              if (existingIndex >= 0) {
                histories[existingIndex] = historyData;
              } else {
                histories.push(historyData);
              }
              
              await AsyncStorage.setItem('history.json', JSON.stringify(histories));
              console.log('Saved history:', JSON.stringify(histories));
            } catch (error) {
              console.error('Error saving history:', error);
            }
          };

          saveHistory();
          return updatedMessages;
        });
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
  const clearChat = async () => {
    try {
      const existingHistory = await AsyncStorage.getItem('history.json');
      if (existingHistory) {
        const histories = JSON.parse(existingHistory);
        const updatedHistories = histories.map((h: any) => 
          h.tag === generativeAITag ? { ...h, history: [] } : h
        );
        await AsyncStorage.setItem('history.json', JSON.stringify(updatedHistories));
      }
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat:', error);
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
            uri: AISettings?.profilePicture
            }} 
            width={40} 
            height={40} 
            style={styles.imageContainer}
          />
        </View>
        <Text style={{...styles.title, marginLeft: 10}}>{AISettings?.name}</Text>
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
          <TouchableOpacity onPress={clearChat}>
            <Text style={{color: Colors.default.secondaryBackground}}>Clear chat</Text>
          </TouchableOpacity>
          <Image 
            source={{
              uri: AISettings?.profilePicture
            }}
            width={128}
            height={128}
            style={{borderRadius: 500}}
          />
          <Text style={{fontSize: 24, fontFamily: 'ZZZWebFont', marginTop: 10}}>{AISettings?.name}</Text>
          <Text style={{fontSize: 16, fontFamily: 'ZZZWebFont', marginTop: 10, color: Colors.default.tertiaryBackground, textAlign: 'center'}}>
            {Locales[locale].thisIsTheStart} {AISettings?.name}
          </Text>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
            <SvgXml xml={VectorGraphics.robotIcon} width={18} height={18} />
            <Text style={{color: Colors.default.tertiaryBackground, fontFamily: 'ZZZWebFont', fontSize: 12, marginLeft: 10}}>{Locales[locale].warning}</Text>
          </View>
        </View>
        {messages.map((message, index) => (
          <MessageBubble 
            message={message.message} 
            key={index} 
            direction={message.type === 'user' ? 2 : 1} 
            source={message.type === 'user' 
              ? process.env.CUSTOM_USER_PROFILE_PICTURE || 'https://i.ebayimg.com/images/g/RQkAAOSwqL1mOenh/s-l1200.jpg'
              : AISettings?.profilePicture || ''} 
          />
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.leftActions}>
          <TextField 
            placeholder={Locales[locale].sendAMessage} 
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

