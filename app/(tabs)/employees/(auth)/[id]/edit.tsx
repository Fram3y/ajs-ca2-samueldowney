import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, Button, View, CheckBox } from 'react-native';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmployeeType } from "@/types";
import useAPI from '@/hooks/useAPI';
import axios from "axios";

export default function Page() {
    const [employee, setEmployee] = useState<EmployeeType | null>(null);
    const [stores, setStores] = useState([]);
    const [roles, setRoles] = useState([]);

    const { session } = useSession();
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { putRequest, error } = useAPI();

    const [form, setForm] = useState<EmployeeType>({
        name: "",
        email: "",
        address: "",
        dob: null,
        phone_number: "",
        store_id: [],
        role_id: [],
    });

    useEffect(() => {
        // Fetching Employee Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setEmployee(res.data))
            .catch(err => console.log(`Error Fetching Employee`, err));

        // Fetching Store Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setStores(res.data))
            .catch(err => console.error(`Error Fetching Stores`, err));

        // Fetching Role Data
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setRoles(res.data))
            .catch(err => console.error(`Error Fetching Roles`, err))
    }, [session, id])

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleCheckboxChange = (id: string, type: 'store' | 'role') => {
        setForm(prevState => {
            // Ensure the store_id or role_id is updated correctly
            const updatedIds = type === 'store'
                ? prevState.store_id.includes(id)
                    ? prevState.store_id.filter(existingId => existingId !== id)
                    : [...prevState.store_id, id]
                : prevState.role_id.includes(id)
                    ? prevState.role_id.filter(existingId => existingId !== id)
                    : [...prevState.role_id, id];

            return {
                ...prevState,
                [type === 'store' ? 'store_id' : 'role_id']: updatedIds,
            };
        });
    };

    const handleSubmit = () => {
        putRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        }, (data) => {
            router.push(`/employees/${data._id}`);
        });
    };

    return (
        <View>
            <Text>Name:</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
            />

            <Text>Email:</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <Text>Address:</Text>
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChangeText={(value) => setForm({ ...form, address: value })}
            />

            <Text>Date of Birth:</Text>

            {/* Web-only date picker */}
            <input
                type="date"
                value={form.dob ? form.dob.toISOString().slice(0, 10) : ""}
                onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setForm({ ...form, dob: newDate });
                }}
            />

            <Text>Phone Number:</Text>
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={form.phone_number}
                onChangeText={(value) => setForm({ ...form, phone_number: value })}
            />

            <Text>Store:</Text>
            {stores.map((store) => (
                <View key={store._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.store_id.includes(store._id)}
                        onValueChange={() => handleCheckboxChange(store._id, 'store')}
                    />
                    <Text>{store.name}</Text>
                </View>
            ))}

            <Text>Role:</Text>
            {roles.map((role) => (
                <View key={role._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.role_id.includes(role._id)}
                        onValueChange={() => handleCheckboxChange(role._id, 'role')}
                    />
                    <Text>{role.title}</Text>
                </View>
            ))}

            {error && <Text>{error}</Text>}

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    )
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
});