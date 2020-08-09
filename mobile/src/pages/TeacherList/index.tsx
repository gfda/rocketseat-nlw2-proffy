import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import PageHeader from '../../components/PageHeaders';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import { TextInput, BorderlessButton, RectButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
import { useFocusEffect } from '@react-navigation/native';

function TeacherList(){

    const [teachers, setTeachers] = useState([ ]);
    const [favorites, setFavorites] = useState<number[]>([ ]);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [subject, setSubject] = useState('');
    const [week_day, setWeekDay] = useState('');
    const [time, setTime] = useState('');

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response){
                const favoritedTeachers = JSON.parse(response);
                const favoritedTeachersIds = favoritedTeachers.map((teacher: Teacher) => {
                    return teacher.id;
                });
                setFavorites(JSON.parse(response));
            }
        });
    }

    async function handleFilterSubmit(){

        loadFavorites();
        const response = await api.get('classes', {
            params: {
            subject,
            week_day,
            time,
            }
        });

        setIsFiltersVisible(false);
        setTeachers(response.data);
    }

    useFocusEffect(() =>{
        loadFavorites();
    });

    function handleToggleFiltersVisible() {
        setIsFiltersVisible(!isFiltersVisible);
    }

    return(
        <View style={styles.container}>
            <PageHeader 
                title="Proffys disponíveis"
                headerRight={(
                    <BorderlessButton onPress={handleToggleFiltersVisible}>
                        <Feather name="filter" size={20} color="#FFF" />
                    </BorderlessButton>
                )}
            >
                
                { isFiltersVisible && ( 
                    <View style={styles.searchForm}>
                        <Text style={styles.label}>Matéria</Text>
                        <TextInput 
                            style={styles.input}
                            value={subject}
                            onChangeText={text => setSubject(text)}
                            placeholder="Escolha uma matéria"
                            placeholderTextColor="#C1BCCC"
                        />
                        <View style={styles.inputGroup}>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Dia da semana</Text>
                                <TextInput 
                                style={styles.input}
                                value={week_day}
                                onChangeText={text => setWeekDay(text)}
                                placeholder="Escolha um dia"
                                placeholderTextColor="#C1BCCC"
                                />
                            </View>
                            <View style={styles.inputBlock}>
                                <Text style={styles.label}>Horário</Text>
                                <TextInput 
                                style={styles.input}
                                value={time}
                                onChangeText={text => setTime(text)}
                                placeholder="Escolha um horário"
                                placeholderTextColor="#C1BCCC"
                                />
                            </View>  
                        </View>
                        <RectButton onPress={handleFilterSubmit} style={styles.submitButton}>
                            <Text style={styles.submitButtonText}>Filtrar</Text>
                        </RectButton>
                    </View>
                )}
            </PageHeader>
            
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
            {teachers.map((teacher: Teacher) => {
                return (
                    <TeacherItem 
                      key={teacher.id}
                      favorited={favorites.includes(teacher.id)} 
                      teacher={teacher} 
                    />
                )
            })}
            </ScrollView>
        </View>
    );
}

export default TeacherList;