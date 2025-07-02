import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Linking, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // If you need navigation within settings

export default function SettingsScreen() {
  const navigation = useNavigation(); // Hook for navigation

  // Example states for settings toggles
  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(true);
  const [showCompletedByDefault, setShowCompletedByDefault] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  // Dynamic styles for dark mode
  const darkStyles = isDarkModeEnabled ? {
    scrollViewContainer: { backgroundColor: '#181818' },
    container: { backgroundColor: '#181818' },
    section: { backgroundColor: '#232323', shadowColor: '#000' },
    sectionTitle: { color: '#fff', borderBottomColor: '#333' },
    settingItem: { borderBottomColor: '#222' },
    settingText: { color: '#fff' },
    settingValue: { color: '#aaa' },
  } : {};

  // Function to handle opening external links
  const handleLinkPress = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open this URL: ${url}`);
      }
    });
  };

  // Function to handle sensitive actions like deleting all data
  const handleDeleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            //logic to delete all data here
            console.log('All data deleted!');
            Alert.alert('Success', 'All tasks have been deleted.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.scrollViewContainer, darkStyles.scrollViewContainer]} contentContainerStyle={[styles.container, darkStyles.container]}>
      {/* --- Account Settings --- */}
      <View style={[styles.section, darkStyles.section]}>
        <Text style={[styles.sectionTitle, darkStyles.sectionTitle]}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingText, darkStyles.settingText]}>Username</Text>
            <Text style={[styles.settingValue, darkStyles.settingValue]}>Raijin</Text> 
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* --- General Settings --- */}
      <View style={[styles.section, darkStyles.section]}>
        <Text style={[styles.sectionTitle, darkStyles.sectionTitle]}>General</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Dark Mode</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={setIsDarkModeEnabled}
            value={isDarkModeEnabled}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Notifications</Text>
          <Switch
            onValueChange={setAreNotificationsEnabled}
            value={areNotificationsEnabled}
          />
        </View>
      </View>

      {/* --- Todo-Specific Settings --- */}
      <View style={[styles.section, darkStyles.section]}>
        <Text style={[styles.sectionTitle, darkStyles.sectionTitle]}>Todo Options</Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Show Completed Tasks by Default</Text>
          <Switch
            onValueChange={setShowCompletedByDefault}
            value={showCompletedByDefault}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Confirm Deletion</Text>
          <Switch
            onValueChange={setConfirmDelete}
            value={confirmDelete}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Default New Task Day</Text>
          <Text style={[styles.settingValue, darkStyles.settingValue]}>Today</Text> {/* Example: This could open a picker */}
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* --- Data Management --- */}
      <View style={[styles.section, darkStyles.section]}>
        <Text style={[styles.sectionTitle, darkStyles.sectionTitle]}>Data Management</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => { /* Implement backup logic */ Alert.alert('Backup', 'Backup initiated!'); }}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Backup Data</Text>
          <Ionicons name="cloud-upload-outline" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAllData}>
          <Text style={[styles.settingText, { color: 'red' }]}>Delete All Tasks</Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </View>

      {/* --- Help & Support --- */}
      <View style={[styles.section, darkStyles.section]}>
        <Text style={[styles.sectionTitle, darkStyles.sectionTitle]}>Help & Support</Text>
        <TouchableOpacity style={styles.settingItem}  onPress={() => handleLinkPress('')}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Frequently Asked Questions</Text>
          <Ionicons name="help-circle-outline" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('')}>
          <Text style={[styles.settingText, darkStyles.settingText]}>Contact Support</Text>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#888" />
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  section: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 15,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0', // Lighter line between items
  },

  'settingItem:last-child': {
    borderBottomWidth: 0,
  },
  settingTextContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});