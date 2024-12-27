import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, Button, View } from 'react-native';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProductType } from "@/types";
import axios from "axios";

export default function Page() {
    const [product, setProduct] = useState<ProductType | null>(null);
    const [form, setForm] = useState({ name: "", description: "", price: "" });
    const router = useRouter();
    const { session } = useSession();
    const { id } = useLocalSearchParams();

    useEffect(() => {
        if (!id || !session) return;

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
        console.log('Submitting with token:', session);
        axios.put(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/products/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => router.push(`/products/${res.data._id}`))
            .catch(err => console.error(err));
    };

    return (
        <View>
            <Text>Name</Text>
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
        padding: 10,
    }
});