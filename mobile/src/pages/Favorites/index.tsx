import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import PageHeader from '../../components/PageHeaders';
import TeacherItem, { Teacher } from '../../components/TeacherItem';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';

function Favorites(){

    const [favorites, setFavorites] = useState([ ]);

    function loadFavorites() {
        AsyncStorage.getItem('favorites').then(response => {
            if (response){
                const favoritedTeachers = JSON.parse(response);
                setFavorites(favoritedTeachers);
            }
        });
    }
    
    useFocusEffect(
        React.useCallback(() => {
          loadFavorites();
        }, [])
    )

    return(
        <View style={styles.container}>
            <PageHeader title="Proffys favorites" />
            <ScrollView
                style={styles.teacherList}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 16
                }}
            >
             {favorites.map((teacher: Teacher) => {
                 return (
                    <TeacherItem
                        key={teacher.id}
                        teacher={teacher}
                        favorited
                    />
                 )
             })}
            </ScrollView>
        </View>
    );
}

export default Favorites;