import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StoreTypeID, SupplierTypeID } from '@/types';
import StoreItem from '@/components/StoreItem';

export default function Tab() {
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`)
            .then(res => setStores(res.data))
            .catch(err => console.error('Error fetching stores:', err));

        axios.get('https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers')
            .then(res => setSuppliers(res.data))
            .catch(err => console.error('Error fetching suppliers:', err));
    }, []);

    const getSuppliersForStore = (supplierIds: string[]) => {
        return suppliers.filter(supplier => supplierIds.includes(supplier._id));
    };

    if (stores.length === 0) return <Text>No Stores Found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

                {/* Create New Button */}
                <Link href="/stores/create">
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                    >
                        <Text style={styles.submitButtonText}>Create New</Text>
                    </TouchableOpacity>
                </Link>

                {/* Card Loop */}
                <FlatList
                    data={stores}
                    renderItem={({ item }) => {
                        const storeSuppliers = getSuppliersForStore(item.supplier_id); // Use supplier_id array from store
                        return <StoreItem store={item} suppliers={storeSuppliers} />;
                    }}
                    keyExtractor={(store: StoreTypeID) => store._id}
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
    },
    button: {
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: "#65558F",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
});
