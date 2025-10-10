import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const motivationCards = [
  "Küçük adımlar da ilerlemektir.",
  "Bugün dinlenmek, yarın daha güçlü olmak demektir.",
  "Hissettiğin her duygu geçerli ve geçici.",
  "En karanlık gece bile sona erer ve güneş tekrar doğar.",
  "Mükemmel olmak zorunda değilsin, sadece denemek yeterli.",
  "Kendine karşı nazik ol, en çok buna ihtiyacın var.",
  "Yalnız değilsin, sadece öyle hissediyorsun."
];

export default function MotivationScreen() {
  const [cardIndex, setCardIndex] = useState(0);

  const handleNewCard = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * motivationCards.length);
    } while (newIndex === cardIndex); // Aynı kartın tekrar gelmesini engelle
    setCardIndex(newIndex);
  };

  return (
    <StyledView style={styles.container}>
       <StyledText type="title">Günün Kartı</StyledText>
       <View style={styles.card}>
        <StyledText style={styles.cardText}>
          "{motivationCards[cardIndex]}"
        </StyledText>
       </View>
       <StyledButton title="Yeni Kart Çek" style={{marginTop: 30}} onPress={handleNewCard} />
    </StyledView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#121212',
      padding: 20,
    },
    card: {
      width: '100%',
      height: 250,
      backgroundColor: '#2a2a2a',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      marginTop: 20,
    },
    cardText: {
      fontSize: 22,
      textAlign: 'center',
      fontStyle: 'italic',
      color: 'white'
    }
});