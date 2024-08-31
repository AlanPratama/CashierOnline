import { View, Text } from 'react-native'
import React from 'react'
import { Link } from '@react-navigation/native'

export default function BottomNavigation({ path }) {
  return (
    <View className="absolute bottom-0 pb-3 w-full flex flex-row justify-center items-center">
        <View className="w-[92%] bg-white py-3 rounded-full flex flex-row justify-evenly items-center mx-auto shadow-lg">
          
          <Link to={"/Home"}>
            <View className={`flex justify-center items-center p-1.5 ${path == "Home" && "bg-blue-200 rounded-lg"}`}>
              <Text className={`font-bold text-sm ${path === "Home" ? "text-blue-600" : "text-neutral-800"}`}>O</Text>
              <Text className={`font-bold text-sm ${path === "Home" ? "text-blue-600" : "text-neutral-800"}`}>Home</Text>
            </View>
          </Link>

          <Link to={"/Product"}>
            <View className={`flex justify-center items-center p-1.5 ${path == "Product" && "bg-blue-200 rounded-lg"}`}>
              <Text className={`font-bold text-sm ${path === "Product" ? "text-blue-600" : "text-neutral-800"}`}>O</Text>
              <Text className={`font-bold text-sm ${path === "Product" ? "text-blue-600" : "text-neutral-800"}`}>Product</Text>
            </View>
          </Link>

          <Link to={"/Cashier"}>
            <View className={`flex justify-center items-center p-1.5 ${path == "Cashier" && "bg-blue-200 rounded-lg"}`}>
              <Text className={`font-bold text-sm ${path === "Cashier" ? "text-blue-600" : "text-neutral-800"}`}>O</Text>
              <Text className={`font-bold text-sm ${path === "Cashier" ? "text-blue-600" : "text-neutral-800"}`}>Cashier</Text>
            </View>
          </Link>

          <Link to={"/Transaction"}>
            <View className={`flex justify-center items-center p-1.5 ${path == "Transaction" && "bg-blue-200 rounded-lg"}`}>
              <Text className={`font-bold text-sm ${path === "Transaction" ? "text-blue-600" : "text-neutral-800"}`}>O</Text>
              <Text className={`font-bold text-sm ${path === "Transaction" ? "text-blue-600" : "text-neutral-800"}`}>Transaction</Text>
            </View>
          </Link>

        </View>
      </View>
  )
}