import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Keyboard ,Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {Ionicons} from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");

  //check if any data in async storage
  useEffect(() => {
    const getTodos = async () => { //defining the function to get data
      try {
        const storedTodos = await AsyncStorage.getItem("my-todo");
        if (storedTodos !== null) {
          setTodos(JSON.parse(storedTodos));
        } else { //if no data in async storage 
          setTodos(todoData); //set the default data
          await AsyncStorage.setItem("my-todo", JSON.stringify(todoData)); //store the default data in async storage
        }
      } catch (error) {
        console.log(error);
      }
    };
    getTodos(); //calling the function
  }, []);

  // Function to delete a todo item
  const deleteTodo = async (id: number) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id); // filter out the todo with the given id
      setTodos(updatedTodos); // update the state 
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos)); // update the async storage
    } catch (error) {
      console.log(error);
    }
  };


  // Function to add a new todo item
  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false,
      };
      todos.push(newTodo);
      setTodos(todos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(todos));
      setTodoText("");
      Keyboard.dismiss();
    } catch(error){
      console.log(error);
    }
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
        <TodoItem todo={item} deleteTodo={deleteTodo} />
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
const TodoItem = ({todo, deleteTodo}: {todo: TodoType, deleteTodo: (id: number)=> void}) => {
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
              onPress={() => {
                deleteTodo(todo.id);
                alert("Deleted "+ todo.title)}}
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
