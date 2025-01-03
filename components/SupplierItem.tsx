import { View, Text, StyleSheet } from "react-native";
import { Link } from 'expo-router';
import { SupplierTypeID, StoreTypeID, ProductTypeID } from '@/types';

interface MyProps {
    supplier: SupplierTypeID; // Use SupplierTypeID instead of SupplierType
    stores: StoreTypeID[];
    products: ProductTypeID[];
}

export default function SupplierItem({ supplier, stores, products }: MyProps) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>

                {/* Supplier Name */}
                <Link href={`/suppliers/${supplier._id}`}>
                    <Text style={styles.supplierName}>{supplier.name}</Text>
                </Link>

                {/* Store List */}
                <Text style={styles.infoTitle}>Stores:</Text>
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
                <Text style={styles.infoTitle}>Products:</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF7FF",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    supplierName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        marginTop: 4,
    },
    infoText: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4,
    },
    noData: {
        fontSize: 14,
        color: "#999",
        fontStyle: "italic",
        marginTop: 4,
    },
});