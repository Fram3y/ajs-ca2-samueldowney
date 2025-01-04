import { useSession } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import { View, Text, TextInput, StyleSheet, CheckBox, Button } from "react-native";
import { RoleTypeID, StoreTypeID } from "@/types";

interface FormState {
    store_id: string[];
    role_id: string[];
    [key: string]: any;
}

export default function Page() {
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [roles, setRoles] = useState<RoleTypeID[]>([]);

    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        address: "",
        dob: null,
        phone_number: "",
        store_id: [],
        role_id: [],
    });

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => { setStores(res.data); })
            .catch(err => { console.error(err); });

        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/roles`, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => setRoles(res.data))
            .catch(err => console.error(err));
    }, [session]);

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
        axios.post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/employees`, form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        })
            .then(res => { router.push(`/employees`); })
            .catch(err => { console.error(`Error registering employee`, err) })
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

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

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