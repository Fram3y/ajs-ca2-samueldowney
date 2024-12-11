import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { StoreTypeID } from '@/types';

interface MyProps {
    store: StoreTypeID;
}

export default function StoreItem({store}: MyProps){
    return (
        <View style={styles.item}>
            <Link href={`/stores/${store._id}`}>
                <Text>{store.name}</Text>
            </Link>
            <Text>{store.address}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#eaeaea',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16
      }
});