import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, Button, View, CheckBox } from 'react-native';
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
        <View>
            <Text>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                id="name"
            />

            <Text>Product</Text>
            {products.map((product) => (
                <View key={product._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.product_id?.includes(product._id)} // Use optional chaining to prevent undefined errors
                        onValueChange={() => handleCheckboxChange(product._id)}
                    />
                    <Text>{product.name}</Text>
                </View>
            ))}

            <Button
                onPress={handleSubmit}
                title="Submit"
                color="#841584"
            />

            <Button
                title="Go Back"
                onPress={handleGoBack}
            />
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
});