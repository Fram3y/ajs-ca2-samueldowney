import { Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType } from '@/types';
import useAPI from '@/hooks/useAPI';

export default function Tab() {
    const [store, setStore] = useState<StoreType | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useLocalSearchParams();
    const { session } = useSession();

    const { getRequest, loading } = useAPI();

    useEffect(() => {
        setIsLoading(true);

        getRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }, (data) => {
            setStore(data as StoreType);
        });
    }, [id]);

    if (!store) return <Text>Store not found</Text>
    if(loading === true) return <Text>Loading API...</Text>

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