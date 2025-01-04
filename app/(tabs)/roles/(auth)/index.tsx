import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useState, useEffect } from "react"
import { useSession } from "@/contexts/AuthContext"
import axios from "axios"
import { RoleTypeID } from "@/types";
import RoleItem from "@/components/RoleItem";

export default function Tab() {
    const [roles, setRoles] = useState<RoleTypeID[]>([]);
    const { session } = useSession();

    useEffect(() => {
        // Fetch Roles
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setRoles(res.data))
            .catch(err => console.log('Error Fetching Roles:', err))
    }, []);

    if (roles.length === 0) return <Text>No Roles found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

                {/* Create New Button */}
                <Link href="/roles/create">
                    <TouchableOpacity
                        style={[styles.button, styles.submitButton]}
                    >
                        <Text style={styles.submitButtonText}>Create New</Text>
                    </TouchableOpacity>
                </Link>

                {/* Role Card Loop */}
                <FlatList
                    data={roles}
                    renderItem={({ item }) => <RoleItem role={item} />}
                    keyExtractor={(item: RoleTypeID) => item._id}
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