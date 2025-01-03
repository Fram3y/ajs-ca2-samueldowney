import { Tabs, Link, useSegments } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { TabNavigationState, ParamListBase, Route } from '@react-navigation/native';

type CustomTabBarProps = {
  state: TabNavigationState<ParamListBase>;
};

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

function CustomTabBar({ state }: CustomTabBarProps) {
  const segments = useSegments() as string[]; // Explicitly type as string[]

  const isActive = (routeName: string): boolean => {
    const currentRoute: string | undefined = state.routes[state.index]?.name;
    return currentRoute === routeName || segments.includes(routeName); // Now works as expected
  };

  return (
    <View style={styles.tabBar} key={state.index}>

      {/* Home Tab */}
      <Link href="/" asChild>
        <TouchableOpacity style={styles.tabItem}>
          <FontAwesome
            name="home"
            size={28}
            color={isActive("index") ? "#65558F" : "gray"}
          />
        </TouchableOpacity>
      </Link>


      {/* Stores Page */}
      <Link href="/(tabs)/stores/(auth)" asChild>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome
            name="shopping-cart"
            size={28}
            color={isActive("stores") ? "#65558F" : "gray"}
          />
        </TouchableOpacity>
      </Link>

      {/* Suppliers Page */}
      <Link href="/(tabs)/suppliers/(auth)" asChild>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome
            name="truck"
            size={28}
            color={isActive("suppliers") ? "#65558F" : "gray"}
          />
        </TouchableOpacity>
      </Link>

      {/* Products Tab */}
      <Link href="/(tabs)/products/(auth)" asChild>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome
            name="tags"
            size={28}
            color={isActive("products") ? "#65558F" : "gray"}
          />
        </TouchableOpacity>
      </Link>

      {/* Roles Tab */}
      <Link href="/(tabs)/roles/(auth)" asChild>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome
            name="users"
            size={28}
            color={isActive("roles") ? "#65558F" : "gray"}
          />
        </TouchableOpacity>
      </Link>

      {/* Employees Tab */}
      <Link href="/(tabs)/employees/(auth)" asChild>
        <TouchableOpacity style={styles.tabItem}>
        <FontAwesome
            name="id-badge"
            size={28}
            color={isActive("employees") ? "#65558F" : "gray"}
          />
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
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f2f0fc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  activeTabItem: {
    backgroundColor: '#e0dbff', // Slightly darker shade for active tabs
  },
});