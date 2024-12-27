import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ProductTypeID } from "@/types";

interface MyProps {
    product: ProductTypeID;
}

export default function ProductItem({ product }: MyProps) {
    return (
        <View style={styles.item}>
            <Link href={`/products/${product._id}`}>
                <Text style={styles.productName}>{product.name}</Text>
            </Link>
            <Text style={styles.productDescription}>{product.description}</Text>
            <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#eaeaea',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    productDescription: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
});