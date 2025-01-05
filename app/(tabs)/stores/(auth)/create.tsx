import { useState, useEffect } from "react";
import { useSession } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Text, TextInput, StyleSheet, View, TouchableOpacity } from "react-native";
import CheckBox from "react-native-check-box";
import useAPI from '@/hooks/useAPI';
import axios from "axios";
import { SupplierTypeID } from "@/types";

interface FormState {
    name: string;
    address: string;
    supplier_id: string[]; 
}

export default function Page() {
    const [suppliers, setSuppliers] = useState<SupplierTypeID[]>([]);

    const router = useRouter();
    const { session } = useSession();

    const [form, setForm] = useState<FormState>({
        name: "",
        address: "",
        supplier_id: [],
    });

    const { loading, error } = useAPI();

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
        axios.post(`https://ajs-ca1-samdowney-qyjyroi1h-samuels-projects-61c25dee.vercel.app/api/stores`, form, {
            headers: { Authorization: `Bearer ${session}` }
        })
            .then(() => router.push(`/stores`))
            .catch(err => console.error(`Error Updating Store:`, err))
    };

    const handleGoBack = () => {
        router.push('/stores');
    };

    if (loading === true) return <Text>Loading API...</Text>;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder='Name'
                value={form.name}
                onChange={handleChange}
                id='name'
            />

            <TextInput
                style={styles.input}
                placeholder='Address'
                value={form.address}
                onChange={handleChange}
                id='address'
            />

            <Text style={styles.suppliersTitle}>Suppliers</Text>
            {suppliers.map((supplier) => (
                <View key={supplier._id} style={styles.checkboxContainer}>
                    <CheckBox
                        isChecked={form.supplier_id?.includes(supplier._id)}
                        onClick={() => handleCheckboxChange(supplier._id)}
                        rightText={supplier.name}
                        rightTextStyle={styles.checkboxText}
                        checkedCheckBoxColor="#007BFF"
                        uncheckedCheckBoxColor="#CCC"
                    />
                </View>
            ))}

            <Text>{error}</Text>

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
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flex: 1,
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
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        marginBottom: 16,
        paddingLeft: 8,
    },
    suppliersTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
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
});