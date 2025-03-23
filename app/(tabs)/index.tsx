import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Link, router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import {LinearGradient} from 'react-native-linear-gradient';
import TextField from '@/components/TextField';
import AISettings from '@/components/config/AISettings';
import { useEffect, useState } from 'react';

interface Contact {
  profilePicture: string;
  tag: string;
  name: string;
}

export default function TabOneScreen() {
  const [contacts, setContacts] = useState<Contact[] | null>(null);
  const PROD_JSON_URL = 'https://raw.githubusercontent.com/zeankundev/cdn/refs/heads/main/genai.json';
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await fetch(PROD_JSON_URL, {cache: 'no-cache'});
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setContacts(data)
      } catch (error) {
        console.error('💥 Error loading contacts:', error);
      }
    }
    loadContacts();
  }, [contacts])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View>
        <TextField placeholder='Search for anything (broken atm)'></TextField>
      </View>
      {contacts?.map((contact, index) => (
        <TouchableOpacity 
          style={styles.contactInfo} 
          onPress={() => router.push({ pathname: "/modal", params: { generativeAITag: contact.tag } })}
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
              <Text style={styles.subtitle}>Start chatting now...</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
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
    marginTop: 10
  },
  nestedContactInfo: {
    display: 'flex'
  },
  title: {
    fontSize: 20,
    fontFamily: 'ZZZWebFont'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'ZZZWebFont',
    color: Colors.default.secondaryBackground
  },
  mainText: {
    fontFamily: 'ZZZWebFont',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})