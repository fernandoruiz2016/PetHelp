import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function IndexRoute() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  return <View className="flex-1 bg-slate-100" />;
}

