import { Text, StyleSheet, Button, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType, SupplierTypeID } from '@/types';
import axios from 'axios';

export default function Tab() {
    const [store, setStore] = useState<StoreType | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState<SupplierTypeID[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        setIsLoading(true);

        // Fetch Store Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setStore(res.data))
            .catch(err => console.error('Error fetching store:', err));

        // Fetch Suppliers Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`)
            .then(res => setSuppliers(res.data))
            .catch(err => console.error('Error fetching suppliers:', err))
            .finally(() => setIsLoading(false));
    }, [id]);

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
            console.error('Error deleting store:', error);
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

                <View style={styles.buttonRow}>
                    {/* Delete Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    {/* Edit Button */}
                    <Link href={`/stores/${store.data._id}/edit`}>
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