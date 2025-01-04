import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { RoleType } from "@/types";
import axios from "axios";

export default function Page() {
    const [role, setRole] = useState<RoleType | null>(null);
    const router = useRouter();
    const { session } = useSession();
    const { id } = useLocalSearchParams();

    const [form, setForm] = useState({
        title: "",
        description: ""
    });

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => {
                setRole(res.data);
                setForm({ ...res.data });
            })
            .catch(err => console.error(err));
    }, [id, session]);

    const handleChange = (key: string, value: string) => {
        setForm(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => router.push(`/roles/${res.data._id}`))
            .catch(err => console.error(err))
    };

    const handleGoBack = () => {
        router.push('/roles');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={form.title}
                onChangeText={(value) => handleChange('title', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
            />

            <View style={styles.buttonRow}>

                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                {/* Go Back Button */}
                <TouchableOpacity
                    style={[styles.button, styles.goBackButton]}
                    onPress={handleGoBack}
                >
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
    container: {
        padding: 16,
        flex: 1,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 16,
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
});