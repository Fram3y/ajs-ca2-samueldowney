import { useState } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { View, TextInput, Button } from "react-native";
import { StyleSheet } from "react-native";

export default function Tab() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = () => {
        axios.post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/users/register`, form)
            .then(() => router.push(`/`))
            .catch(err => console.error(`Error Creating User`, err))
    };

    return (
        <View>
            <TextInput
                style={styles.input}
                placeholder='Name'
                value={form.name}
                onChange={handleChange}
                id='name'
            />

            <TextInput
                style={styles.input}
                placeholder='Email'
                value={form.email}
                onChange={handleChange}
                id='email'
            />

            <TextInput
                style={styles.input}
                placeholder='Password'
                value={form.password}
                onChange={handleChange}
                id='password'
            />

            <Button
                onPress={handleSubmit}
                title="Create Account"
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