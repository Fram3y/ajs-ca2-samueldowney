import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import EmployeeItem from '@/components/EmployeeItem';
import { EmployeeTypeID, RoleTypeID, StoreTypeID, EntityType } from '@/types';

export default function Tab() {
    const [employees, setEmployees] = useState<EmployeeTypeID[]>([]);
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [roles, setRoles] = useState<RoleTypeID[]>([]);
    const { session } = useSession();

    useEffect(() => {
        // Fetch Employees
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees`)
            .then(res => setEmployees(res.data))
            .catch(err => console.error('Error fetching employees:', err));

        // Fetch Stores
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`)
            .then(res => setStores(res.data))
            .catch(err => console.error('Error fetching stores:', err));

        // Fetch Roles
        axios
            .get(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/roles`)
            .then(res => setRoles(res.data))
            .catch(err => console.error('Error fetching roles:', err));
    }, [employees]);

    const getDataById = <T extends EntityType>(ids: string[], entities: T[]): T[] => {
        return entities.filter((entity) => ids.includes(entity._id));
    };

    if (employees.length === 0) return <Text style={styles.noData}>No employees found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Link href="/employees/create">
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                    >
                        <Text style={styles.submitButtonText}>Create New</Text>
                    </TouchableOpacity>
                </Link>

                {/* Employee Card Loop */}
                <FlatList
                    data={employees}
                    renderItem={({ item }) => {
                        const employeeStores = getDataById(item.store_id, stores);
                        const employeeRoles = getDataById(item.role_id, roles);

                        return (
                            <EmployeeItem
                                employee={item}
                                stores={employeeStores}
                                roles={employeeRoles}
                            />
                        );
                    }}
                    keyExtractor={(employee: EmployeeTypeID) => employee._id}
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
    noData: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
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