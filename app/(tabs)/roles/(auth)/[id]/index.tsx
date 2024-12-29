import { useSession } from "@/contexts/AuthContext";
import { RoleType } from "@/types";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Text, StyleSheet, Button } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
    const [role, setRole] = useState<RoleType | null>(null)

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    // Getting role by Id
    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles/${id}`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
        .then(res => setRole(res.data)) // Using the response data to set the role
        .catch(err => console.error('Error fetching role:', err));  // Checking for errors
    }, [id, session]);  // UseEffect will run again if the id or session data changes

    const handleDelete = async () => {
        try {
            const response = await axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles/${id}`,
                { isDeleted: true },
                {
                    headers: {
                        Authorization: `Bearer ${session}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data && response.data.isDeleted !== undefined) {
                router.push('/roles');
            } else {
                console.error('Failed to update role:', response.data.message || 'No success flag');
            }
        } catch (err) {
            console.error('Error updating role:', err);
        };
    };

    const handleGoBack = () => {
        router.push('/roles');
    };

    if (!role || !role.data) return <Text style={styles.loadingText}>Role not found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Content */}
                <Text style={styles.storeName}>{role.data.title}</Text>
                <Text style={styles.storeDescription}>{role.data.description}</Text>

                {/* Edit Button */}
                <Link href={`/roles/${role.data._id}/edit`}>
                    <Button title="Edit Role" color="blue" />
                </Link>

                {/* Delete Button */}
                <Button 
                    title="Delete"
                    color="#D32F2F"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                />

                {/* Go Back Button */}
                <Button 
                    title="Go Back"
                    onPress={handleGoBack}
                    style={styles.goBackButton}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
    storeName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    storeDescription: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
        textAlign: 'center',
    },
    storePrice: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#D32F2F',
        width: '80%',
        borderRadius: 8,
    },
    goBackButton: {
        marginTop: 20,
        backgroundColor: '#4CAF50', // Green color for "Go Back" button
        width: '80%',  // Make the button a bit wider
        borderRadius: 8,
    },
});