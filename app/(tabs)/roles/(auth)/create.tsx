import { useState } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TextInput, StyleSheet, TouchableOpacity, View } from "react-native";
import useAPI from '@/hooks/useAPI';
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const { loading, error } = useAPI();

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = () => {
        axios.
            post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, form, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then(() => router.push(`/roles`))
            .catch(err => console.error(`Error Creating Role`, err))
    };

    const handleGoBack = () => {
        router.push(`/roles`);
    };

    if (loading === true) return <Text>Loading API...</Text>

    return (
        <View style={styles.container}>
            {/* Title Field */}
            <TextInput
                style={styles.input}
                placeholder='Title'
                value={form.title}
                onChange={handleChange}
                id='title'
            />

            {/* Description Field */}
            <TextInput
                style={styles.input}
                placeholder='Description'
                value={form.description}
                onChange={handleChange}
                id='description'
            />

            {/* Error Text */}
            <Text>{error}</Text>

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
    submitButton: {
        backgroundColor: "#65558F",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
});