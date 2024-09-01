import { View, Text } from 'react-native';
import React from 'react';
import { Link } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BottomNavigation({ path }) {
  return (
    <View className="absolute bottom-0 pb-3 w-full flex flex-row justify-center items-center">
      <View className="border border-gray-100 shadow-lg w-[92%] bg-white py-3 rounded-full flex flex-row justify-evenly items-center mx-auto shadow-lg">
        
        {/* Home Link */}
        <Link to={"/Home"}>
          <View className={`flex justify-center items-center p-1.5 ${path === "Home" && "bg-blue-200 rounded-lg"}`}>
            <Icon name="home" size={24} color={path === "Home" ? "#1E40AF" : "#262626"} />
            <Text className={`font-bold text-sm ${path === "Home" ? "text-blue-600" : "text-neutral-800"}`}>Home</Text>
          </View>
        </Link>

        {/* Product Link */}
        <Link to={"/Product"}>
          <View className={`flex justify-center items-center p-1.5 ${path === "Product" && "bg-blue-200 rounded-lg"}`}>
            <Icon name="archive" size={20} color={path === "Product" ? "#1E40AF" : "#262626"} />
            <Text className={`font-bold text-sm ${path === "Product" ? "text-blue-600" : "text-neutral-800"}`}>Produk</Text>
          </View>
        </Link>

        {/* Cashier Link */}
        <Link to={"/Cashier"}>
          <View className={`flex justify-center items-center p-1.5 ${path === "Cashier" && "bg-blue-200 rounded-lg"}`}>
            <Icon name="money" size={20} color={path === "Cashier" ? "#1E40AF" : "#262626"} />
            <Text className={`font-bold text-sm ${path === "Cashier" ? "text-blue-600" : "text-neutral-800"}`}>Kasir</Text>
          </View>
        </Link>

        {/* Transaction Link */}
        <Link to={"/Transaction"}>
          <View className={`flex justify-center items-center p-1.5 ${path === "Transaction" && "bg-blue-200 rounded-lg"}`}>
            <Icon name="exchange" size={20} color={path === "Transaction" ? "#1E40AF" : "#262626"} />
            <Text className={`font-bold text-sm ${path === "Transaction" ? "text-blue-600" : "text-neutral-800"}`}>Transaksi</Text>
          </View>
        </Link>

      </View>
    </View>
  );
}
