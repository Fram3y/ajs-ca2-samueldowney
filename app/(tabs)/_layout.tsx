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
      <Tabs.Screen
        name="products"
        options={{ headerShown: false }} // Products Screen
      />
      <Tabs.Screen
        name="roles"
        options={{ headerShown: false }} // Roles Screen
      />
    </Tabs>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const segments = useSegments();
  
  // Helper function to determine active state
  const isActive = (routeName) => {
    const currentRoute = state.routes[state.index].name;
    return currentRoute === routeName || segments.includes(routeName);
  };

  return (
    <View style={styles.tabBar} key={state.index}>
      {/* Home Tab */}
      <Link href="/" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="home"
            size={28}
            color={isActive("index") ? "blue" : "gray"}
          />
          <Text style={{ color: isActive("index") ? "blue" : "gray" }}>
            Home
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Store Tab */}
      <Link href="/(tabs)/stores" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="shopping-cart"
            size={28}
            color={isActive("stores") ? "blue" : "gray"}
          />
          <Text style={{ color: isActive("stores") ? "blue" : "gray" }}>
            Stores
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Supplier Tab */}
      <Link href="/(tabs)/suppliers" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="truck"
            size={28}
            color={isActive("suppliers") ? "blue" : "gray"}
          />
          <Text style={{ color: isActive("suppliers") ? "blue" : "gray" }}>
            Suppliers
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Products Tab */}
      <Link href="/(tabs)/products" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="tags"
            size={28}
            color={isActive("products") ? "blue" : "gray"}
          />
          <Text style={{ color: isActive("products") ? "blue" : "gray" }}>
            Products
          </Text>
        </TouchableOpacity>
      </Link>

      {/* Roles Tab */}
      <Link href="/(tabs)/roles" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="users"
            size={28}
            color={isActive("roles") ? "blue" : "gray"}
          />
          <Text style={{ color: isActive("roles") ? "blue" : "gray" }}>
            Roles
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

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