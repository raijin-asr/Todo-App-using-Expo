import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useState } from "react";

// custom types for todo items
type TodoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {
  // Sample data for todo items
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
  ];

  const [todos, setTodos] = useState<TodoType[]>(todoData);
  const [todoText, setTodoText] = useState<string>("");

  // Function to add a new todo item
  const addTodo = () => {
    const newTodo = {
      id: todos.length + 1,
      title: todoText,
      isDone: false,
    };
    todos.push(newTodo);
    setTodos(todos);
    setTodoText("");
  }
  
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
      <FlatList data={[...todos].reverse()} keyExtractor={(item) => item.id.toString()} 
      renderItem={({item}) => (
        <TodoItem todo={item} />
      )} />

      <KeyboardAvoidingView style={styles.addTodoContainer} behavior="padding" keyboardVerticalOffset={15}>
        <TextInput 
          placeholder="Add New Todo Task"
          value={todoText}
          onChangeText={(text) => setTodoText(text)} 
          style={ styles.addInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={32} color={'white'}/>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

//separate component for todo item
const TodoItem = ({todo}: {todo: TodoType}) => {
  return (
    <View style={styles.todoContainer}>
          <View style={styles.todoItem}>
            <Checkbox
              value={todo.isDone}
              color={todo.isDone ? 'green' : undefined}
              />
            <Text 
              style={[styles.todoText, todo.isDone && {textDecorationLine: 'line-through'} ]}
            >
              {todo.title}</Text>
          </View>
          <View>
            <TouchableOpacity 
              onPress={() => {alert("Deleted "+ todo.title)}}
            >
            <Ionicons name="trash" size={24} color={'red'}/>
            </TouchableOpacity>
          </View>
        </View>
  )
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
  marginTop: 15,
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
  flexDirection: 'row',
  justifyContent: 'space-between',
  backgroundColor: 'white',
  padding: 14,
  borderRadius: 10,
  marginBottom: 10,
},
todoItem:{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
todoText:{
  fontSize: 16,
  color: 'black',
},
addTodoContainer:{
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,

},
addInput:{
  flex: 1,
  fontSize: 16,
  color: 'black',
  padding: 16,
  borderRadius: 10,
  backgroundColor: 'white',
},
addButton:{
  backgroundColor: 'green',
  padding: 9,
  borderRadius: 10,
  marginLeft: 10,
},
});