import { Text, StyleSheet, FlatList, Button } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import EmployeeItem from '@/components/EmployeeItem';
import { EmployeeTypeID } from '@/types';

export default function Tab() {
    const [employees, setEmployees] = useState([]);
    const [stores, setStores] = useState([]);
    const [roles, setRoles] = useState([]);
    const { session } = useSession();

    useEffect(() => {
        // Fetch Employees
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees`, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then((res) => setEmployees(res.data))
            .catch((err) => console.error('Error fetching employees:', err));

        // Fetch Stores
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then((res) => setStores(res.data))
            .catch((err) => console.error('Error fetching stores:', err));

        // Fetch Roles
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then((res) => setRoles(res.data))
            .catch((err) => console.error('Error fetching roles:', err));
    }, []);

    const getDataById = (ids, entities) => {
        // Helper function to map IDs to their corresponding entities
        return entities.filter((entity) => ids.includes(entity._id));
    };

    if (employees.length === 0) return <Text style={styles.noData}>No employees found</Text>;
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Link href="/employees/create">
                    <Button title="Register New Employee" color="blue" />
                </Link>

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
        paddingHorizontal: 16,
    },
    noData: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#777',
    },
});