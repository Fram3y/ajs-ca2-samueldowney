import { Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import StoreItem from '@/components/StoreItem';
import { StoreTypeID } from '@/types';
import { Link } from 'expo-router';

export default function Tab() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`)
            .then(res => {
                console.log(res.data);
                setStores(res.data)
            })
            .catch(e => {
                console.log(e);
            });
    }, []);

    if (setStores.length === 0) return <Text>No Stores Found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={stores}
                    renderItem={({ item }) => <StoreItem store={item} />}
                    keyExtractor={(store: StoreTypeID) => store._id}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

});