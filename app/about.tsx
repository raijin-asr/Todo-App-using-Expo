import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

export default function AboutScreen() {
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const appVersion = '1.0.0'; 
  const developerName = 'Raijin';
  const supportEmail = 'support@raijintodo.com';
  const websiteUrl = ''; 
  const privacyPolicyUrl = ''; 
  const termsOfServiceUrl = ''; 

  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        alert(`Cannot open the link: ${url}`);
      }
    });
  };

  const darkStyles = isDarkModeEnabled ? {
    container: { backgroundColor: '#181818' },
    title: { color: '#fff' },
    text: { color: '#aaa' },
  } : {};

  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/ameer.jpeg')} 
        style={styles.appLogo}
        resizeMode="contain"
      />
      
      <Text style={[styles.appName, darkStyles.title]}>Raijin Todo</Text>
      <Text style={[styles.appVersion, darkStyles.text]}>Version {appVersion}</Text>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={[styles.sectionText, darkStyles.text]}>
          I developed it so that i can install it on my phone without internt connection.
        </Text>
      </View>

      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL(`mailto:${supportEmail}`)}>
          <Ionicons name="mail-outline" size={20} color="#333" style={styles.contactIcon} />
          <Text style={[styles.contactText, darkStyles.text]}>{supportEmail}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.contactItem} onPress={() => handleLinkPress(websiteUrl)}>
          <Ionicons name="globe-outline" size={20} color="#333" style={styles.contactIcon} />
          <Text style={[styles.contactText, darkStyles.text]}>Visit Our Website</Text>
        </TouchableOpacity>
      </View>

      {/* Legal Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal & Privacy</Text>
        <TouchableOpacity onPress={() => handleLinkPress(privacyPolicyUrl)}>
          <Text style={[styles.linkText, darkStyles.text]}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLinkPress(termsOfServiceUrl)}>
          <Text style={[styles.linkText, darkStyles.text]}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

      {/* Dark Mode Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 24 }}>
        <Text style={[{ marginRight: 10 }, darkStyles.text]}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsDarkModeEnabled}
          value={isDarkModeEnabled}
        />
      </View>
  
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} {developerName}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40, 
  },
  appLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 20, 
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  appVersion: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactIcon: {
    marginRight: 10,
  },
  contactText: {
    fontSize: 16,
    color: 'blue', 
    textDecorationLine: 'underline',
  },
  linkText: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});