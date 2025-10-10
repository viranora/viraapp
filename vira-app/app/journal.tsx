import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.1.103:4000'; // Sunucu adresin

type JournalEntry = {
  _id: string;
  content: string;
  date: string;
};

export default function JournalScreen() {
  const { token } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [content, setContent] = useState('');

  // token her değiştiğinde (yani giriş yapıldığında) günlükleri çek
  useEffect(() => {
    if (token) {
        fetchEntries();
    }
  }, [token]);

  const fetchEntries = async () => {
    if (!token) return;
    try {
      // DÜZELTME: Yolun başına '/api' eklendi
      const response = await axios.get(`${API_URL}/api/journal/${token}`);
      setEntries(response.data);
    } catch (error) {
      console.error("Günlükler getirilemedi:", error);
      Alert.alert("Hata", "Günlükler sunucudan alınamadı.");
    }
  };

  const handleSave = async () => {
    if (!content.trim() || !token) return;
    try {
      // DÜZELTME: Yolun başına '/api' eklendi
      await axios.post(`${API_URL}/api/journal/add`, { userId: token, content });
      setContent('');
      fetchEntries(); // Listeyi yenile
    } catch (error) {
      Alert.alert("Hata", "Günlük kaydedilemedi.");
    }
  };

  const handleDelete = (entryId: string) => {
    Alert.alert("Yazıyı Sil", "Bu yazıyı silmek istediğine emin misin?", [
      { text: "Hayır", style: "cancel" },
      { text: "Evet", onPress: async () => {
        try {
          // DÜZELTME: Yolun başına '/api' eklendi
          await axios.delete(`${API_URL}/api/journal/delete/${entryId}`);
          fetchEntries(); // Listeyi yenile
        } catch (error) {
          Alert.alert("Hata", "Yazı silinemedi.");
        }
      }}
    ]);
  };

  return (
    <StyledView style={styles.container}>
       <StyledText type="title">Günlük</StyledText>
       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{width: '100%'}}>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Bugün içinden geçenler..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <StyledText style={styles.saveButtonText}>Kaydet</StyledText>
        </TouchableOpacity>
       </KeyboardAvoidingView>
       <FlatList
         data={entries}
         keyExtractor={(item) => item._id}
         renderItem={({ item }) => (
           <View style={styles.entryItem}>
             <StyledText style={styles.entryContent}>{item.content}</StyledText>
             <View style={styles.entryFooter}>
                <StyledText style={styles.entryDate}>{new Date(item.date).toLocaleDateString('tr-TR')}</StyledText>
                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                    <Ionicons name="trash-outline" size={20} color="gray" />
                </TouchableOpacity>
             </View>
           </View>
         )}
         style={{width: '100%', marginTop: 20}}
       />
    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, backgroundColor: '#121212', paddingHorizontal: 20 },
    input: {
      backgroundColor: '#2a2a2a', color: 'white', width: '100%', minHeight: 120,
      borderRadius: 8, padding: 16, fontSize: 16, marginTop: 20, textAlignVertical: 'top'
    },
    saveButton: {
      backgroundColor: '#fff', paddingVertical: 12, borderRadius: 8,
      alignItems: 'center', marginTop: 12
    },
    saveButtonText: { color: '#121212', fontWeight: 'bold' },
    entryItem: {
      backgroundColor: '#1e1e1e', padding: 16, borderRadius: 8,
      marginTop: 16
    },
    entryContent: { fontSize: 16, color: 'white' },
    entryFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
    entryDate: { color: 'gray', fontSize: 12 },
});