import { Text, StyleSheet, FlatList, Button, View } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StoreTypeID, SupplierTypeID } from '@/types'; // Assuming SupplierType is defined somewhere
import StoreItem from '@/components/StoreItem';

export default function Tab() {
    const [stores, setStores] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`)
            .then(res => {
                setStores(res.data);
            })
            .catch(e => {
                console.log('Error fetching stores:', e);
            });

        axios.get('https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers')
            .then(res => {
                setSuppliers(res.data);
            })
            .catch(e => {
                console.log('Error fetching suppliers:', e);
            });
    }, []);

    const getSuppliersForStore = (supplierIds: string[]) => {
        return suppliers.filter(supplier => supplierIds.includes(supplier._id));
    };

    if (stores.length === 0) return <Text>No Stores Found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Link href="/stores/create">
                    <Button title="Create New Store" color="blue" />
                </Link>

                <FlatList
                    data={stores}
                    renderItem={({ item }) => {
                        // Get suppliers for this store
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
});
