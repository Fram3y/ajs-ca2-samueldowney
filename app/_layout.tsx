import { Stack } from 'expo-router/stack';
import { SessionProvider } from '@/contexts/AuthContext';

export default function Layout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SessionProvider>
  );
};
