import { Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StoreType, SupplierType } from '@/types';
import useAPI from '@/hooks/useAPI';
import { useRouter } from 'expo-router';
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

    const { loading } = useAPI();

    useEffect(() => {
        setIsLoading(true);

        axios.get(
            `https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(response => {
                console.log(response.data)
                setStore(response.data);
            })
            .catch(error => {
                console.error('Error fetching store:', error);
            });


        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(supRes => {
                console.log(supRes.data)
                setSuppliers(supRes.data);
            })
            .catch(e => {
                console.error('Error fetching store:', e);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [id, session]);

    useEffect(() => {
        if (store && store.supplier_id && suppliers.length > 0) {
            console.log('Filtering suppliers...');
            // Log the supplier_id array from the store and the suppliers data
            console.log('Store supplier_ids:', store.supplier_id);
            console.log('All suppliers:', suppliers);

            // Ensure supplier_id is an array and filter based on matching _id
            const filtered = suppliers.filter((supplier: SupplierType) =>
                store.supplier_id.includes(supplier._id.toString()) // Ensure we compare strings
            );

            console.log('Filtered suppliers:', filtered); // Log filtered suppliers
            setFilteredSuppliers(filtered);
        }
    }, [store, suppliers]); // Re-run when store or suppliers change

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

    if (!store) return <Text>Store not found</Text>
    if (loading === true) return <Text>Loading API...</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text>{store.data.name}</Text>
                <Text>{store.data.address}</Text>

                <Text style={styles.suppliersTitle}>Suppliers:</Text>
                {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map(supplier => (
                        <Text key={supplier._id} style={styles.supplier}>
                            {supplier.name}
                        </Text>
                    ))
                ) : (
                    <Text>No suppliers available</Text>
                )}

                <Link href={`/stores/${store.data._id}/edit`}>
                    <Button title="Edit Store" color="blue" />
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    suppliersTitle: {
        fontSize: 18,
        marginTop: 20,
        fontWeight: 'bold',
    },
    supplier: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
    },
});