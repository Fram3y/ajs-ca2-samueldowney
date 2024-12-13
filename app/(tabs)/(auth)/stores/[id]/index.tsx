import { Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import axios from 'axios';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType } from '@/types';

export default function Tab() {
    const [store, setStore] = useState<StoreType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useLocalSearchParams();
    const { session } = useSession();

    useEffect(() => {
        setIsLoading(true);

        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => {
                setStore(res.data);
                console.log(res.data);
                setIsLoading(false);
            })
            .catch(e => {
                console.log(e);
                setIsLoading(false)
            })
    }, [id]);

    if (!store) return <Text>Store not found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text>{store.data.name}</Text>
                <Text>{store.data.address}</Text>
                <Link href={`/stores/${store.data._id}/edit`}>
                    <a>
                        <button>Edit Store</button>
                    </a>
                </Link>
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});