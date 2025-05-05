
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';

export default function Index() {
  const todoData= [
    {
      id:1,
      title: "Todo 1",
      isDone: false,
    },
    {
      id:2,
      title: "Todo 2",
      isDone: false,
    },
    {
      id:3,
      title: "Todo 3",
      isDone: true,
    },
    {
      id:4,
      title: "Todo 4",
      isDone: false,
    },
  ]
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={()=> {alert("Menu Clicked!")}}>
          <Ionicons name="menu" size={24} color={'black'}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=> {alert("Photo Clicked!")}}>
        <Image source={require('../assets/images/ameer.jpeg')} style={{width: 40, height: 40, borderRadius: 20}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={'black'}/>
        <TextInput  
          style={styles.searchInput} 
          placeholder="Search" 
          clearButtonMode="always"
        />
      </View>
      <FlatList data={todoData} keyExtractor={(item) => item.id.toString()} 
      renderItem={({item}) => (
        <View style={styles.todoContainer}>
          <View style={styles.todoItem}>
            <Checkbox
              value={item.isDone}
              />
            <Text>{item.title}</Text>
          </View>
        </View>
      )} />

    </SafeAreaView>
  );
}

const styles= StyleSheet.create({
container:{
  flex: 1,
  paddingHorizontal: 20,
  backgroundColor: '#f5f5f5'
},
header:{
  marginBottom: 20,
  justifyContent:'space-between',
  flexDirection: 'row',
  alignItems: 'center',
},
searchBar:{
  backgroundColor: 'white',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderRadius: 10,
  marginBottom: 20,
  gap: 10,
},
searchInput:{
  flex: 1,
  fontSize: 16,
  color: 'black',
},
todoContainer:{
  backgroundColor: 'white',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
},
todoItem:{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
});
