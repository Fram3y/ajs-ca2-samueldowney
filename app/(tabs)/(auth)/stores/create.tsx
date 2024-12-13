import { useState } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import useAPI from '@/hooks/useAPI';

export default function Page() {
    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState({
        name: "",
        address: "",
        supplier_id: [],
    });

    const { postRequest, data, loading, error } = useAPI();

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = () => {
        console.log(form);

        postRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }, (data) => {
            router.push(`/stores/${data._id}`);
        });
    };

    if (loading === true) return <Text>Loading API...</Text>

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

            <Text>Address</Text>
            <TextInput
                style={styles.input}
                placeholder='Address'
                value={form.address}
                onChange={handleChange}
                id='address'
            />

            <Text>Supplier</Text>
            <TextInput
                style={styles.input}
                placeholder='Supplier'
                value={form.supplier_id}
                onChange={handleChange}
                id='supplier_id'
            />

            <Text>{error}</Text>
            <Button
                onPress={handleSubmit}
                title="Submit"
                color="#841584"
            />
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10
    }
});
