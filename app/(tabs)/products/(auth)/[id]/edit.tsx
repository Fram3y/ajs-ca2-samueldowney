import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductType } from "@/types";
import axios from "axios";

export default function Page() {
    const [product, setProduct] = useState<ProductType | null>(null);
    const router = useRouter();
    const { session } = useSession();
    const { id } = useLocalSearchParams();

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: ""
    });

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => {
                setProduct(res.data);
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
        axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => router.push(`/products/${res.data._id}`))
            .catch(err => console.error(err));
    };

    const handleGoBack = () => {
        router.push('/products');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(value) => handleChange('name', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
            />

            <TextInput
                style={styles.input}
                placeholder="Price"
                value={form.price}
                onChangeText={(value) => handleChange('price', value)}
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
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
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