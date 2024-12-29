import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { RoleTypeID } from "@/types";

interface MyProps {
    role: RoleTypeID;
}

export default function RoleItem({ role }: MyProps) {
    return (
            <View style={styles.item}>
                <Link href={`/roles/${role._id}`}>
                    <Text style={styles.roleName}>{role.title}</Text>
                </Link>
                <Text style={styles.roleDesc}>{role.description}</Text>
            </View>
        );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#eaeaea',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    roleName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    roleDesc: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    }
});