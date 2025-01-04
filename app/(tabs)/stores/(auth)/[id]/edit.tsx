import { useEffect, useState } from "react";
import { Text, TextInput, StyleSheet, TouchableOpacity, View } from 'react-native';
import CheckBox from "react-native-check-box";
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

    const handleGoBack = () => {
        router.push('/stores');
    };

    if (loading) return <Text>Loading API...</Text>;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                id="name"
            />

            <TextInput
                style={styles.input}
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                id="address"
            />

            <Text style={styles.productsTitle}>Suppliers</Text>
            {/* Checkboxes for suppliers */}
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
    );
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
    productsTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
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