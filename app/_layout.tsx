import Index from './index';
import { createDrawerNavigator, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import SettingsScreen from './settings';
import AboutScreen from './about';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  // Add dark mode state for the drawer
  const [isDarkModeEnabled, setIsDarkModeEnabled] = React.useState(false);
  const darkStyles = isDarkModeEnabled ? {
    drawerContentScrollView: { backgroundColor: '#181818' },
    drawerHeader: { backgroundColor: '#232323', borderColor: '#333' },
    drawerTitle: { color: '#fff' },
    drawerMenuItem: { backgroundColor: '#232323' },
    drawerMenuText: { color: '#fff' },
    drawerFooterText: { color: '#aaa' },
  } : {};
  const { state, navigation } = props;
  const activeRoute = state?.routeNames[state?.index] || 'Home';
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={[styles.drawerContentScrollView, darkStyles.drawerContentScrollView]}>
      <View style={[styles.drawerHeader, darkStyles.drawerHeader]}>
        <Text style={[styles.drawerTitle, darkStyles.drawerTitle]}>Raijin Todo</Text>
        <TouchableOpacity onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={28} color={isDarkModeEnabled ? '#fff' : 'black'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.drawerMenuItem, activeRoute === 'Home' && styles.drawerMenuItemActive, darkStyles.drawerMenuItem]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="home" size={22} color={activeRoute === 'Home' ? 'tomato' : isDarkModeEnabled ? '#fff' : 'black'} style={styles.drawerMenuIcon} />
        <Text style={[styles.drawerMenuText, activeRoute === 'Home' && styles.drawerMenuTextActive, darkStyles.drawerMenuText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.drawerMenuItem, activeRoute === 'Settings' && styles.drawerMenuItemActive, darkStyles.drawerMenuItem]}
        onPress={() => navigation.navigate('Settings')}
      >
        <Ionicons name="settings" size={22} color={activeRoute === 'Settings' ? 'tomato' : isDarkModeEnabled ? '#fff' : 'black'} style={styles.drawerMenuIcon} />
        <Text style={[styles.drawerMenuText, activeRoute === 'Settings' && styles.drawerMenuTextActive, darkStyles.drawerMenuText]}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.drawerMenuItem, activeRoute === 'About' && styles.drawerMenuItemActive, darkStyles.drawerMenuItem]}
        onPress={() => navigation.navigate('About')}
      >
        <Ionicons name="information-circle" size={22} color={activeRoute === 'About' ? 'tomato' : isDarkModeEnabled ? '#fff' : 'black'} style={styles.drawerMenuIcon} />
        <Text style={[styles.drawerMenuText, activeRoute === 'About' && styles.drawerMenuTextActive, darkStyles.drawerMenuText]}>About</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <Text style={[{ fontSize: 16, marginRight: 10 }, darkStyles.drawerMenuText]}>Dark Mode</Text>
        <Switch
          value={isDarkModeEnabled}
          onValueChange={setIsDarkModeEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDarkModeEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      <View style={styles.flexSpacer} />
      <View style={styles.drawerFooter}>
        <Text style={[styles.drawerFooterText, darkStyles.drawerFooterText]}>Developed with ❣️ by <Text style={{fontWeight: 'bold', fontSize:26}}>Raijin</Text></Text>
      </View>
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function Layout() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={Index} 
        options={{
          headerShown: false, 
        }}/>
      <Drawer.Screen name="Settings" component={SettingsScreen} 
          options={{
          title: 'Settings', 
          headerLeft: undefined, 
        }}/>
      <Drawer.Screen name="About" component={AboutScreen} 
        options={{
            title: 'About', 
            headerLeft: undefined, 
        }}/>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContentScrollView: {
    flex: 1,
    paddingBottom: 0,
  },
  drawerHeader: {
    padding: 24,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  drawerMenuItemActive: {
    backgroundColor: '#fbeee6',
    borderLeftWidth: 5,
    borderLeftColor: 'tomato',
  },
  drawerMenuIcon: {
    marginRight: 12,
  },
  drawerMenuText: {
    fontSize: 16,
  },
  drawerMenuTextActive: {
    color: 'tomato',
    fontWeight: 'bold',
  },
  flexSpacer: {
    flex: 1,
  },
  drawerFooter: {
    alignItems: 'center',
    padding: 16,
  },
  drawerFooterText: {
    fontSize: 14,
    color: '#888',
  },
});
