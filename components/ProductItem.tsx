import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { ProductTypeID } from "@/types";

interface MyProps {
    product: ProductTypeID;
}

export default function ProductItem({ product }: MyProps) {
    return (
        <View style={styles.card}>
            <View style={styles.textContainer}>
                {/* Product Name */}
                <Link href={`/products/${product._id}`}>
                    <Text style={styles.productName}>{product.name}</Text>
                </Link>

                {/* Product Description */}
                <Text style={styles.productDescription}>{product.description}</Text>

                {/* Product Price */}
                <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FEF7FF",
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    productName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 14,
        color: "#555",
        marginTop: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        marginTop: 10,
    },
});