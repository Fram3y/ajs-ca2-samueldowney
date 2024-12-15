import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { SupplierType, SupplierTypeID } from '@/types';
import SupplierItem from '@/components/SupplierItem';
import { useSession } from '@/contexts/AuthContext';

export default function Tab() {
    const [suppliers, setSuppliers] = useState<SupplierType[]>([]);
    const [stores, setStores] = useState([]);   // Stores data
    const [products, setProducts] = useState([]); // Products data

    const { id } = useLocalSearchParams();
    const { session } = useSession();

    useEffect(() => {
        // Fetch Suppliers
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setSuppliers(res.data))
            .catch(e => console.log(e));

        // Fetch Stores
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setStores(res.data))
            .catch(e => console.log(e));

        // Fetch Products
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setProducts(res.data))
            .catch(e => console.log(e));
    }, []);

    if (suppliers.length === 0) return <Text>No suppliers found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={suppliers}
                    renderItem={({ item }) => {
                        const storeList = stores.filter(store =>
                            store.supplier_id.includes(item._id) // Match supplier's ID with stores
                        );

                        const productList = products.filter(product =>
                            item.product_id.includes(product._id) // Match supplier's product IDs
                        );

                        return (
                            <SupplierItem
                                supplier={item}
                                stores={storeList}
                                products={productList}
                            />
                        );
                    }}
                    keyExtractor={(supplier: SupplierTypeID) => supplier._id}
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