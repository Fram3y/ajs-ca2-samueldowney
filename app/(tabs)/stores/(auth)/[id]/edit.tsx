import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, Button, View, CheckBox } from 'react-native';
import { useSession } from "@/contexts/AuthContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StoreType, SupplierTypeID } from "@/types";
import useAPI from '@/hooks/useAPI';
import axios from "axios";

export default function Page() {
    const router = useRouter();
    const [store, setStore] = useState<StoreType | null>(null);
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);

    const { session } = useSession();
    const { id } = useLocalSearchParams();

    const [form, setForm] = useState<{ name: string; address: string; supplier_id: string[] }>({
        name: '',
        address: "",
        supplier_id: [],
    });

    const { getRequest, putRequest, loading, error } = useAPI();

    // Fetch store data
    useEffect(() => {
        getRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, {
            headers: { Authorization: `Bearer ${session}` }
        }, (data) => {
            setStore(data as StoreType);
            setForm({
                ...data,
                supplier_id: data.supplier_id || [], // Ensure supplier_id is an array
            });
        });
    }, [id]);

    // Fetch suppliers
    useEffect(() => {
        axios.get(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/suppliers`, {
            headers: { Authorization: `Bearer ${session}` }
        })
        .then(res => setSuppliers(res.data))
        .catch(e => console.log(e));
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
        putRequest(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores/${id}`, form, {
            headers: { Authorization: `Bearer ${session}` }
        }, (data) => {
            router.push(`/stores/${data._id}`);
        });
    };

    if (loading) return <Text>Loading API...</Text>;

    return (
        <View>
            <Text>Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                id="name"
            />

            <Text>Address</Text>
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                id="address"
            />

            <Text>Suppliers</Text>
            {/* Checkboxes for suppliers */}
            {suppliers.map((supplier) => (
                <View key={supplier._id} style={styles.checkboxContainer}>
                    <CheckBox
                        value={form.supplier_id?.includes(supplier._id)} // Use optional chaining to prevent undefined errors
                        onValueChange={() => handleCheckboxChange(supplier._id)}
                    />
                    <Text>{supplier.name}</Text>
                </View>
            ))}

            {error && <Text>{error}</Text>}
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
        padding: 10,
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
});