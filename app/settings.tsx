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


  return (
    <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.container}>

      {/* --- Account Settings --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingText}>Username</Text>
            <Text style={styles.settingValue}>Raijin</Text> 
          </View>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Logout</Text>
          <Ionicons name="log-out-outline" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* --- General Settings --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>General</Text>
     
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            onValueChange={setAreNotificationsEnabled}
            value={areNotificationsEnabled}
          />
        </View>
      </View>

      {/* --- Todo-Specific Settings --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Todo Options</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Show Completed Tasks by Default</Text>
          <Switch
            onValueChange={setShowCompletedByDefault}
            value={showCompletedByDefault}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Confirm Deletion</Text>
          <Switch
            onValueChange={setConfirmDelete}
            value={confirmDelete}
          />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Default New Task Day</Text>
          <Text style={styles.settingValue}>Today</Text> {/* Example: This could open a picker */}
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>


      {/* --- Help & Support --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>Frequently Asked Questions</Text>
          <Ionicons name="help-circle-outline" size={20} color="#888" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => Linking.openURL('')}>
          <Text style={styles.settingText}>Contact Support</Text>
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