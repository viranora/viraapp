import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.1.103:4000';

export default function ProfileScreen() {
  const { user, token, updateUser, updateUserStatus } = useAuth();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusText, setStatusText] = useState(user?.status || 'Buraya durumunuzu girin');

  // --- DÜZELTME BURADA ---
  // Bu useEffect, ana hafızadaki (AuthContext) 'user' nesnesi her güncellendiğinde çalışır.
  // Bu sayede, durumu kaydettikten sonra ekranın kendi geçici hafızası da anında güncellenir.
  useEffect(() => {
    if (user) {
      setStatusText(user.status);
    }
  }, [user]);
  // --- DÜZELTME SONU ---

  const handleSaveStatus = async () => {
    if (!user) return;
    try {
      await updateUserStatus(statusText);
      setIsEditingStatus(false); // Düzenleme modunu kapat
    } catch (error) {
      Alert.alert("Hata", "Durum güncellenemedi.");
    }
  };

  const handlePickImage = async () => {
    // Galeriyi açma izni iste
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("İzin Gerekli", "Profil fotoğrafı seçmek için galeriye erişim izni vermen gerekiyor.");
      return;
    }

    // Galeriyi aç
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Kare formatında kırp
      quality: 0.5, // Dosya boyutunu küçült
    });

    if (pickerResult.canceled) {
      return;
    }
    
    // Yükleme işlemini başlat
    const asset = pickerResult.assets[0];
    const formData = new FormData();
    formData.append('profileImage', {
        uri: asset.uri,
        name: `profile_${token}.jpg`,
        type: 'image/jpeg'
    } as any);

    try {
        const response = await fetch(`${API_URL}/api/upload/profile-picture/${token}`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const updatedUser = await response.json();

        if (response.ok) {
            await updateUser(updatedUser); // AuthContext'i güncelle
            Alert.alert("Başarılı", "Profil fotoğrafın güncellendi.");
        } else {
            throw new Error(updatedUser.message || "Yükleme başarısız");
        }
    } catch (error) {
        console.error("Fotoğraf yükleme hatası:", error);
        Alert.alert("Hata", "Fotoğraf yüklenirken bir sorun oluştu.");
    }
  };

  if (!user) {
    return (
      <StyledView style={styles.container}>
        <StyledText>Kullanıcı bilgileri yükleniyor...</StyledText>
      </StyledView>
    );
  }

  const profileImageSource = user.profileImageUrl 
    ? { uri: `${API_URL}${user.profileImageUrl}` } 
    : require('@/assets/images/default-pfp.png');

  return (
    <StyledView style={styles.container}>
       <TouchableOpacity onPress={handlePickImage}>
        <Image 
          source={profileImageSource}
          style={styles.profileImage} 
        />
        <View style={styles.cameraIconContainer}>
            <Ionicons name="camera-outline" size={20} color="#121212" />
        </View>
       </TouchableOpacity>
       
       <StyledText type="title" style={styles.username}>{user.username}</StyledText>
       
       <View style={styles.bioContainer}>
        {isEditingStatus ? (
          <>
            <TextInput
              style={styles.bioInput}
              value={statusText}
              onChangeText={setStatusText}
              autoFocus={true}
              maxLength={100}
              onBlur={handleSaveStatus} // Odak dışına çıkınca da kaydeder
            />
            <TouchableOpacity style={styles.saveStatusButton} onPress={handleSaveStatus}>
              <StyledText style={{color: 'white'}}>Kaydet</StyledText>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.bioTextContainer} onPress={() => setIsEditingStatus(true)}>
            <StyledText style={styles.bioText}>"{statusText}"</StyledText>
            <Ionicons name="pencil-outline" size={16} color="gray" style={{marginLeft: 8}}/>
          </TouchableOpacity>
        )}
       </View>


    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 40, backgroundColor: '#121212' },
    profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#333' },
    cameraIconContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: 'white',
      borderRadius: 15,
      padding: 5,
    },
    username: { marginTop: 16, color: 'white' },
    bioContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        width: '90%',
        minHeight: 80,
        justifyContent: 'center'
    },
    bioTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    bioText: {
      color: 'rgba(255,255,255,0.8)',
      fontStyle: 'italic',
      textAlign: 'center',
    },
    bioInput: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    saveStatusButton: {
      alignSelf: 'flex-end',
      marginTop: 8,
      backgroundColor: '#007AFF',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
});