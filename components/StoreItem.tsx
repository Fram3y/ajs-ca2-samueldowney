import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { StoreTypeID, SupplierTypeID } from '@/types';

interface MyProps {
    store: StoreTypeID;
    suppliers: SupplierTypeID[];
};

export default function StoreItem({ store, suppliers }: MyProps) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                {/* Store Name */}
                <Link href={`/stores/${store._id}`}>
                    <Text style={styles.storeName}>{store.name}</Text>
                </Link>

                {/* Store Address */}
                <Text style={styles.storeAddress}>{store.address}</Text>

                {/* Suppliers List */}
                <Text style={styles.infoTitle}>Suppliers:</Text>
                {suppliers.length > 0 ? (
                    suppliers.map((supplier) => (
                        <Text key={supplier._id} style={styles.infoText}>
                            {supplier.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noData}>No suppliers available</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF7FF", // Matches SupplierItem's background color
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
    storeName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    storeAddress: {
        fontSize: 14,
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