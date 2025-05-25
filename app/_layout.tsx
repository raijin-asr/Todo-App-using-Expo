import Index from './index';
import { createDrawerNavigator, DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContentScrollView}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>Todo</Text>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {}}>
        <Ionicons name="settings" size={22} color="black" style={styles.drawerMenuIcon} />
        <Text style={styles.drawerMenuText}>Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.drawerMenuItem} onPress={() => {}}>
        <Ionicons name="information-circle" size={22} color="black" style={styles.drawerMenuIcon} />
        <Text style={styles.drawerMenuText}>About</Text>
      </TouchableOpacity>
      <View style={styles.flexSpacer} />
      <View style={styles.drawerFooter}>
        <Text style={styles.drawerFooterText}>Developed by Raijin</Text>
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
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Home" component={Index} />
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
  drawerMenuIcon: {
    marginRight: 12,
  },
  drawerMenuText: {
    fontSize: 16,
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