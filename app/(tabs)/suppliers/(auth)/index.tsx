import { Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
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
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`)
            .then(res => setSuppliers(res.data))
            .catch(err => console.error(`Error Fetching Suppliers`, err));

        // Fetch Stores
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`)
            .then(res => setStores(res.data))
            .catch(err => console.error(`Error Fetching Stores`, err));

        // Fetch Products
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
            headers: {Authorization: `Bearer ${session}`}
        })
            .then(res => setProducts(res.data))
            .catch(err => console.error(`Error Fetching Products`, err));
    }, []);

    if (suppliers.length === 0) return <Text>No Suppliers Found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

                {/* Create New Button */}
                <Link href="/suppliers/create">
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                    >
                        <Text style={styles.submitButtonText}>Create New</Text>
                    </TouchableOpacity>
                </Link>

                {/* Store Card Loop */}
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