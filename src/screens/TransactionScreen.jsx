import { View, Text, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BottomNavigation from '../components/BottomNavigation'
import { useSQLiteContext } from 'expo-sqlite';
import BottomSheetTransactionFilter from '../components/BottomSheetTransactionFilter';
import Animated, { FadeIn } from "react-native-reanimated";
export default function TransactionScreen() {

  const [transactions, setTransactions] = useState([]);
  const db = useSQLiteContext()

  const fetch = async () => {
    try {
      const productStatement = await db.prepareAsync(`
      SELECT 
        transactions.codeTransaction,
        transactions.productId,
        products.name as productName,
        transactions.quantity,
        transactions.totalPrice,
        transactions.timestamps
      FROM 
        transactions
      JOIN 
        products 
      ON 
        transactions.productId = products.id
      ORDER BY 
        transactions.timestamps DESC;  
      `);
      const execProduct = await productStatement.executeAsync();
      const resProduct = await execProduct.getAllAsync();
      await productStatement.finalizeAsync()

      setTransactions(resProduct);
      console.log("TRANSACTIONS SCREEN FETCH SUCCESS:", resProduct);
    } catch (error) {
      console.log("ERROR: ", error.message);
    }
  }

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const { codeTransaction } = transaction;
    if (!acc[codeTransaction]) {
      acc[codeTransaction] = [];
    }
    acc[codeTransaction].push(transaction);
    return acc;
  }, {});
  
  const transactionsArray = Object.values(groupedTransactions);
  
  const refRBSheet = useRef(null)

    useEffect(() => {
      fetch()
    }, [])

  return (
    <View className="flex-1">
      <StatusBar barStyle={"light-content"} />

      <Animated.View entering={FadeIn.delay(100)} className='mt-6 px-3'>
        <View className="mb-3 flex flex-row justify-between items-center">
          <Text className="text-xl font-semibold text-neutral-800">Transaksi</Text>
          <TouchableOpacity onPress={() => refRBSheet.current.open()} className="bg-blue-500 px-4 py-2 rounded-lg"><Text className="text-white font-semibold">Filter</Text></TouchableOpacity>
        </View>
        <View className="pb-[200px]">
        <ScrollView className="" showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <ScrollView horizontal>
              <View>
                {/* Header Tabel */}
                <View className="flex-row bg-gray-200 p-2 border-b border-gray-400">
                  <Text className="w-[180px] text-center font-bold">Kode Transaksi</Text>
                  <Text className="w-40 text-center font-bold">Produk</Text>
                  <Text className="w-24 text-center font-bold">Jumlah</Text>
                  <Text className="w-32 text-center font-bold">Total Harga</Text>
                  <Text className="w-48 text-center font-bold">Timestamp</Text>
                </View>

                {
                  transactionsArray.map((group, groupIndex) => (
                    group.map((transaction, index) => (
                      <View
                        key={`${groupIndex}-${index}`}
                        className={`flex-row p-2 ${
                          groupIndex % 2 === 0 ? "bg-white" : "bg-gray-100"
                        }`}
                      >
                        <Text className="w-[180px] text-center">
                          {transaction.codeTransaction}
                        </Text>
                        <Text className="w-40 text-center">
                          {transaction.productName}
                        </Text>
                        <Text className="w-24 text-center">
                          {transaction.quantity}
                        </Text>
                        <Text className="w-32 text-center">
                          Rp {transaction.totalPrice.toLocaleString("id-ID")}
                        </Text>
                        <Text className="w-48 text-center">
                          {transaction.timestamps}
                        </Text>
                      </View>
                    ))
                  ))                            
                }
              </View>
            </ScrollView>
        </ScrollView>
        </View>
      </Animated.View>
      
      <BottomSheetTransactionFilter db={db} refRBSheet={refRBSheet} setTransactions={setTransactions} />
      <BottomNavigation path="Transaction" />
    </View>
  )
}