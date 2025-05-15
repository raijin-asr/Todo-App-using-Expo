import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Keyboard, Text, TextInput, TouchableOpacity, View, Platform, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
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
  const todoData = [
    {
      id: 1,
      title: "Todo 1",
      isDone: false,
    },
    {
      id: 2,
      title: "Todo 2",
      isDone: false,
    },
    {
      id: 3,
      title: "Todo 3",
      isDone: true,
    },
    {
      id: 4,
      title: "Todo 4",
      isDone: false,
    },
  ];

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [todoText, setTodoText] = useState<string>("");
  const [searchTodo, setSearchTodo] = useState<string>("");
  const [oldTodos, setOldTodos] = useState<TodoType[]>([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<TodoType | null>(null);

  //check if any data in async storage
  useEffect(() => {
    const getTodos = async () => { //defining the function to get data
      try {
        const storedTodos = await AsyncStorage.getItem("my-todo");
        if (storedTodos !== null) {
          setTodos(JSON.parse(storedTodos));
          setOldTodos(JSON.parse(storedTodos));
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
      setOldTodos(todos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(todos));
      setTodoText("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  // Function to delete a todo item
  const deleteTodo = async (id: number) => {
    try {
      const updatedTodos = todos.filter((todo) => todo.id !== id); // filter out the todo with the given id
      setTodos(updatedTodos); // update the state 
      setOldTodos(updatedTodos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos)); // update the async storage
    } catch (error) {
      console.log(error);
    }
  };

  //Function to handle checked and Done todo item
  const handleDone = async (id: number) => {
    try {
      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone; //toggle done and not done
        }
        return todo;
      }
      );
      await AsyncStorage.setItem("my-todo", JSON.stringify(newTodos)); // update the async storage
      setTodos(newTodos);
      setOldTodos(newTodos);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (searchText: string) => {
    if (searchText == '') {
      setTodos(oldTodos);
    }
    else {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setTodos(filteredTodos);
    }
  };

  useEffect(() => {
    handleSearch(searchTodo);
  }, [searchTodo]);

  // Function to handle opening the edit modal
  const openEditModal = (todo: TodoType) => {
    setTodoToEdit(todo);
    setEditModalVisible(true);
  };

  // Function to handle updating the todo item
  const updateTodo = async () => {
    if (todoToEdit) {
      try {
        const updatedTodos = todos.map((todo) =>
          todo.id === todoToEdit.id ? { ...todo, title: todoToEdit.title } : todo
        );
        setTodos(updatedTodos);
        setOldTodos(updatedTodos);
        await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
        setEditModalVisible(false);
        setTodoToEdit(null);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { alert("Menu Clicked!") }}>
          <Ionicons name="menu" size={24} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { alert("Photo Clicked!") }}>
          <Image source={require('../assets/images/ameer.jpeg')} style={{ width: 40, height: 40, borderRadius: 20 }} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={'black'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchTodo}
          onChangeText={(text) => setSearchTodo(text)}
          clearButtonMode="always"
        />
      </View>
      <FlatList data={[...todos].reverse()} keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            deleteTodo={deleteTodo}
            handleDone={handleDone}
            openEditModal={openEditModal}
          />
        )} />

      <KeyboardAvoidingView style={styles.addTodoContainer} behavior="padding" keyboardVerticalOffset={15}>
        <TextInput
          placeholder="Add New Todo Task"
          value={todoText}
          onChangeText={(text) => setTodoText(text)}
          style={styles.addInput}
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => addTodo()}>
          <Ionicons name="add" size={32} color={'white'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Todo Item</Text>
            <TextInput
              style={styles.modalInputMultiline}
              value={todoToEdit?.title}
              onChangeText={(text) =>
                setTodoToEdit((prev) => (prev ? { ...prev, title: text } : prev))
              }
              multiline={true} // Enable multi-line input
              numberOfLines={4} // Suggest an initial number of lines
              textAlignVertical="top" // Start text from the top
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalUpdateButton} onPress={updateTodo}>
                <Text style={styles.modalUpdateButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

//separate component for todo item
const TodoItem = ({
  todo,
  deleteTodo,
  handleDone,
  openEditModal
}: {
  todo: TodoType;
  deleteTodo: (id: number) => void;
  handleDone: (id: number) => void;
  openEditModal: (todo: TodoType) => void;
}) => {
  return (
    <View style={styles.todoContainer}>
      <View style={styles.todoItem}>
        <Checkbox
          value={todo.isDone}
          onValueChange={() => handleDone(todo.id)}
          color={todo.isDone ? 'green' : undefined}
        />
        <Text
          style={[styles.todoText, todo.isDone && { textDecorationLine: 'line-through' }]}
        >
          {todo.title}</Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity onPress={() => openEditModal(todo)}>
          <Ionicons name="create-outline" size={22} color={'blue'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            deleteTodo(todo.id);
            alert("Deleted " + todo.title)
          }}
        >
          <Ionicons name="trash" size={24} color={'red'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5'
  },
  header: {
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  searchBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 12 : 10,
    borderRadius: 10,
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  todoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  todoText: {
    fontSize: 16,
    color: 'black',
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,

  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 9,
    borderRadius: 10,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInputMultiline: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 80, 
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalUpdateButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'green',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalUpdateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});