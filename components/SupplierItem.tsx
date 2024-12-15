import { View, Text, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { SupplierType, StoreTypeID, ProductTypeID } from '@/types';

interface MyProps {
    supplier: SupplierType;
    stores: StoreTypeID[];
    products: ProductTypeID[];
}

export default function SupplierItem({ supplier, stores, products }: MyProps) {
    return (
        <View style={styles.item}>
            {/* Supplier Name */}
            <Link href={`/suppliers/${supplier._id}`}>
                <Text style={styles.supplierName}>{supplier.name}</Text>
            </Link>

            {/* Store List */}
            <Text style={styles.sectionTitle}>Stores:</Text>
            {stores.length > 0 ? (
                stores.map((store) => (
                    <Text key={store._id} style={styles.infoText}>
                        {store.name}
                    </Text>
                ))
            ) : (
                <Text style={styles.noData}>No stores available</Text>
            )}

            {/* Product List */}
            <Text style={styles.sectionTitle}>Products:</Text>
            {products.length > 0 ? (
                products.map((product) => (
                    <Text key={product._id} style={styles.infoText}>
                        {product.name}
                    </Text>
                ))
            ) : (
                <Text style={styles.noData}>No products available</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#eaeaea',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    supplierName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
    },
    infoText: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
    noData: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
        fontStyle: 'italic',
    },
});