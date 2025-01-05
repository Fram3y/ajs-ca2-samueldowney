import { Text, TextInput, StyleSheet, Button, View } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useSession } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function LoginForm() {
    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    const { signIn } = useSession();
    const router = useRouter();

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    }

    const handlePress = () => {
        axios.post('https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/users/login', {
            email: form.email,
            password: form.password
        })
            .then(response => {
                console.log(response.data.token)
                signIn(response.data.token);
            })
            .catch(e => {
                console.log(e);
                setError(e.response.data.message);
            });
    };

    const handleRoute = () => {
        router.push(`/(tabs)/createUser`)
    }

    return (
        <View>
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

            <Text>{error}</Text>

            <Button
                onPress={handlePress}
                title="Log In"
                color="#841584"
            />

            <Button
                onPress={handleRoute}
                title="Create Account"
                color="blue"
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
    }
});

