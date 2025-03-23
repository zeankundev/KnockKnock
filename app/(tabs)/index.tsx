import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Link, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import {LinearGradient} from 'react-native-linear-gradient';
import TextField from '@/components/TextField';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <View>
        <TextField placeholder='Search for anything (broken atm)'></TextField>
      </View>
      <Link href="/modal" asChild>
        <TouchableOpacity style={styles.contactInfo}>
          <View style={styles.contactInfo}>
        <Image 
        source={{
          uri: 'https://cdn.discordapp.com/avatars/793983601288544286/bb5684e2e246ce452aaebb584d9a7c91'
        }}
        width={52}
        height={52}
        style={{borderRadius: 100}}
        />
        <View style={styles.nestedContactInfo}>
          <Text style={styles.title}>Asaba Harumasa</Text>
          <Text style={styles.subtitle}>Start chatting now...</Text>
        </View>
          </View>
        </TouchableOpacity>
      </Link>
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