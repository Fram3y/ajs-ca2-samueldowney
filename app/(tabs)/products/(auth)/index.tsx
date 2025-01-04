import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { ProductTypeID } from '@/types';
import ProductItem from '@/components/ProductItem';
import { useSession } from '@/contexts/AuthContext';

export default function Tab() {
    const [products, setProducts] = useState<ProductTypeID[]>([]);
    const { session } = useSession();

    useEffect(() => {
        // Fetch Products
        axios
            .get(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/products`)
            .then(res => setProducts(res.data))
            .catch(err => console.log('Error fetching products:', err));
    }, [products]);

    if (products.length === 0) return <Text>No Products Found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Create New Button */}
                <Link href="/products/create">
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                    >
                        <Text style={styles.submitButtonText}>Create New</Text>
                    </TouchableOpacity>
                </Link>

                {/* Product Card Loop */}
                <FlatList
                    data={products}
                    renderItem={({ item }) => <ProductItem product={item} />}
                    keyExtractor={(item: ProductTypeID) => item._id}
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