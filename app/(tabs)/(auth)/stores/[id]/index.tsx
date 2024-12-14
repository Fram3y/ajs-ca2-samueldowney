import { Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType } from '@/types';
import useAPI from '@/hooks/useAPI';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function Tab() {
    const [store, setStore] = useState<StoreType | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    const { getRequest, putRequest, loading } = useAPI();

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

    const handleDelete = async () => {
        setIsUpdating(true);
    
        try {
            const response = await axios.put(
                `https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`,
                { isDeleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            // Log the full response data to inspect its structure
            console.log('API Response:', response.data);
    
            // Adjust the success check based on the actual response data
            if (response.data && response.data.isDeleted !== undefined) {
                // Assuming the response has a field 'isDeleted' to confirm the update
                router.push('/stores');
            } else {
                console.error('Failed to update store:', response.data.message || 'No success flag');
            }
        } catch (error) {
            console.error('Error updating store:', error);
        } finally {
            setIsUpdating(false);
        }
    };        

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

                <Button
                    title="Delete"
                    color="red"
                    onPress={handleDelete}
                    disabled={isUpdating}
                />

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