import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import CheckBox from "react-native-check-box";
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { EmployeeType, RoleTypeID, StoreTypeID } from "@/types";
import useAPI from '@/hooks/useAPI';
import axios from "axios";

interface FormType {
    name: string;
    email: string;
    address: string;
    dob: Date | null;
    phone_number: string;
    store_id: string[];
    role_id: string[];
}

export default function Page() {
    const [employee, setEmployee] = useState<EmployeeType | null>(null);
    const [stores, setStores] = useState<StoreTypeID[]>([]);
    const [roles, setRoles] = useState<RoleTypeID[]>([]);

    const { session } = useSession();
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const { putRequest, error } = useAPI();

    const [form, setForm] = useState<FormType>({
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
        axios.get(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/employees/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setEmployee(res.data))
            .catch(err => console.log(`Error Fetching Employee`, err));

        // Fetching Store Data
        axios.get(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/stores`, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(res => setStores(res.data))
            .catch(err => console.error(`Error Fetching Stores`, err));

        // Fetching Role Data
        axios.get(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/roles`, {
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
        putRequest(`https://ajs-ca1-samdowney-4i60yrw3j-samuels-projects-61c25dee.vercel.app/api/employees/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        }, (data) => {
            router.push(`/employees/${data._id}`);
        });
    };

    const handleGoBack = () => {
        router.push('/employees');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChangeText={(value) => setForm({ ...form, name: value })}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={form.email}
                onChangeText={(value) => setForm({ ...form, email: value })}
            />

            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChangeText={(value) => setForm({ ...form, address: value })}
            />

            <Text>Date of Birth:</Text>

            {/* Web-only date picker */}
            <input
                style={styles.input}
                type="date"
                value={form.dob ? form.dob.toISOString().slice(0, 10) : ""}
                onChange={(e) => {
                    const newDate = new Date(e.target.value);
                    setForm({ ...form, dob: newDate });
                }}
            />

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
                        isChecked={form.store_id?.includes(store._id)}
                        onClick={() => handleCheckboxChange(store._id, 'store')}
                        rightText={store.name}
                        rightTextStyle={styles.checkboxText}
                        checkedCheckBoxColor="#007BFF"
                        uncheckedCheckBoxColor="#CCC"
                    />
                </View>
            ))}

            <Text>Role:</Text>
            {roles.map((role) => (
                <View key={role._id} style={styles.checkboxContainer}>
                    <CheckBox
                        isChecked={form.role_id?.includes(role._id)}
                        onClick={() => handleCheckboxChange(role._id, 'role')}
                        rightText={role.title}
                        rightTextStyle={styles.checkboxText}
                        checkedCheckBoxColor="#007BFF"
                        uncheckedCheckBoxColor="#CCC"
                    />
                </View>
            ))}

            {error && <Text>{error}</Text>}

            <View style={styles.buttonRow}>
                {/* Submit Button */}
                <TouchableOpacity
                    style={[styles.button, styles.submitButton]}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                {/* Go Back Button */}
                <TouchableOpacity
                    style={[styles.button, styles.goBackButton]}
                    onPress={handleGoBack}
                >
                    <Text style={styles.goBackButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    checkboxText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#000',
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 16,
        marginTop: 16,
    },
    button: {
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    submitButton: {
        backgroundColor: "#65558F",
    },
    submitButtonText: {
        color: "#FFFFFF",
        fontWeight: "bold",
        textAlign: "center",
    },
    goBackButton: {
        backgroundColor: "#E9E1FF",
        borderWidth: 2,
        borderColor: "#65558F",
    },
    goBackButtonText: {
        color: "#65558F",
        fontWeight: "bold",
        textAlign: "center",
    },
});