import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'react-native-linear-gradient';
import TextField from '@/components/TextField';
import AISettings from '@/components/config/AISettings';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import Locales from '@/constants/Locales';
const FileSystem = require('expo-file-system');

interface Contact {
  profilePicture: string;
  tag: string;
  name: string;
}

export default function TabOneScreen() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const [locale, setLocale] = useState<keyof typeof Locales>('en');
  const PROD_JSON_URL = process.env['EXPO_PUBLIC_CONTACT_INFO_JSON'];
  const HISTORY_FILE = 'history.json';

  // Set locale on component mount
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

  // Function to create/check history file
  const initializeHistoryFile = async () => {
    const historyPath = `${FileSystem.documentDirectory}${HISTORY_FILE}`;

    try {
      const fileInfo = await FileSystem.getInfoAsync(historyPath);
      if (!fileInfo.exists) {
        await FileSystem.writeAsStringAsync(historyPath, JSON.stringify([]));
        console.log('✅ Created history file');
      }
    } catch (error) {
      console.error('❌ Error initializing history file:', error);
    }
  };

  useEffect(() => {
    initializeHistoryFile();
    const loadContacts = async () => {
      try {
        const response = await fetch(PROD_JSON_URL || '', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setContacts(data);
      } catch (error) {
        console.error('💥 Error loading contacts:', error);
      }
    };
    loadContacts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Locales[locale].home}</Text>
      <View>
        <TextField placeholder={Locales[locale].searchForAnything} />
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={contacts === null}
            onRefresh={() => setContacts(null)}
          />
        }
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        scrollEnabled={true}
        bounces={true}
      >
        {contacts?.map((contact, index) => (
          <TouchableOpacity
            style={styles.contactInfo}
            onPress={() => router.push({ pathname: '/modal', params: { generativeAITag: contact.tag } })}
            key={index}
          >
            <View style={styles.contactInfo}>
              <Image
                source={{ uri: contact.profilePicture }}
                width={52}
                height={52}
                style={{ borderRadius: 100 }}
              />
              <View style={styles.nestedContactInfo}>
                <Text style={styles.title}>{contact.name}</Text>
                <LastMessage tag={contact.tag} name={contact.name} locale={locale} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function LastMessage({ tag, name, locale }: { tag: string; name: string; locale: keyof typeof Locales }) {
  const [lastMessage, setLastMessage] = useState<string>(Locales[locale].loading);

  useEffect(() => {
    const getLastMessage = async () => {
      try {
        const historyData = await AsyncStorage.getItem('history.json');
        if (historyData) {
          const historyType = JSON.parse(historyData);
          console.log(JSON.stringify(historyType));
          const lastMessageEntry = historyType.find((entry: any) => entry.tag === tag);
          if (lastMessageEntry?.history?.length > 0) {
            const lastIndex = lastMessageEntry.history.length - 1;
            const firstWord = name.split(' ')[0];
            const truncatedMessage = lastMessageEntry.history[lastIndex].message.substring(0, 20) + '...';
            setLastMessage(`${firstWord}: ${truncatedMessage}`);
          } else {
            setLastMessage(Locales[locale].newChat);
          }
        }
      } catch (e) {
        console.error('Error getting last message:', e);
        setLastMessage(Locales[locale].newChat);
      }
    };
    getLastMessage();
  }, [tag, locale]);

  return <Text style={styles.subtitle}>{lastMessage}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.default.background,
    padding: 20,
    fontFamily: 'ZZZWebFont',
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  nestedContactInfo: {
    display: 'flex',
  },
  title: {
    fontSize: 20,
    fontFamily: 'ZZZWebFont',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'ZZZWebFont',
    color: Colors.default.secondaryBackground,
  },
  mainText: {
    fontFamily: 'ZZZWebFont',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
