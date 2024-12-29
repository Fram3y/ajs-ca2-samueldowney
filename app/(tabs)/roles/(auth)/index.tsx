import { Text, StyleSheet, FlatList, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useState, useEffect } from "react"
import { useSession } from "@/contexts/AuthContext"
import axios from "axios"
import { RoleTypeID } from "@/types";
import { RoleType } from "@/types";
import RoleItem from "@/components/RoleItem";

export default function Tab() {
    const [roles, setRoles] = useState<RoleTypeID[]>([]);
    const { session } = useSession();

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
        .then(res => setRoles(res.data))
        .catch(err => console.log('Error fetching roles:', err))
    }, []);

    if (roles.length === 0) return <Text>No Roles found</Text>

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>

                {/* New Role Button */}
                <Link href='/roles/create'>
                    <Button title="Create New Role" color="blue" />
                </Link>

                {/* Role Card */}
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
});