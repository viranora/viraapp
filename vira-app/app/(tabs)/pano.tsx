import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PanoScreen() {
  return (
    <StyledView style={styles.container}>
      <ScrollView>
        <StyledText type="title" style={styles.title}>Pano</StyledText>

        <View style={styles.cardContainer}>
          <TouchableOpacity style={[styles.card, styles.cardLarge]} onPress={() => router.push('/journal')}>
            <StyledText style={styles.cardTitle}>Günlük</StyledText>
            <StyledText style={styles.cardSubtitle}>Bugün içini dök.</StyledText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.card, styles.cardLarge]} onPress={() => router.push('/motivation')}>
            <StyledText style={styles.cardTitle}>İyi Hisset</StyledText>
            <StyledText style={styles.cardSubtitle}>Rastgele bir kart çek.</StyledText>
          </TouchableOpacity>
        </View>

        <View style={styles.quoteCard}>
           <StyledText style={styles.quoteText}>"En karanlık gece bile sona erer ve güneş tekrar doğar."</StyledText>
        </View>
      </ScrollView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },
  title: { paddingHorizontal: 16, marginBottom: 16, },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#2a2a2a',
    justifyContent: 'flex-end',
  },
  cardLarge: {
    width: '48%',
    height: 220,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  quoteCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: 20,
  },
  quoteText: {
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});