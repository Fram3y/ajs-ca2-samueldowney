import { useSession } from "@/contexts/AuthContext";
import { RoleType } from "@/types";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import axios from "axios";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
    const [role, setRole] = useState<RoleType | null>(null)

    const { id } = useLocalSearchParams();
    const { session } = useSession();
    const router = useRouter();

    // Getting role by Id
    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setRole(res.data))
            .catch(err => console.error('Error fetching role:', err));
    }, [id]);

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

                <View style={styles.buttonRow}>
                    {/* Delete Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={handleDelete}
                    >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>

                    {/* Edit Button */}
                    <Link href={`/roles/${role.data._id}/edit`}>
                        <TouchableOpacity
                            style={[styles.button, styles.goBackButton]}
                        >
                            <Text style={styles.goBackButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </Link>

                    {/* Go Back Button */}
                    <TouchableOpacity
                        style={[styles.button, styles.goBackButton]}
                        onPress={handleGoBack}
                    >
                        <Text style={styles.goBackButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>

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
    button: {
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    deleteButton: {
        backgroundColor: "#65558F",
    },
    deleteButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    goBackButton: {
        backgroundColor: "#E9E1FF",
        borderWidth: 2,
        borderColor: "#65558F",
    },
    goBackButtonText: {
        color: "#65558F",
        fontWeight: "bold",
        textAlign: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 16,
    },
});