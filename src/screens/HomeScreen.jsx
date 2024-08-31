import { Link } from "@react-navigation/native";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import BottomNavigation from "../components/BottomNavigation";

export default function HomeScreen() {
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);

  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const db = useSQLiteContext();

  // INSERT INTO products (name, description, price, stock) VALUES ('Pensil', 'Pensil', 2000, 10), ('Penghapus', 'Penghapus', 1000, 10), ('Penggaris', 'Penggaris', 5000, 10), ('Buku', 'Buku', 10000, 10), ('Indomie', 'indomie enak', 3000, 10);

  // INSERT INTO transactions (productId, quantity, totalPrice) VALUES (1, 1, 2000), (2, 1, 1000), (3, 1, 5000), (4, 1, 10000), (5, 1, 3000);

  // 

  // INSERT INTO products (name, price, stock, image) VALUES ('Pensil', 2000, 10, 'https://up.yimg.com/ib/th?id=OIP.6eYNHX0BobYcUPXSsBPpRwHaHa&pid=Api&rs=1&c=1&qlt=95&w=119&h=119'), ('Penghapus', 1000, 10, 'https://up.yimg.com/ib/th?id=OIP.FQRPZKaiR06Xdm_vWYTsvQHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121'), ('Penggaris', 5000, 10, 'https://up.yimg.com/ib/th?id=OIP.oMVmJbxQotn1Ff8it6wvygHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121'), ('Buku', 10000, 10, 'https://tse2.mm.bing.net/th?id=OIP.cYX-rzSr-gN__qkb15LkQgHaHa&pid=Api&P=0&h=220'), ('Indomie', 3000, 10, 'https://up.yimg.com/ib/th?id=OIP.lS7O_2qVhdGY4gGuXHKEmAHaE7&pid=Api&rs=1&c=1&qlt=95&w=162&h=108');

  // INSERT INTO transactions (productId, codeTransaction, quantity, totalPrice) VALUES (1, 'ab12cd34', 1, 2000), (2, 'ab12cd34', 1, 1000), (3, 'bcde1234', 1, 5000), (4, 'klmn0213', 1, 10000), (5, 'opqrs1452', 1, 3000);

  const fetch = async () => {
    const profitStatement = await db.prepareAsync(
      "SELECT SUM(totalPrice) FROM transactions"
    );

    const totalTransactionStatement = await db.prepareAsync(
      "SELECT COUNT(*) FROM transactions"
    );

    const productStatement = await db.prepareAsync("SELECT * FROM products");
 
    const transactionStatement = await db.prepareAsync(
      "SELECT * FROM transactions"
    );

    const execTotalPr = await profitStatement.executeAsync();
    const execTotalTr = await totalTransactionStatement.executeAsync();
    const execTotalPrd = await productStatement.executeAsync();
    const execTotalTran = await transactionStatement.executeAsync();

    const resPr = await execTotalPr.getAllAsync();
    const resTr = await execTotalTr.getAllAsync();
    const resPrd = await execTotalPrd.getAllAsync();
    const resTran = await execTotalTran.getAllAsync();
    
    setTotalProfit(resPr[0]["SUM(totalPrice)"]);
    setTotalTransaction(resTr[0]["COUNT(*)"]);
    setProducts(resPrd);
    setTransactions(resTran);

    console.log("PROFIT: ", resPr[0]["SUM(totalPrice)"]);
    console.log("TR: ", resTr[0]["COUNT(*)"]);
    console.log("PRD: ", products);
    console.log("TRAN: ", transactions);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <View className="flex-1">  
      <View className="mt-14">

        <View className="px-3 pb-2">
          <Text className="text-2xl font-semibold text-neutral-800">O Warkop</Text>
        </View>

        <View className="flex flex-row justify-evenly items-center gap-2 pt-2 px-3">
          <View className="bg-blue-300 w-[48%] rounded-lg p-4 shadow-lg">
            <Text className="text-lg font-bold text-neutral-800">{totalTransaction}</Text>
            <Text className="text-lg font-medium text-neutral-800">Total Transaksi</Text>
          </View>

          <View className="bg-blue-300 w-[48%] rounded-lg p-4 shadow-lg">
            <Text className="text-lg font-bold text-neutral-800">{totalProfit}</Text>
            <Text className="text-lg font-medium text-neutral-800">Total Profit</Text>
          </View>
        </View>

        {/* <Image source={} className="w-40 h-40" /> */}
        {/* {
          products.map((product) => {
            return (
              <View className="bg-white p-4 rounded-lg shadow-lg">
                <Text className="text-lg font-bold text-neutral-800">{product.name}</Text>
                <Text className="text-lg font-medium text-neutral-800">{product.description}</Text>
                <Text className="text-lg font-medium text-neutral-800">{product.price}</Text>
                <Text className="text-lg font-medium text-neutral-800">{product.stock}</Text>
              </View>
            )
          })
        } */}
      </View>

      <BottomNavigation path="Home" />
    </View>
  );
}
