import { Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType, SupplierType } from '@/types';
import axios from 'axios';

export default function Tab() {
    const [store, setStore] = useState<StoreType | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        // Fetch Store Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
        .then(res => setStore(res.data))
        .catch(err => console.error('Error fetching store:', err));

        // Fetch Suppliers Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
        .then(res => setSuppliers(res.data))
        .catch(err => console.error('Error fetching suppliers:', err))
        .finally(() => setIsLoading(false));
    }, [id, session]);

    // Filter Suppliers based on store's supplier_id
    useEffect(() => {
        if (store && store.data?.supplier_id && suppliers.length > 0) {
            const filtered = suppliers.filter(supplier =>
                store.data.supplier_id.includes(supplier._id.toString()) // Ensure supplier._id is compared as a string
            );
            setFilteredSuppliers(filtered);
        }
    }, [store, suppliers]);

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

            if (response.data && response.data.isDeleted !== undefined) {
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

    // Navigate back to stores page
    const handleGoBack = () => {
        router.push('/stores');
    };

    // Ensure we display proper loading state if store data is not yet loaded
    if (!store || !store.data) return <Text style={styles.loadingText}>Store not found</Text>;
    if (isLoading) return <Text style={styles.loadingText}>Loading...</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Store Information */}
                <Text style={styles.storeName}>{store.data.name}</Text>
                <Text style={styles.storeAddress}>{store.data.address}</Text>

                {/* Suppliers Section */}
                <Text style={styles.suppliersTitle}>Suppliers:</Text>
                {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map(supplier => (
                        <Text key={supplier._id} style={styles.supplier}>
                            {supplier.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noSuppliers}>No suppliers available</Text>
                )}

                {/* Buttons */}
                <Link href={`/stores/${store.data._id}/edit`}>
                    <Button title="Edit Store" color="blue" />
                </Link>

                <Button
                    title="Delete"
                    color="red"
                    onPress={handleDelete}
                    disabled={isUpdating}
                />

                {/* Go Back Button */}
                <Button
                    title="Go Back"
                    onPress={handleGoBack}
                    style={styles.goBackButton}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    storeAddress: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    suppliersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    supplier: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    noSuppliers: {
        fontSize: 16,
        color: '#999',
        marginVertical: 5,
    },
    goBackButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',  // Green color for "Go Back" button
        width: '80%',  // Make the button a bit wider
    },
});