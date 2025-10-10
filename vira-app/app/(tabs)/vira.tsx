import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'vira';
};

export default function ViraScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Seni dinliyorum...', sender: 'vira' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
      setMessages(prev => [userMessage, ...prev]);
      setInputText('');
      
      setTimeout(() => {
        const viraResponse: Message = { id: (Date.now() + 1).toString(), text: "Anlıyorum. Bu konuda daha fazla anlatmak ister misin?", sender: 'vira' };
        setMessages(prev => [viraResponse, ...prev]);
      }, 1500);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageRow,
      item.sender === 'user' ? styles.userRow : styles.viraRow
    ]}>
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.viraMessage
      ]}>
        <StyledText style={styles.messageText}>{item.text}</StyledText>
      </View>
    </View>
  );

  return (
    <StyledView style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
        inverted // Mesajları alttan başlatır ve yukarı doğru dizer
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={90} // Header yüksekliğini hesaba kat
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Vira'ya yaz..."
            placeholderTextColor="gray"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="arrow-up-circle" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    messageList: { paddingHorizontal: 10, },
    messageRow: {
      flexDirection: 'row',
      marginVertical: 4,
    },
    userRow: {
      justifyContent: 'flex-end',
    },
    viraRow: {
      justifyContent: 'flex-start',
    },
    messageContainer: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 18,
        maxWidth: '80%',
    },
    userMessage: {
        backgroundColor: '#007AFF', // Mavi
    },
    viraMessage: {
        backgroundColor: '#2a2a2a', // Gri
    },
    messageText: { color: 'white', fontSize: 16 },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#121212',
        borderTopWidth: 1,
        borderTopColor: '#333',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#2a2a2a',
        color: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        fontSize: 16,
    },
    sendButton: {},
});