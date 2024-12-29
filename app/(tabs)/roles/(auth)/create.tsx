import { useState } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TextInput, StyleSheet, Button, View } from "react-native";
import useAPI from '@/hooks/useAPI';

export default function Page() {
    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const { postRequest, data, loading, error } = useAPI();

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = () => {
        postRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }, (data) => {
            router.push(`/roles`);
        });
    };

    if (loading === true) return <Text>Loading API...</Text>

    return (
        <View>
            {/* Title Field */}
            <Text>Title</Text>
            <TextInput
                style={styles.input}
                placeholder='Title'
                value={form.title}
                onChange={handleChange}
                id='title'
            />

            {/* Description Field */}
            <Text>Description</Text>
            <TextInput
                style={styles.input}
                placeholder='Description'
                value={form.description}
                onChange={handleChange}
                id='description'
            />

            {/* Error Text */}
            <Text>{error}</Text>

            {/* Submit Button */}
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