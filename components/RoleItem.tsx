import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { RoleTypeID } from "@/types";

interface MyProps {
    role: RoleTypeID;
}

export default function RoleItem({ role }: MyProps) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                {/* Role Title */}
                <Link href={`/roles/${role._id}`}>
                    <Text style={styles.roleName}>{role.title}</Text>
                </Link>

                {/* Role Description */}
                <Text style={styles.roleDesc}>{role.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF7FF", 
        borderRadius: 12, 
        padding: 16, 
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    roleName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    roleDesc: {
        fontSize: 14,
        color: "#333",
        marginTop: 4,
    },
});