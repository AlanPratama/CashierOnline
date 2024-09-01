import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductScreen from '../screens/ProductScreen';
import TransactionScreen from '../screens/TransactionScreen';
import CashierScreen from '../screens/CashierScreen';
import GettingStartedScreen from '../screens/GettingStartedScreen';
import HomeScreen from '../screens/HomeScreen';

const Tab = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
          <Tab.Screen name='Home' component={HomeScreen}/>
          <Tab.Screen name='GettingStarted' component={GettingStartedScreen}/>
          <Tab.Screen name='Product' component={ProductScreen}/>
          <Tab.Screen name='Cashier' component={CashierScreen}/>
          <Tab.Screen name='Transaction' component={TransactionScreen}/>
        </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;