import { FlatList, Image, KeyboardAvoidingView, StyleSheet, Keyboard, Text, TextInput, TouchableOpacity, View, Platform, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import { useEffect, useState, useRef } from "react"; // Import useRef
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { memo } from 'react'; // Import memo for optimization
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu'; // Import material menu for minimal UI popover

// custom types for todo items
type TodoType = {
  id: number;
  title: string;
  isDone: boolean;
  day: string; // New property to associate tasks with specific days
}

export default function Index() {
  // Sample data for todo items
  const todoData = [
    {
      id: 1,
      title: "Todo 1",
      isDone: false,
      day: 'S',
    },
    {
      id: 2,
      title: "Todo 2",
      isDone: false,
      day: 'M',
    },
    {
      id: 3,
      title: "Todo 3",
      isDone: true,
      day: 'T',
    },
    {
      id: 4,
      title: "Todo 4",
      isDone: false,
      day: 'W',
    },
  ];

  const [todos, setTodos] = useState<TodoType[]>([]);
  const [completedTodos, setCompletedTodos] = useState<TodoType[]>([]); // State for completed todos
  const [todoText, setTodoText] = useState<string>("");
  const [searchTodo, setSearchTodo] = useState<string>("");
  const [oldTodos, setOldTodos] = useState<TodoType[]>([]);
  const [completedTodosBackup, setCompletedTodosBackup] = useState<TodoType[]>([]); // Backup for completed todos
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<TodoType | null>(null);
  const [isSearchActive, setIsSearchActive] = useState(false); // State to toggle search input
  const searchInputRef = useRef<TextInput>(null); // Create a ref for the TextInput
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false); // State to toggle Completed section
  const [menuRef, setMenuRef] = useState<Menu | null>(null); // State to manage menu reference
  const [isMenuVisible, setMenuVisible] = useState(false); // State to toggle menu visibility
  const [selectedDay, setSelectedDay] = useState<string>('S'); // Default to Sunday

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

  // Load completed todos from AsyncStorage
  useEffect(() => {
    const getCompletedTodos = async () => {
      try {
        const storedCompletedTodos = await AsyncStorage.getItem("completed-todo");
        if (storedCompletedTodos !== null) {
          const parsedCompletedTodos = JSON.parse(storedCompletedTodos);
          setCompletedTodos(parsedCompletedTodos);
          setCompletedTodosBackup(parsedCompletedTodos);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCompletedTodos();
  }, []);

  // Update addTodo to only update count for the selected day
  const addTodo = async () => {
    try {
      const newTodo = {
        id: Math.random(),
        title: todoText,
        isDone: false,
        day: selectedDay, // Associate new todo with the selected day
      };
      const updatedTodos = [...todos, newTodo]; // Add new todo to the list
      setTodos(updatedTodos);
      setOldTodos(updatedTodos);
      await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
      setTodoText("");
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  // Update the deleteTodo function to include a confirmation alert
  const deleteTodo = async (id: number, isCompleted: boolean) => {
    try {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this task?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: async () => {
              if (isCompleted) {
                const updatedCompleted = completedTodos.filter((todo) => todo.id !== id);
                setCompletedTodos(updatedCompleted);
                setCompletedTodosBackup(updatedCompleted);
                await AsyncStorage.setItem('completed-todo', JSON.stringify(updatedCompleted));
              } else {
                const updatedTodos = todos.filter((todo) => todo.id !== id);
                setTodos(updatedTodos);
                setOldTodos(updatedTodos);
                await AsyncStorage.setItem('my-todo', JSON.stringify(updatedTodos));
              }
            },
          },
        ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  //Function to handle checked and Done todo item
  const handleDone = async (id: number) => {
    try {
      const todoIndex = todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        const updatedTodo = { ...todos[todoIndex], isDone: true };
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
        setCompletedTodos([...completedTodos, updatedTodo]);
        setCompletedTodosBackup([...completedTodos, updatedTodo]);
        await AsyncStorage.setItem("my-todo", JSON.stringify(updatedTodos));
        await AsyncStorage.setItem("completed-todo", JSON.stringify([...completedTodos, updatedTodo]));
      } else {
        const completedIndex = completedTodos.findIndex((todo) => todo.id === id);
        const updatedTodo = { ...completedTodos[completedIndex], isDone: false };
        const updatedCompleted = completedTodos.filter((todo) => todo.id !== id);
        setCompletedTodos(updatedCompleted);
        setCompletedTodosBackup(updatedCompleted);
        setTodos([...todos, updatedTodo]);
        await AsyncStorage.setItem("my-todo", JSON.stringify([...todos, updatedTodo]));
        await AsyncStorage.setItem("completed-todo", JSON.stringify(updatedCompleted));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSearch = (searchText: string) => {
    if (searchText === '') {
      setTodos(oldTodos);
      setCompletedTodos(completedTodosBackup);
    } else {
      const filteredTodos = oldTodos.filter((todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      );
      const filteredCompleted = completedTodosBackup.filter((todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setTodos(filteredTodos);
      setCompletedTodos(filteredCompleted);
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
  
  // Function to delete all tasks in the To Do list
  const deleteAllTodos = async () => {
    try {
      setTodos([]);
      setOldTodos([]);
      await AsyncStorage.setItem('my-todo', JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  };

  // Function to delete all tasks in the Completed list
  const deleteAllCompleted = async () => {
    try {
      setCompletedTodos([]);
      setCompletedTodosBackup([]);
      await AsyncStorage.setItem('completed-todo', JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  };

  // Function to show the menu
  const showMenu = () => {
    setMenuVisible(true);
  };

  // Function to hide the menu
  const hideMenu = () => {
    setMenuVisible(false);
  };

  // Function to handle menu option selection
  const handleMenuOption = (option: string) => {
    hideMenu();
    if (option === 'Delete All To Do') {
      deleteAllTodos();
    } else if (option === 'Delete All Completed') {
      deleteAllCompleted();
    }
  };

  // Filter tasks based on the selected day
  const filteredTodos = todos.filter((todo) => todo.day === selectedDay);
  const filteredCompletedTodos = completedTodos.filter((todo) => todo.day === selectedDay);

  // Map to convert day abbreviation to full date string
  const dayToDateMap: { [key: string]: string } = {
    Sun: 'Sunday, 2025',
    M: 'Monday, 2025',
    T: 'Tuesday, 2025',
    W: 'Wednesday, 2025',
    Th: 'Thursday, 2025',
    F: 'Friday, 2025',
    S: 'Saturday, 2025',
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { alert("Menu Clicked!") }}>
          <Ionicons name="menu" size={24} color={'black'} />
        </TouchableOpacity>
        <View style={styles.searchProfileContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsSearchActive(!isSearchActive);
              if (!isSearchActive) {
                setTimeout(() => searchInputRef.current?.focus(), 0); // Focus the TextInput after toggling
              }
            }}
          >
            <Ionicons name="search" size={24} color={'grey'} />
          </TouchableOpacity>
          {isSearchActive && (
            <TextInput
              ref={searchInputRef} // Attach the ref to the TextInput
              style={styles.searchInput}
              placeholder="Search"
              value={searchTodo}
              onChangeText={(text) => setSearchTodo(text)}
              clearButtonMode="always"
              onBlur={() => {
                if (searchTodo === '') {
                  setIsSearchActive(false);
                }
              }}
            />
          )}
          <TouchableOpacity onPress={() => { alert("Photo Clicked!") }}>
            <Image source={require('../assets/images/ameer.jpeg')} style={styles.imgProfile} />
          </TouchableOpacity>
        </View>
      </View>
    
      <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>{dayToDateMap[selectedDay]}</Text>
        </View>
       

      {/* Day selector */}
      <View style={styles.daySelectorContainer}>
        {['Sun', 'M', 'T', 'W', 'Th', 'F', 'S'].map((day, index) => (
          <TouchableOpacity
            key={`${day}-${index}`} // Ensure unique keys by appending the index
            style={[
              styles.dayToggle,
              selectedDay === day && styles.selectedDayToggle, // Highlight selected day
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.recentTaskContainer}>
        <View style={styles.headerWithOptions}>
          <Text style={styles.recentTaskText}>To Do ({filteredTodos.length})</Text> {/* Use filteredTodos for count */}
          <Menu
            ref={(ref) => setMenuRef(ref)}
            visible={isMenuVisible}
            anchor={
              <TouchableOpacity onPress={showMenu}>
                <Ionicons name="ellipsis-horizontal" size={24} color="black" />
              </TouchableOpacity>
            }
            onRequestClose={hideMenu}
          >
            <MenuItem onPress={() => handleMenuOption('Delete All To Do')}>Delete All To Do</MenuItem>
            <MenuDivider />
            <MenuItem onPress={() => handleMenuOption('Delete All Completed')}>Delete All Completed</MenuItem>
          </Menu>
        </View>
      </View>

      <FlatList
        data={[...filteredTodos].reverse()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            deleteTodo={deleteTodo}
            handleDone={handleDone}
            openEditModal={openEditModal}
            isCompleted={false}
          />
        )}
        ListEmptyComponent={<Text style={styles.noTaskText}>No tasks available</Text>} // Show message when no tasks
        style={styles.todoList}
      />

      <View style={styles.competedTaskContainer}>
        <View style={styles.completedHeader}>
          <Text style={styles.competedTaskText}>Completed ({filteredCompletedTodos.length})</Text> {/* Use filteredCompletedTodos for count */}
          <TouchableOpacity onPress={() => setIsCompletedExpanded(!isCompletedExpanded)}>
            <Text style={styles.showAllText}>{isCompletedExpanded ? 'Hide' : 'Show All'}</Text>
          </TouchableOpacity>
        </View>
      {isCompletedExpanded && (
        <FlatList
          data={filteredCompletedTodos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              deleteTodo={deleteTodo}
              handleDone={handleDone}
              openEditModal={openEditModal}
              isCompleted={true}
            />
          )}
          ListEmptyComponent={<Text style={{color: "white", textAlign:"center", fontSize:16}}>No tasks available</Text>} // Show message when no tasks
          style={styles.completedList}
        />
      )}
      </View>


      <KeyboardAvoidingView
        style={styles.addTodoContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={100} // Adjust offset to prevent overlap
      >
        <TextInput
          placeholder="Add New Todo Task"
          value={todoText}
          onChangeText={(text) => setTodoText(text)}
          style={styles.addInput}
          autoCorrect={false}
          multiline={true} // Enable multi-line input
          numberOfLines={4} // Suggest an initial number of lines
          textAlignVertical="top" // Start text from the top
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

// Wrap TodoItem in React.memo for optimization
const TodoItem = memo(({ todo, deleteTodo, handleDone, openEditModal, isCompleted }: {
  todo: TodoType;
  deleteTodo: (id: number, isCompleted: boolean) => void;
  handleDone: (id: number) => void;
  openEditModal: (todo: TodoType) => void;
  isCompleted: boolean;
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
          {todo.title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {!isCompleted && (
          <TouchableOpacity onPress={() => openEditModal(todo)}>
            <Ionicons name="create-outline" size={22} color={'blue'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => deleteTodo(todo.id, isCompleted)}
        >
          <Ionicons name="trash" size={24} color={'red'} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  searchProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 12 : 10,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    fontSize: 16,
    color: 'black',
    width: 200,
  },
  imgProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedDateContainer: {
    padding: 10,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
  },
  daySelectorContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dayToggle: {
    padding: 14,
    marginHorizontal: 4,
    backgroundColor: '#e0e0e0',
  },
  selectedDayToggle: {
    backgroundColor: 'tomato',
    borderWidth: 1,
    borderColor: 'black',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  recentTaskContainer: {
    marginBottom: 15,
   
  },
  headerWithOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentTaskText: {
    fontSize: 18,
    fontWeight: 'bold',
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
    width: 220,
  },
  todoText: {
    fontSize: 16,
    color: 'black',
  },
  addTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 14,
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    padding: 16,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 9,
    borderRadius: 10,
    marginLeft: 10,
  },

  //modal for editing todo
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
  todoList: {
    height: '60%',
  },
  completedList: {
    backgroundColor: '#4CAF50',
    padding: 10,
    marginBottom: 10,
  },
  showAllText: {
    color: 'white',
    fontWeight: 'bold',
  },
  competedTaskContainer: {
    marginBottom: 80,
  },
  competedTaskText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    marginTop: 15,
  },
  noTaskText: {
    textAlign: 'center',
    color: 'black',
    padding: 20,
    fontSize: 16,
  },
});