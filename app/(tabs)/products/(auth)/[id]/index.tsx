import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
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

    // Getting product by Id
    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setProduct(res.data))  // Using the response data to set the product
            .catch(err => console.error('Error fetching product:', err));   // Checking for errors
    }, [id, session]); // UseEffect will run again if the id or session data changes

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

                <View style={styles.buttonRow}>
                    {/* Delete Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    {/* Edit Button */}
                    <Link href={`/products/${product.data._id}/edit`}>
                        <TouchableOpacity
                            style={[styles.button, styles.goBackButton]}
                        >
                            <Text style={styles.goBackButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </Link>

                    {/* Go Back Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.goBackButton]}
                        onPress={handleGoBack}
                    >
                        <Text style={styles.goBackButtonText}>Go Back</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
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
    button: {
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    goBackButtonText: {
        color: "#65558F",
        fontWeight: "bold",
        textAlign: "center",
    },
    goBackButton: {
        backgroundColor: "#E9E1FF",
        borderWidth: 2,
        borderColor: "#65558F",
    },
    deleteButton: {
        backgroundColor: "#65558F",
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 16,
    },
});