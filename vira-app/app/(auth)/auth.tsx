import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function AuthScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const { signIn, signUp } = useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleAuth = async () => {
    if (!username || !password) {
      Alert.alert('Hata', 'Kullanıcı adı ve şifre boş bırakılamaz.');
      return;
    }

    try {
      if (isLogin) {
        await signIn({ username, password });
      } else {
        await signUp({ username, password });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Bir şeyler ters gitti.";
      Alert.alert('Hata', errorMessage);
    }
  };

  return (
    <StyledView style={styles.container}>
      <View style={styles.content}>
        <StyledText type="title" style={styles.title}>{isLogin ? "Kalene Geri Dön" : "Yeni Bir Kale İnşa Et"}</StyledText>
        
        {/* --- KULLANICI ADI ALANI DA ARTIK SARMALAYICI BİR VIEW KULLANIYOR --- */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Kullanıcı Adı" 
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none" 
            placeholderTextColor="gray" 
          />
        </View>

        {/* --- ŞİFRE ALANI --- */}
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput} 
            placeholder="Şifre" 
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry={!isPasswordVisible}
            placeholderTextColor="gray"
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Ionicons name={isPasswordVisible ? "eye-outline" : "eye-off-outline"} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        
        <StyledButton title={isLogin ? "Giriş Yap" : "İnşa Et"} onPress={handleAuth} style={styles.button} />
        
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
          <StyledText style={styles.toggleText}>
            {isLogin ? "Yeni bir kale mi inşa edeceksin? Kayıt ol." : "Zaten bir kalen mi var? Giriş yap."}
          </StyledText>
        </TouchableOpacity>
      </View>
    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#121212' },
    content: { flex: 1, justifyContent: 'center' },
    title: { textAlign: 'center', marginBottom: 24, color: 'white' },
    button: { width: '100%', marginTop: 10 },
    toggleText: { textAlign: 'center', marginTop: 20, color: '#0a7ea4' },
    
    // --- STİLLER BİRLEŞTİRİLDİ VE DÜZELTİLDİ ---
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 14, // Dikey boşluk eklendi
    },
    textInput: {
        flex: 1,
        color: 'white',
        fontSize: 16,
    },
    eyeIcon: {
        paddingLeft: 10, // İkon ile yazı arasına boşluk koyar
    }
});