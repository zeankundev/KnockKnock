import { Image, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { getLocales } from 'expo-localization';
import Locales from '@/constants/Locales';
import Colors from '@/constants/Colors';
import * as Device from 'expo-device';
import { SvgXml } from 'react-native-svg';
import VectorGraphics from '@/constants/VectorGraphics';
import { ExternalLink } from '@/components/ExternalLink';
import { useStringifiedLocale } from '@/components/LocaleManager';

export default function TabTwoScreen() {
  const [locale, setLocale] = useState<keyof typeof Locales>('en');
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
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash-icon.png')} 
        style={{ width: 128, height: 128 }}
      />
      <Text style={styles.title}>Knock Knock</Text>
      <Text style={styles.miniText}>{Locales[useStringifiedLocale()].about}{'\n'}</Text>
      <View style={styles.copyright}>
        <Text style={{fontFamily: 'ZZZWebFont'}}>made with ❤️ by</Text>
        <TouchableOpacity>
          <ExternalLink
            href='https://github.com/zeankundev'
          >
            <SvgXml xml={VectorGraphics.zeanKunDevLogomark} width={140} height={20}></SvgXml>
          </ExternalLink>
        </TouchableOpacity>
        <Text style={{fontFamily: 'ZZZWebFont'}}>© {new Date().getFullYear()}</Text>
      </View>
      <TouchableOpacity>
        <ExternalLink
          href='https://github.com/zeankundev/KnockKnock'
        >
          <Text style={styles.miniText}>({Locales[useStringifiedLocale()].getYourOwnBuild})</Text>
        </ExternalLink>
      </TouchableOpacity>
      <View style={styles.separator} />
      <Text style={styles.title}>Debug/extra info</Text>
      <Text style={styles.miniText}>
        Brand: {Device.brand}{'\n'}
        Design name: {Device.designName}{'\n'}
        Device name: {Device.deviceName}{'\n'}
        Device type: {Device.deviceType}{'\n'}
        Manufacturer: {Device.manufacturer}{'\n'}
        Model ID: {Device.modelId}{'\n'}
        Device year class: {Device.deviceYearClass}{'\n'}
        OS name: {Platform.OS === 'android' ? 'Android' : 'iOS'}{'\n'}
        Build fingerprint: {Device.osBuildFingerprint}{'\n'}
        OS version: {Device.osVersion}{'\n'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'ZZZWebFont'
  },
  copyright: {
    display: 'flex',
    flexDirection: 'row'
  },
  miniText: {
    maxWidth: 300,
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Menlo'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    borderColor: Colors.default.secondaryBackground,
    borderTopWidth: 2,
    width: '80%',
  },
});
