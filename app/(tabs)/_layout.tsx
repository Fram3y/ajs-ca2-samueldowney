import { Tabs, Link, useSegments } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarActiveTintColor: 'blue' }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{ headerShown: false }} // Home Screen
      />
      <Tabs.Screen
        name="stores"
        options={{ headerShown: false }} // Store Screen
      />
      <Tabs.Screen
        name="suppliers"
        options={{ headerShown: false }} // Supplier Screen
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const segments = useSegments();

  return (
    <View style={styles.tabBar}>
      {/* Home Tab */}
      <Link href="/(tabs)/index" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="home"
            size={28}
            color={state.index === 0 ? 'blue' : 'gray'}
          />
          <Text style={{ color: state.index === 0 ? 'blue' : 'gray' }}>Home</Text>
        </TouchableOpacity>
      </Link>

      {/* Store Tab */}
      <Link href="/(tabs)/stores" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="shopping-cart"
            size={28}
            color={state.index === 1 ? 'blue' : 'gray'}
          />
          <Text style={{ color: state.index === 1 ? 'blue' : 'gray' }}>Store</Text>
        </TouchableOpacity>
      </Link>

      {/* Supplier Tab */}
      <Link href="/(tabs)/suppliers" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="truck"
            size={28}
            color={state.index === 2 ? 'blue' : 'gray'}
          />
          <Text style={{ color: state.index === 2 ? 'blue' : 'gray' }}>
            Supplier
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  tabItem: {
    alignItems: 'center',
  },
});


