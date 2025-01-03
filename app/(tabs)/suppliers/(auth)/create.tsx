import { useSession } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { View, Text, TextInput, StyleSheet, CheckBox } from "react-native";
import { TouchableOpacity } from "react-native";

interface FormState {
    name: string;
    product_id: string[];
}

export default function Page() {
    const [products, setProducts] = useState<any[]>([]);
    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState<FormState>({
        name: "",
        product_id: []
    });

    useEffect(() => {
        axios
            .get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then((res) => setProducts(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleCheckboxChange = (id: string) => {
        setForm((prevState) => {
            const updatedProductIds = prevState.product_id.includes(id)
                ? prevState.product_id.filter((existingId) => existingId !== id)
                : [...prevState.product_id, id];
            return { ...prevState, product_id: updatedProductIds };
        });
    };

    const handleSubmit = () => {
        axios
            .post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, form, {
                headers: { Authorization: `Bearer ${session}` },
            })
            .then(() => router.push(`/suppliers`))
            .catch((err) => console.error(`Error registering supplier`, err));
    };

    const handleGoBack = () => {
        router.push(`/suppliers`);
    };

    return (
        <View style={styles.container}>
            <TextInput
                id="name"
                value={form.name}
                onChangeText={(text) =>
                    setForm((prevState) => ({ ...prevState, name: text }))
                }
                style={styles.input}
                placeholder="Supplier Name"
            />
    
            <Text style={styles.productsTitle}>Products</Text> {/* Updated text style */}
    
            {products.map((product) => (
                <View key={product._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.product_id.includes(product._id)}
                        onValueChange={() => handleCheckboxChange(product._id)}
                        style={styles.checkbox}
                    />
                    <Text style={styles.checkboxText}>{product.name}</Text>
                </View>
            ))}
    
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.goBackButton]}
                    onPress={handleGoBack}
                >
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

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
    productsTitle: {
        fontSize: 20, // Increased font size for "Products"
        fontWeight: "bold", // Bold text
        marginBottom: 16, // Add space below the title
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    checkbox: {
        transform: [{ scale: 1.5 }],
    },
    checkboxText: {
        marginLeft: 16,
        fontSize: 16, 
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