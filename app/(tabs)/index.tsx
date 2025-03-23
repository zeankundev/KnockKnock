import { StyleSheet } from 'react-native';

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
      <View style={{backgroundColor: Colors.default.secondaryBackground, padding: 5}}>
        <TextField placeholder='Hallo there...'></TextField>
      </View>
      <Link href="/modal" asChild>
        <Pressable>
          {({ pressed }) => (
            <FontAwesome
              name="info-circle"
              size={25}
              color={Colors.default.text}
              style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
            />
          )}
        </Pressable>
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
  title: {
    fontSize: 20,
    fontFamily: 'ZZZWebFont'
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
