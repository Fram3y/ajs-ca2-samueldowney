import { useSession } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { View, Text, TextInput, StyleSheet, CheckBox, Button } from "react-native";

export default function Page() {
    const [products, setProducts] = useState([]);

    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState({
        name: "",
        product_id: []
    });

    useEffect(() => {
        // Fetch products only
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => { setProducts(res.data); })
            .catch(err => { console.error(err); });
    }, []);

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleCheckboxChange = (id: string) => {
        setForm(prevState => {
            const updatedProductIds = prevState.product_id.includes(id)
                ? prevState.product_id.filter(existingId => existingId !== id)
                : [...prevState.product_id, id];

            return { ...prevState, product_id: updatedProductIds };
        });
    };

    const handleSubmit = () => {
        axios.post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => { router.push(`/suppliers`); })
            .catch(e => { console.log(e) })
    };

    return (
        <View>
            <Text>Name</Text>
            <TextInput
                style={styles.input}
                placeholder='Name'
                value={form.name}
                onChange={handleChange}
                id='name'
            />

            <Text>Products</Text>
            {products.map((product) => (
                <View key={product._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.product_id.includes(product._id)}
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
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    }
});