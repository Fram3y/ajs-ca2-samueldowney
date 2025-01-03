import { useRouter, Link } from "expo-router";
import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { SupplierTypeID, ProductTypeID } from "@/types";
import axios from "axios";
import { Text, StyleSheet, Button } from "react-native";

export default function Tab() {
    const [supplier, setSupplier] = useState<SupplierTypeID | null>(null);
    const [products, setProducts] = useState<ProductTypeID[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductTypeID[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchSupplierAndProducts = async () => {
            setIsLoading(true);
            try {
                const [supplierRes, productsRes] = await Promise.all([
                    axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers/${id}`, {
                        headers: { Authorization: `Bearer ${session}` }
                    }),
                    axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
                        headers: { Authorization: `Bearer ${session}` }
                    }),
                ]);

                setSupplier(supplierRes.data);
                setProducts(productsRes.data);
            } catch (e) {
                console.error("Error fetching data:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSupplierAndProducts();
    }, [id, session]);

    useEffect(() => {
        if (supplier && supplier.data?.product_id.length > 0 && products.length > 0) {
            const filtered = products.filter(product =>
                supplier.data.product_id.includes(product._id.toString())
            );
            setFilteredProducts(filtered);
        }
    }, [supplier, products]);

    const handleDelete = async () => {
        setIsUpdating(true);

        try {
            const response = await axios.put(
                `https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers/${id}`,
                { isDeleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.isDeleted !== undefined) {
                router.push('/suppliers');
            } else {
                console.error('Failed to update supplier:', response.data.message || 'No success flag');
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleGoBack = () => {
        router.push('/suppliers');
    };

    if (isLoading) return <Text style={styles.loadingText}>Loading...</Text>;
    if (!supplier || !supplier.data) return <Text>Supplier not found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.supplierName}>{supplier.data.name}</Text>

                <Text style={styles.suppliersTitle}>Products:</Text>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <Text key={product._id} style={styles.product}>
                            {product.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noProducts}>No products available</Text>
                )}

                <Link href={`/suppliers/${supplier.data._id}/edit`}>
                    <Button title="Edit Supplier" color="blue" />
                </Link>

                <Button
                    title="Delete"
                    color="red"
                    onPress={handleDelete}
                    disabled={isUpdating}
                />

                <Button
                    title="Go Back"
                    onPress={handleGoBack}
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
    supplierName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    suppliersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    product: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    noProducts: {
        fontSize: 16,
        color: '#999',
        marginVertical: 5,
    },
});