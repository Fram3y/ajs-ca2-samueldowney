import { Text, StyleSheet, FlatList, Button } from 'react-native';
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
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
                headers: {
                    Authorization: `Bearer ${session}`
                }
            })
            .then(res => setProducts(res.data))
            .catch(err => console.log('Error fetching products:', err));
    }, []);

    if (products.length === 0) return <Text>No Products Found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Link href="/products/create">
                    <Button title="Create New Product" color="blue" />
                </Link>

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
});