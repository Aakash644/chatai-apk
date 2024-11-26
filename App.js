import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
  Animated,
} from "react-native";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://chatai-tyo2.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setMessages([
        ...newMessages,
        { text: data.response || "No response", isUser: false },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { text: "Error: Unable to fetch response.", isUser: false },
      ]);
    }

    setIsLoading(false);
  };

  const handleClear = () => {
    setMessages([]);
  };

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY > 200) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <View
      style={[
        styles.container,
        darkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[styles.title, darkMode ? styles.darkTitle : styles.lightTitle]}
        >
          ChatAI
        </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={() => setDarkMode(!darkMode)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.isUser ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                darkMode ? styles.darkMessageText : styles.lightMessageText,
              ]}
            >
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      {/* Back to Top Button */}
      <Animated.View
        style={[
          styles.backToTopButton,
          { opacity: fadeAnim, display: fadeAnim ? "flex" : "none" },
        ]}
      >
        <TouchableOpacity onPress={scrollToTop}>
          <Text style={styles.backToTopText}>↑</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          placeholderTextColor={darkMode ? "#bbb" : "#888"}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

// Styles remain the same

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#F3F6F9",
  },
  header: {
    marginTop: 40,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: 'rgb(59,130,246)',
    borderBottomWidth: 1,
    borderBottomColor: "#D1D9E6",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  darkTitle: {
    color: "#fff",
  },
  lightTitle: {
    color: "#2C3E50",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    marginRight: 10,
    fontSize: 16,
    color: "#000",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E8EDF3",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D9E6",
  },
  messageText: {
    fontSize: 16,
    color: "#2C3E50",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#D1D9E6",
    backgroundColor: "#F7F9FC",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    color: "#2C3E50",
  },
  sendButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  clearButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToTopButton: {
    position: "absolute",
    bottom: 70, // Positioning the button further from the bottom
    right: 30,  // Positioning the button further from the right
    backgroundColor: "#007BFF", // Blue background
    width: 50, // Define explicit width
    height: 50, // Define explicit height
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
    borderRadius: 25, // Make the button round
    elevation: 8, // Give the button some depth
  },
  backToTopText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
});