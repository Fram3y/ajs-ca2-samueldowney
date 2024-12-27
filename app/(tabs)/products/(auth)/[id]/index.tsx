import { Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductType } from '@/types';
import axios from 'axios';

export default function Tab() {
    const [product, setProduct] = useState<ProductType | null>(null);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setProduct(res.data))
            .catch(err => console.error('Error fetching product:', err));
    }, [id, session]);

    const handleDelete = async () => {
        try {
            const response = await axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`,
                { isDeleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.isDeleted !== undefined) {
                router.push('/products');
            } else {
                console.error('Failed to update product:', response.data.message || 'No success flag');
            }
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleGoBack = () => {
        router.push('/products');
    };

    if (!product || !product.data) return <Text style={styles.loadingText}>Store not found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.storeName}>{product.data.name}</Text>
                <Text style={styles.storeDescription}>{product.data.description}</Text>
                <Text style={styles.storePrice}>${product.data.price}</Text>

                <Link href={`/products/${product.data._id}/edit`}>
                    <Button title="Edit Store" color="blue" />
                </Link>

                <Button
                    title="Delete"
                    color="#D32F2F"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                />

                <Button
                    title="Go Back"
                    onPress={handleGoBack}
                    style={styles.goBackButton}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    storeName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    storeDescription: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    storePrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#D32F2F',
        width: '80%',
        borderRadius: 8,
    },
    goBackButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50', // Green color for "Go Back" button
        width: '80%',  // Make the button a bit wider
        borderRadius: 8,
    },
});