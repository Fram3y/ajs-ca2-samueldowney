import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { EmployeeTypeID, StoreTypeID, RoleTypeID } from '@/types';

interface MyProps {
    employee: EmployeeTypeID;
    stores: StoreTypeID[];
    roles: RoleTypeID[];
};

export default function EmployeeItem({ employee, stores, roles }: MyProps) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                {/* Employee Name */}
                <Link href={`/employees/${employee._id}`}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                </Link>

                {/* Employee Email, Phone, and DOB */}
                <Text style={styles.employeeInfo}>{employee.email}</Text>
                <Text style={styles.employeeInfo}>{employee.phone_number}</Text>
                <Text style={styles.employeeInfo}>{employee.dob}</Text>

                {/* Store List */}
                <Text style={styles.infoTitle}>Store:</Text>
                {stores.length > 0 ? (
                    stores.map((store) => (
                        <Text key={store._id} style={styles.infoText}>
                            {store.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noData}>No store available</Text>
                )}

                {/* Role List */}
                <Text style={styles.infoTitle}>Role:</Text>
                {roles.length > 0 ? (
                    roles.map((role) => (
                        <Text key={role._id} style={styles.infoText}>
                            {role.title}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noData}>No role available</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF7FF", // Same background color as other components
        borderRadius: 12, // Same border radius
        padding: 16, // Same padding
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000", // Consistent shadow styling
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    employeeName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4, // Same margin as in other items
    },
    employeeInfo: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4, // Spacing between different employee details
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