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

export default function ModalScreen() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isTextValid, setIsTextValid] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSendMessage = () => {
    console.log(currentText.length)
    console.log(currentText)
    if (currentText.trim()) {
      setMessages([...messages, currentText]);
      setCurrentText(''); // Clear the input
      setIsTextValid(false); // Reset the button state
      scrollViewRef?.current?.scrollToEnd({animated: true})
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
            uri: 'https://cdn.discordapp.com/avatars/793983601288544286/bb5684e2e246ce452aaebb584d9a7c91'
            }} 
            width={40} 
            height={40} 
            style={styles.imageContainer}
          />
        </View>
        <Text style={{...styles.title, marginLeft: 10}}>Asaba Harumasa</Text>
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
        {messages.map((message, index) => (
          <MessageBubble message={message} key={index} direction={2} source='https://cdn.discordapp.com/avatars/793983601288544286/bb5684e2e246ce452aaebb584d9a7c91' />
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

