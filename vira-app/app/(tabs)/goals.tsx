import { StyledText } from '@/components/StyledText';
import { StyledView } from '@/components/StyledView';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const API_URL = 'http://192.168.1.103:4000'; 

type Goal = {
  _id: string;
  title: string;
  category: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
};

export default function GoalsScreen() {
  const { token, user, updateUserCategories } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const categories = user?.categories || [];
  
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Tümü');
  const [activeSort, setActiveSort] = useState<'yeni' | 'eski'>('yeni');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Genel');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { if (token) fetchGoals(); }, [token]);

  const fetchGoals = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/goals/${token}`);
      setGoals(response.data);
    } catch (error) { console.error("Hedefler getirilemedi:", error); }
  };

  const handleDelete = (goalId: string) => {
    Alert.alert("Sil", "Bu hedefi silmek istediğine emin misin?", [
      { text: "Hayır" },
      { text: "Evet", onPress: async () => {
        try {
          await axios.delete(`${API_URL}/api/goals/delete/${goalId}`);
          fetchGoals();
        } catch (error) { Alert.alert("Hata", "Hedef silinemedi."); }
      }}
    ]);
  };

  const handleAddGoal = async () => {
    if (!title.trim() || !token) return;
    try {
      await axios.post(`${API_URL}/api/goals/add`, {
        userId: token, title, description, category: selectedCategory, deadline,
      });
      setModalVisible(false);
      fetchGoals();
      setTitle(''); setDescription(''); setSelectedCategory('Genel');
    } catch (error) { Alert.alert("Hata", "Hedef eklenemedi."); }
  };
  
  const toggleComplete = async (goal: Goal) => {
    try {
      await axios.patch(`${API_URL}/api/goals/update/${goal._id}`, {
        completed: !goal.completed,
      });
      fetchGoals();
    } catch (error) { Alert.alert("Hata", "Hedef güncellenemedi."); }
  };

  const handleAddNewCategory = () => {
    setNewCategoryName(''); 
    setCategoryModalVisible(true);
  };

  const handleSaveNewCategory = async () => {
    if (newCategoryName && newCategoryName.trim()) {
      const trimmedName = newCategoryName.trim();
      if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
        Alert.alert("Hata", "Bu kategori zaten mevcut.");
      } else {
        const newCategories = [...categories, trimmedName];
        try {
          await updateUserCategories(newCategories);
          setCategoryModalVisible(false);
        } catch (error) { Alert.alert("Hata", "Kategori eklenemedi."); }
      }
    }
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    Alert.alert("Kategoriyi Sil", `'${categoryToDelete}' kategorisini silmek istediğine emin misin?`,
      [{ text: "Hayır" },
       { text: "Evet",
         onPress: async () => {
           const newCategories = categories.filter(cat => cat !== categoryToDelete);
           try {
             await updateUserCategories(newCategories); 
             if (selectedCategory === categoryToDelete) setSelectedCategory('Genel');
           } catch (error) { Alert.alert("Hata", "Kategori silinemedi."); }
         },
       }],
    );
  };

  const displayedGoals = useMemo(() => {
    let filtered = [...goals];

    if (activeCategoryFilter !== 'Tümü') {
      filtered = filtered.filter(goal => goal.category === activeCategoryFilter);
    }

    filtered.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
      if (activeSort === 'yeni') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    return filtered;
  }, [goals, activeCategoryFilter, activeSort]);

  return (
    <StyledView style={styles.container}>
      <FlatList
        data={displayedGoals}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleComplete(item)}>
              <Ionicons name={item.completed ? "checkbox" : "square-outline"} size={24} color={item.completed ? "#50C878" : "gray"} />
            </TouchableOpacity>
            <View style={styles.goalDetails}>
              <StyledText style={[styles.goalText, item.completed && styles.completedText]}>{item.title}</StyledText>
              <View style={styles.tagsContainer}>
                <View style={styles.categoryTag}><StyledText style={styles.tagText}>{item.category}</StyledText></View>
                {item.deadline && <StyledText style={styles.dateTag}>{new Date(item.deadline).toLocaleDateString('tr-TR')}</StyledText>}
              </View>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item._id)}>
              <Ionicons name="trash-outline" size={22} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        style={styles.listStyle}
        ListHeaderComponent={(
          <>
            <StyledText type="title" style={styles.title}>Hedefler</StyledText>
            <View style={styles.controlsContainer}>
              <StyledText style={styles.label}>Filtrele:</StyledText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['Tümü', 'Genel', ...categories].map(cat => (
                  <TouchableOpacity 
                    key={cat} 
                    style={[styles.filterChip, activeCategoryFilter === cat && styles.activeFilterChip]}
                    onPress={() => setActiveCategoryFilter(cat)}
                  >
                    <StyledText style={activeCategoryFilter === cat ? styles.activeFilterText : styles.filterText}>{cat}</StyledText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.sortContainer}>
                <StyledText style={styles.label}>Sırala:</StyledText>
                <TouchableOpacity onPress={() => setActiveSort('yeni')} style={[styles.sortButton, activeSort === 'yeni' && styles.activeSortButton]}>
                   <StyledText style={activeSort === 'yeni' ? styles.activeSortText : styles.sortText}>Yeniden Eskiye</StyledText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveSort('eski')} style={[styles.sortButton, activeSort === 'eski' && styles.activeSortButton]}>
                   <StyledText style={activeSort === 'eski' ? styles.activeSortText : styles.sortText}>Eskiden Yeniye</StyledText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={<StyledText style={styles.emptyText}>Henüz bir hedef eklemedin.</StyledText>}
      />
      
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent}>
            <ScrollView>
              <StyledText type="title" style={{marginBottom: 20}}>Yeni Hedef</StyledText>
              <StyledText style={styles.label}>Hedef Adı*</StyledText>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Örn: 10 dakika yürüyüş yap" placeholderTextColor="gray" />
              <StyledText style={styles.label}>Açıklama</StyledText>
              <TextInput style={[styles.input, {height: 100}]} value={description} onChangeText={setDescription} multiline placeholder="Detaylar..." placeholderTextColor="gray"/>
              
              <StyledText style={styles.label}>Kategori</StyledText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
                {['Genel', ...categories].map(cat => (
                  <TouchableOpacity 
                    key={cat} style={[styles.categoryChip, selectedCategory === cat && styles.selectedCategoryChip]} 
                    onPress={() => setSelectedCategory(cat)}>
                    <StyledText style={selectedCategory === cat ? styles.selectedCategoryText : styles.categoryText}>{cat}</StyledText>
                    {cat !== 'Genel' && (
                      <TouchableOpacity style={styles.deleteChipIcon} onPress={() => handleDeleteCategory(cat)}>
                        <Ionicons name="close-circle" size={18} color={selectedCategory === cat ? '#1e1e1e' : '#555'} />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.addCategoryChip} onPress={handleAddNewCategory}>
                    <Ionicons name="add" size={18} color="white" />
                    <StyledText style={styles.categoryText}> Yeni Ekle</StyledText>
                </TouchableOpacity>
              </ScrollView>
              
              <StyledText style={styles.label}>Tarih</StyledText>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                <StyledText style={{color: 'white'}}>{deadline.toLocaleDateString('tr-TR')}</StyledText>
              </TouchableOpacity>
              {showDatePicker && (<DateTimePicker value={deadline} mode="date" display="default"
                  onChange={(event, selectedDate) => { setShowDatePicker(false); setDeadline(selectedDate || deadline); }}/>)}
              <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}><StyledText style={styles.saveButtonText}>Ekle</StyledText></TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade" transparent={true} visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}>
        <Pressable style={styles.smallModalOverlay} onPress={() => setCategoryModalVisible(false)}>
          <Pressable style={styles.smallModalContent}>
            <StyledText type="title" style={{fontSize: 20, marginBottom: 16}}>Yeni Kategori Ekle</StyledText>
            <TextInput
              style={styles.input} placeholder="Kategori Adı (Örn: Spor)"
              placeholderTextColor="gray" value={newCategoryName}
              onChangeText={setNewCategoryName}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNewCategory}>
              <StyledText style={styles.saveButtonText}>Ekle</StyledText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#121212" />
      </TouchableOpacity>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  title: { paddingHorizontal: 16, marginBottom: 16, color: 'white' },
  listStyle: { flex: 1, width: '100%', paddingTop: 20 },
  goalItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', alignItems: 'center' },
  goalDetails: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  goalText: { fontSize: 16, color: 'white', fontWeight: 'bold' },
  tagsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  categoryTag: { backgroundColor: '#333', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginRight: 8 },
  tagText: { color: '#ccc', fontSize: 12 },
  dateTag: { color: 'gray', fontSize: 12 },
  completedText: { textDecorationLine: 'line-through', color: 'gray' },
  controlsContainer: { paddingHorizontal: 16, marginBottom: 20 },
  label: { color: 'gray', fontSize: 14, marginBottom: 8, marginTop: 16 },
  filterChip: { backgroundColor: '#2a2a2a', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 16, marginRight: 8 },
  activeFilterChip: { backgroundColor: 'white' },
  filterText: { color: 'white' },
  activeFilterText: { color: '#121212', fontWeight: 'bold' },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  sortButton: { backgroundColor: '#2a2a2a', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8, marginRight: 8 },
  activeSortButton: { backgroundColor: '#007AFF' },
  sortText: { color: 'white' },
  activeSortText: { color: 'white', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: 'gray', marginTop: 50 },
  addButton: { position: 'absolute', bottom: 30, right: 30, backgroundColor: 'white', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' },
  modalContent: { backgroundColor: '#1e1e1e', padding: 22, borderTopRightRadius: 20, borderTopLeftRadius: 20, maxHeight: '85%' },
  input: { backgroundColor: '#2a2a2a', color: 'white', padding: 14, borderRadius: 8, fontSize: 16, textAlignVertical: 'top' },
  datePickerButton: { backgroundColor: '#2a2a2a', padding: 14, borderRadius: 8 },
  categoryScrollView: { flexDirection: 'row', paddingVertical: 5 },
  categoryChip: { borderWidth: 1, borderColor: '#555', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
  selectedCategoryChip: { backgroundColor: 'white', borderColor: 'white' },
  categoryText: { color: 'white' },
  selectedCategoryText: { color: '#121212', fontWeight: 'bold' },
  deleteChipIcon: { marginLeft: 6, padding: 2 },
  addCategoryChip: { borderWidth: 1, borderColor: '#555', borderStyle: 'dashed', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 14, marginRight: 8, flexDirection: 'row', alignItems: 'center' },
  saveButton: { backgroundColor: 'white', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: '#121212', fontWeight: 'bold', fontSize: 16 },
  smallModalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)'},
  smallModalContent: { backgroundColor: '#1e1e1e', padding: 22, borderRadius: 20, width: '80%'},
});