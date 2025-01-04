import { Text, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { useSession } from '@/contexts/AuthContext';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios';
import { EmployeeType, StoreTypeID, RoleTypeID } from '@/types';

export default function Tab() {
    const [employee, setEmployee] = useState<EmployeeType | null>(null);
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [roles, setRoles] = useState<RoleTypeID[]>([]);

    const [filteredStores, setFilteredStores] = useState<StoreTypeID[]>([]);
    const [filteredRoles, setFilteredRoles] = useState<RoleTypeID[]>([]);

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Fetching employee data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setEmployee(res.data))
            .catch(err => console.error(`Error Fetching Employee`, err));

        // Fetching all stores for filter
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setStores(res.data))
            .catch(err => console.error(`Error Fetching Stores`, err));

        // Fetching all roles for filter
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setRoles(res.data))
            .catch(err => console.error(`Error Fetching Roles`, err));
    }, [id, session])

    useEffect(() => {
        if (employee && employee.data?.store_id && stores.length > 0) {
            const filtered = stores.filter(store =>
                employee.data.store_id.includes(store._id.toString()) // Ensure supplier._id is compared as a string
            );
            setFilteredStores(filtered);
        }
    }, [employee, stores]);

    useEffect(() => {
        if (employee && employee.data?.role_id && roles.length > 0) {
            const filtered = roles.filter(role =>
                employee.data.role_id.includes(role._id.toString()) // Ensure supplier._id is compared as a string
            );
            setFilteredRoles(filtered);
        }
    }, [employee, roles]);

    const handleDelete = async () => {
        try {
            const response = await axios.put(
                `https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees/${id}`,
                { isDeleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.isDeleted !== undefined) {
                router.push('/employees');
            } else {
                console.error('Failed to update employee:', response.data.message || 'No success flag');
            }
        } catch (err) {
            console.error('Error deleting store:', err);
        };
    };

    const handleGoBack = () => {
        router.push('/employees');
    };

    if (!employee || !employee.data) return <Text style={styles.loadingText}>Employee not found</Text>;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Text style={styles.storeName}>{employee.data.name}</Text>
                <Text style={styles.storeAddress}>{employee.data.email}</Text>
                <Text style={styles.storeAddress}>{employee.data.phone_number}</Text>
                <Text style={styles.storeAddress}>{employee.data.address}</Text>
                <Text style={styles.storeAddress}>{employee.data.dob}</Text>

                {/* Suppliers Section */}
                <Text style={styles.suppliersTitle}>Store:</Text>
                {filteredStores.length > 0 ? (
                    filteredStores.map(store => (
                        <Text key={store._id} style={styles.supplier}>
                            {store.name}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.noSuppliers}>No suppliers available</Text>
                )}

                {/* Edit Button */}
                <Link href={`/employees/${employee.data._id}/edit`}>
                    <Button title="Edit Store" color="blue" />
                </Link>

                {/* Delete Button */}
                <Button
                    title="Delete"
                    color="red"
                    onPress={handleDelete}
                />

                {/* Go Back Button */}
                <Button
                    title="Go Back"
                    onPress={handleGoBack}
                />

            </SafeAreaView>
        </SafeAreaProvider>
    )
};

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
    storeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    storeAddress: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    suppliersTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    supplier: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    noSuppliers: {
        fontSize: 16,
        color: '#999',
        marginVertical: 5,
    },
    goBackButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50',
        width: '80%',
    },
});