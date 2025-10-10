import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from './StyledText';

// Sunucu adresini buraya ekliyoruz
const API_URL = 'http://192.168.1.103:4000';

export function Header() {
  const [menuVisible, setMenuVisible] = React.useState(false);
  // Artık sadece signOut'u değil, 'user' bilgisini de alıyoruz
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    setMenuVisible(false);
    Alert.alert( "Kaleyi Terk Et", "Çıkış yapmak istediğine emin misin?",
      [
        { text: "Hayır", style: "cancel" },
        { text: "Evet", onPress: () => signOut() }
      ]
    );
  };

  // Profil resmini dinamik olarak belirliyoruz
  // Eğer kullanıcının profil resmi varsa onu, yoksa varsayılanı göster
  const profileImageSource = user?.profileImageUrl 
    ? { uri: `${API_URL}${user.profileImageUrl}` } 
    : require('@/assets/images/default-pfp.png');

  return (
    <View style={styles.headerContainer}>
      {/* Sol tarafı boş bırakarak ikonu sağa yaslıyoruz */}
      <View /> 
      
      <TouchableOpacity onPress={() => setMenuVisible(true)}>
        <Image
          source={profileImageSource} // source artık dinamik
          style={styles.profileImage}
        />
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/profile'); }}>
              <Ionicons name="person-outline" size={20} color="white" />
              <StyledText style={styles.menuText}>Profilim</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/settings'); }}>
              <Ionicons name="settings-outline" size={20} color="white" />
              <StyledText style={styles.menuText}>Ayarlar</StyledText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <StyledText style={styles.menuText}>Çıkış Yap</StyledText>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#121212',
  },
  profileImage: { 
    width: 36, 
    height: 36, 
    borderRadius: 18,
    backgroundColor: '#333' // Resim yüklenirken görünecek arkaplan
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    alignItems: 'flex-end' 
  },
  menuContainer: {
    marginTop: 90,
    marginRight: 16,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 8,
    width: 180,
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 8 
  },
  menuText: { 
    color: 'white', 
    fontSize: 16, 
    marginLeft: 12 
  },
});