import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TextInput, StyleSheet, Button, View, CheckBox } from "react-native";
import useAPI from '@/hooks/useAPI';
import axios from "axios";
import { SupplierTypeID } from "@/types";

// Define the FormState type to ensure proper typing
interface FormState {
    name: string;
    address: string;
    supplier_id: string[]; // Explicitly typing supplier_id as string[]
}

export default function Page() {
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);

    const router = useRouter();
    const { session } = useSession();

    // Explicitly type the form state with FormState interface
    const [form, setForm] = useState<FormState>({
        name: "",
        address: "",
        supplier_id: [], // Initialize supplier_id as an empty array of strings
    });

    const { postRequest, data, loading, error } = useAPI();

    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`)
            .then(res => { setSuppliers(res.data) })
            .catch(e => { console.log(e); });
    }, []);

    const handleChange = (e: any) => {
        setForm(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value
        }));
    };

    const handleCheckboxChange = (supplierId: string) => {
        setForm(prevState => {
            const newSuppliers = prevState.supplier_id.includes(supplierId)
                ? prevState.supplier_id.filter(id => id !== supplierId)
                : [...prevState.supplier_id, supplierId];
            return { ...prevState, supplier_id: newSuppliers };
        });
    };

    const handleSubmit = () => {
        postRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, form, {
            headers: {
                Authorization: `Bearer ${session}`
            }
        }, (data) => {
            router.push(`/stores`);
        });
    };

    if (loading === true) return <Text>Loading API...</Text>;

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

            <Text>Suppliers</Text>
            {/* Multiple selection using checkboxes */}
            {suppliers.map((supplier) => (
                <View key={supplier._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.supplier_id.includes(supplier._id)}
                        onValueChange={() => handleCheckboxChange(supplier._id)}
                    />
                    <Text>{supplier.name}</Text>
                </View>
            ))}

            <Text>{error}</Text>
            
            <Button
                onPress={handleSubmit}
                title="Submit"
                color="#841584"
            />
        </View>
    );
};

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