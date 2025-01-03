import { Text, StyleSheet, FlatList, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { SupplierTypeID, StoreTypeID, ProductTypeID } from '@/types';
import SupplierItem from '@/components/SupplierItem';
import { useSession } from '@/contexts/AuthContext';

export default function Tab() {
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [products, setProducts] = useState<ProductTypeID[]>([]);

    const { session } = useSession();

    useEffect(() => {
        // Fetch Suppliers
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setSuppliers(res.data)) 
            .catch(err => console.error(err));

        // Fetch Stores
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setStores(res.data))
            .catch(err => console.error(err));

        // Fetch Products
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, [session]);

    if (suppliers.length === 0) return <Text>No suppliers found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Link href="/suppliers/create">
                    <Button title="Create New Supplier" color="blue" />
                </Link>

                <FlatList
                    data={suppliers}
                    renderItem={({ item }) => {
                        const storeList = stores.filter(store =>
                            store.supplier_id.includes(item._id) 
                        );

                        const productList = products.filter(product =>
                            item.product_id.includes(product._id) 
                        );

                        return (
                            <SupplierItem
                                supplier={item}
                                stores={storeList}
                                products={productList}
                            />
                        );
                    }}
                    keyExtractor={(supplier) => supplier._id} // This works as _id exists in SupplierTypeID
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
    noData: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
    },
});