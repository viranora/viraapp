import { StyledButton } from '@/components/StyledButton';
import { StyledText } from '@/components/StyledText';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';

const dialog = [
  "...selam.", "Biri geldi sandım.", "Sensin galiba.", "Ben Vira.",
  "Yeni biriyle tanışmak... tuhaf bir his.",
  "Ama seninle tanışmak güzel.",
  "Burası güvenli bir yer.",
  "Kimse seni rahatsız edemez.",
  "Kimse seni yargılayamaz.",
  "Burada konuşmak zorunda değilsin.", "Etkileyici olmak zorunda değilsin.", "Enerjik olmak zorunda değilsin.",
  "Bazen sadece... var olmak yeterlidir.",
  "Ben buradayım. Seni duyuyorum. Sessizliğini bile."
];

export default function OnboardingScreen() {
  const [gosterilenMetin, setGosterilenMetin] = useState('');
  const [metinIndex, setMetinIndex] = useState(0);
  const [dialogBitti, setDialogBitti] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (metinIndex >= dialog.length) {
      setDialogBitti(true);
      setIsTyping(false);
      return;
    }

    const hedefMetin = dialog[metinIndex];
    let currentIndex = 0;
    setGosterilenMetin('');
    setIsTyping(true);

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    intervalRef.current = setInterval(() => {
      if (currentIndex < hedefMetin.length) {
        currentIndex++;
        setGosterilenMetin(hedefMetin.substring(0, currentIndex));
      } else {
        setIsTyping(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
        timeoutRef.current = setTimeout(() => {
          setMetinIndex(index => index + 1);
        }, 2000);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [metinIndex]);

  const handleScreenTap = () => {
    if (isTyping) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setGosterilenMetin(dialog[metinIndex]);
      setIsTyping(false);
      timeoutRef.current = setTimeout(() => {
        setMetinIndex(index => index + 1);
      }, 2000);
    } else if (!dialogBitti) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setMetinIndex(index => index + 1);
    }
  };

  const renderChoices = () => (
    <View style={styles.choicesContainer}>
      <StyledText style={styles.text}>
        ...istersen tanışabiliriz. Bir kale inşa edebiliriz, sadece ikimizin bildiği.
      </StyledText>
      <StyledButton 
        title="Tanışalım" 
        onPress={() => router.push('/(auth)/auth')}
        style={{ width: '100%', marginTop: 20 }} 
      />
    </View>
  );

  return (
    <Pressable onPress={handleScreenTap} style={styles.container}>
      <StatusBar barStyle="light-content" />
      {dialogBitti ? renderChoices() : <StyledText style={styles.text}>{gosterilenMetin}</StyledText>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 24,
    textAlign: 'center',
  },
  choicesContainer: {
    width: '100%',
    alignItems: 'center',
  }
});