import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, Button, View } from 'react-native';
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

    return (
        <View>
            <Text>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={form.title}
                onChangeText={(value) => handleChange('title', value)}
            />

            <Text>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={form.description}
                onChangeText={(value) => handleChange('description', value)}
            />

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
        padding: 10,
    }
});