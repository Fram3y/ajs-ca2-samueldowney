import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { StoreTypeID, SupplierType } from '@/types';

interface MyProps {
    store: StoreTypeID;
    suppliers: SupplierType;
};

export default function StoreItem({ store, suppliers }: MyProps) {
    return (
        <View style={styles.item}>
            <Link href={`/stores/${store._id}`}>
                <Text style={styles.storeName}>{store.name}</Text>
            </Link>
            <Text style={styles.storeAddress}>{store.address}</Text>

            <Text style={styles.suppliersTitle}>Suppliers:</Text>
            {suppliers.length > 0 ? (
                suppliers.map((supplier) => (
                    <Text key={supplier._id} style={styles.supplier}>
                        {supplier.name}
                    </Text>
                ))
            ) : (
                <Text>No suppliers available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#eaeaea',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    storeName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    storeAddress: {
        fontSize: 14,
        color: '#555',
    },
    suppliersTitle: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
    },
    supplier: {
        fontSize: 14,
        color: '#333',
        marginTop: 5,
    },
});