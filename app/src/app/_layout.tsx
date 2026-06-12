
import { useColorScheme } from 'react-native';

import { GalioProvider } from 'galio-framework';
import { nutrilensTheme } from '@/constants/galio';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GalioProvider theme={nutrilensTheme} mode={colorScheme}>
       
    </GalioProvider>
  );
}
