import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SupplierTypeID, ProductTypeID } from "@/types";
import axios from "axios";

export default function Page() {
    const [supplier, setSupplier] = useState<SupplierTypeID | null>(null);
    const [products, setProducts] = useState<ProductTypeID[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { session } = useSession();
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [form, setForm] = useState<{ name: string; product_id: string[] }>({
        name: '',
        product_id: [],
    });

    useEffect(() => {
        setIsLoading(true);

        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => {
                setSupplier(res.data);
                setForm({
                    ...res.data,
                    product_id: res.data.product_id || []
                });
            })
            .catch(err => console.error(err))

        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setProducts(res.data))
            .catch(e => console.log(e))
            .finally(() => { setIsLoading(false) })
    }, [id]);

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleCheckboxChange = (productId: string) => {
        setForm(prevState => {
            const newProducts = prevState.product_id.includes(productId)
                ? prevState.product_id.filter(id => id !== productId)
                : [...prevState.product_id, productId];
            return { ...prevState, product_id: newProducts };
        });
    };

    const handleSubmit = () => {
        axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => router.push(`/suppliers/${res.data._id}`))
            .catch(err => console.error(err))
    };

    const handleGoBack = () => {
        router.push('/suppliers');
    };

    if (isLoading === true) return <Text>Loading API...</Text>;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                id="name"
            />

            <Text style={styles.productsTitle}>Product</Text>
            {products.map((product) => (
                <View key={product._id} style={styles.checkboxContainer}>
                    <CheckBox
                        isChecked={form.product_id?.includes(product._id)} 
                        onClick={() => handleCheckboxChange(product._id)} 
                        rightText={product.name}
                        rightTextStyle={styles.checkboxText} 
                        checkedCheckBoxColor="#007BFF"
                        uncheckedCheckBoxColor="#CCC"
                    />
                </View>
            ))}

            {/* Button Row */}
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
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
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