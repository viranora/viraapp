import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.1.103:4000';

export default function SettingsScreen() {
  const { token, updateUser } = useAuth();
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || !currentPassword.trim()) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }
    try {
      const response = await axios.patch(`${API_URL}/api/auth/users/${token}/username`, {
        currentPassword, newUsername
      });
      await updateUser(response.data);
      Alert.alert("Başarılı", "Kullanıcı adın güncellendi.");
      resetStatesAndClose();
    } catch (error: any) {
      Alert.alert("Hata", error.response?.data?.message || "Bir sorun oluştu.");
    }
  };

  const handleUpdatePassword = async () => {
     if (!newPassword.trim() || !currentPassword.trim()) {
      Alert.alert("Hata", "Tüm alanları doldurun.");
      return;
    }
    try {
      await axios.patch(`${API_URL}/api/auth/users/${token}/password`, {
        currentPassword, newPassword
      });
      Alert.alert("Başarılı", "Şifren güncellendi.");
      resetStatesAndClose();
    } catch (error: any) {
      Alert.alert("Hata", error.response?.data?.message || "Bir sorun oluştu.");
    }
  };
  
  const resetStatesAndClose = () => {
      setUsernameModalVisible(false);
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setIsCurrentPasswordVisible(false);
      setIsNewPasswordVisible(false);
  };

  return (
    <StyledView style={styles.container}>
       <StyledText type="title">Ayarlar</StyledText>
       <View style={styles.listContainer}>
        <TouchableOpacity style={styles.settingItem} onPress={() => setUsernameModalVisible(true)}>
          <StyledText style={styles.settingText}>Kullanıcı Adı Değiştir</StyledText>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => setPasswordModalVisible(true)}>
          <StyledText style={styles.settingText}>Şifre Değiştir</StyledText>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <StyledText style={styles.settingText}>Tema Değiştir</StyledText>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
       </View>

       {/* Kullanıcı Adı Değiştirme Modalı */}
       <Modal visible={usernameModalVisible} transparent={true} animationType="fade">
         <Pressable style={styles.modalOverlay} onPress={resetStatesAndClose}>
           <Pressable style={styles.modalContent}>
             <TouchableOpacity style={styles.closeButton} onPress={resetStatesAndClose}>
                <Ionicons name="close-circle" size={30} color="gray" />
             </TouchableOpacity>

             <StyledText style={styles.modalTitle}>Kullanıcı Adı Değiştir</StyledText>
             
             {/* --- DÜZELTME BURADA: Stil bozuk olan TextInput'u düzelttik --- */}
             <View style={styles.inputContainer}>
               <TextInput 
                 style={styles.textInput} 
                 placeholder="Yeni Kullanıcı Adı" 
                 value={newUsername} 
                 onChangeText={setNewUsername} 
                 placeholderTextColor="gray" 
                 autoCapitalize="none"
               />
             </View>
             
             <View style={styles.inputContainer}>
                <TextInput 
                  style={styles.textInput} 
                  placeholder="Mevcut Şifren" 
                  value={currentPassword} 
                  onChangeText={setCurrentPassword} 
                  secureTextEntry={!isCurrentPasswordVisible} 
                  placeholderTextColor="gray"
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                    <Ionicons name={isCurrentPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
                </TouchableOpacity>
             </View>

             <TouchableOpacity style={styles.saveButton} onPress={handleUpdateUsername}>
                <StyledText style={styles.saveButtonText}>Güncelle</StyledText>
             </TouchableOpacity>
           </Pressable>
         </Pressable>
       </Modal>
       
       {/* Şifre Değiştirme Modalı */}
       <Modal visible={passwordModalVisible} transparent={true} animationType="fade">
         <Pressable style={styles.modalOverlay} onPress={resetStatesAndClose}>
           <Pressable style={styles.modalContent}>
             <TouchableOpacity style={styles.closeButton} onPress={resetStatesAndClose}>
                <Ionicons name="close-circle" size={30} color="gray" />
             </TouchableOpacity>

             <StyledText style={styles.modalTitle}>Şifre Değiştir</StyledText>

             <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Mevcut Şifren" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry={!isCurrentPasswordVisible} placeholderTextColor="gray"/>
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsCurrentPasswordVisible(!isCurrentPasswordVisible)}>
                    <Ionicons name={isCurrentPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
                </TouchableOpacity>
             </View>
             
             <View style={styles.inputContainer}>
                <TextInput style={styles.textInput} placeholder="Yeni Şifre" value={newPassword} onChangeText={setNewPassword} secureTextEntry={!isNewPasswordVisible} placeholderTextColor="gray"/>
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
                    <Ionicons name={isNewPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
                </TouchableOpacity>
             </View>

             <TouchableOpacity style={styles.saveButton} onPress={handleUpdatePassword}>
                <StyledText style={styles.saveButtonText}>Güncelle</StyledText>
             </TouchableOpacity>
           </Pressable>
         </Pressable>
       </Modal>
    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#121212', paddingHorizontal: 20},
    listContainer: { width: '100%', marginTop: 30 },
    settingItem: { backgroundColor: '#2a2a2a', paddingVertical: 20, paddingHorizontal: 16, borderRadius: 8, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    settingText: { fontSize: 16, color: 'white' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { backgroundColor: '#1e1e1e', padding: 22, paddingTop: 45, borderRadius: 20, width: '90%', position: 'relative' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 20, textAlign: 'center' },
    saveButton: { backgroundColor: '#007AFF', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    saveButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    eyeIcon: { padding: 4, },
    closeButton: { position: 'absolute', top: 15, right: 15, zIndex: 1, },
    
    // --- DÜZELTİLEN STİLLER ---
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 14,
    },
    textInput: { 
        flex: 1, 
        color: 'white', 
        fontSize: 16,
        paddingVertical: 14,
    },
});