import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { EmployeeTypeID, StoreType, RoleType } from '@/types';

interface MyProps {
    employee: EmployeeTypeID;
    stores: StoreType;
    roles: RoleType;
};

export default function EmployeeItem({ employee, stores, roles }: MyProps) {
    return (
        <View style={styles.item}>
            <Link href={`/employees/${employee._id}`}>
                <Text style={styles.storeName}>{employee.name}</Text>
            </Link>

            <Text style={styles.storeAddress}>{employee.email}</Text>
            <Text style={styles.storeAddress}>{employee.phone_number}</Text>
            <Text style={styles.storeAddress}>{employee.dob}</Text>

            <Text style={styles.suppliersTitle}>Store:</Text>
            {stores.length > 0 ? (
                stores.map((store) => (
                    <Text key={store._id} style={styles.supplier}>
                        {store.name}
                    </Text>
                ))
            ) : (
                <Text>No store available</Text>
            )}

            <Text style={styles.suppliersTitle}>Role:</Text>
            {roles.length > 0 ? (
                roles.map((role) => (
                    <Text key={role._id} style={styles.supplier}>
                        {role.title}
                    </Text>
                ))
            ) : (
                <Text>No role available</Text>
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