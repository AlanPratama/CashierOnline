import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Animated, { FadeIn } from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheetUpdateStore from "../components/BottomSheetUpdateStore";

export default function HomeScreen() {
  const [store, setStore] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalTransaction, setTotalTransaction] = useState(0);

  const [weeklyTransactions, setWeeklyTransactions] = useState([]);

  const [transactions, setTransactions] = useState([]);

  const db = useSQLiteContext();
  const refRbSheet = useRef(null);

  useEffect(() => {
    fetch();
    fetchWeeklyTransactions();
  }, []);

  // INSERT INTO products (name, description, price, stock) VALUES ('Pensil', 'Pensil', 2000, 10), ('Penghapus', 'Penghapus', 1000, 10), ('Penggaris', 'Penggaris', 5000, 10), ('Buku', 'Buku', 10000, 10), ('Indomie', 'indomie enak', 3000, 10);

  // INSERT INTO transactions (productId, quantity, totalPrice) VALUES (1, 1, 2000), (2, 1, 1000), (3, 1, 5000), (4, 1, 10000), (5, 1, 3000);

  //

  // INSERT INTO products (name, price, stock, image) VALUES ('Pensil', 2000, 10, 'https://up.yimg.com/ib/th?id=OIP.6eYNHX0BobYcUPXSsBPpRwHaHa&pid=Api&rs=1&c=1&qlt=95&w=119&h=119'), ('Penghapus', 1000, 10, 'https://up.yimg.com/ib/th?id=OIP.FQRPZKaiR06Xdm_vWYTsvQHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121'), ('Penggaris', 5000, 10, 'https://up.yimg.com/ib/th?id=OIP.oMVmJbxQotn1Ff8it6wvygHaHa&pid=Api&rs=1&c=1&qlt=95&w=121&h=121'), ('Buku', 10000, 10, 'https://tse2.mm.bing.net/th?id=OIP.cYX-rzSr-gN__qkb15LkQgHaHa&pid=Api&P=0&h=220'), ('Indomie', 3000, 10, 'https://up.yimg.com/ib/th?id=OIP.lS7O_2qVhdGY4gGuXHKEmAHaE7&pid=Api&rs=1&c=1&qlt=95&w=162&h=108');

  // INSERT INTO transactions (productId, codeTransaction, quantity, totalPrice) VALUES (1, 'ab12cd34', 1, 2000), (2, 'ab12cd34', 1, 1000), (3, 'bcde1234', 1, 5000), (4, 'klmn0213', 1, 10000), (5, 'opqrs1452', 1, 3000);

  const fetch = async () => {
    const storeStatement = await db.prepareAsync(
      "SELECT * FROM stores LIMIT 1"
    );
    const execStore = await storeStatement.executeAsync();
    const resStore = await execStore.getAllAsync();
    await storeStatement.finalizeAsync();

    console.log("resStore[0]: ", resStore[0]);
    setStore(resStore[0]);

    const profitStatement = await db.prepareAsync(
      "SELECT SUM(totalPrice) FROM transactions"
    );

    const totalTransactionStatement = await db.prepareAsync(
      "SELECT COUNT(DISTINCT codeTransaction) FROM transactions"
    );

    const transactionStatement = await db.prepareAsync(`
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
      WHERE 
        date(transactions.timestamps) = date('now')
      ORDER BY 
        transactions.timestamps DESC;
      `);

    try {
      const execTotalPr = await profitStatement.executeAsync();
      const execTotalTr = await totalTransactionStatement.executeAsync();
      const execTotalTran = await transactionStatement.executeAsync();

      const resPr = await execTotalPr.getAllAsync();
      const resTr = await execTotalTr.getAllAsync();
      const resTran = await execTotalTran.getAllAsync();

      await profitStatement.finalizeAsync();
      await totalTransactionStatement.finalizeAsync();
      await transactionStatement.finalizeAsync();

      setTotalProfit(resPr[0]["SUM(totalPrice)"]);
      setTotalTransaction(resTr[0]["COUNT(DISTINCT codeTransaction)"]);

      console.log('resPr[0]["SUM(totalPrice)"]: ', resPr[0]["SUM(totalPrice)"]);
      console.log(
        'resTr[0]["COUNT(DISTINCT codeTransaction)"]: ',
        resTr[0]["COUNT(DISTINCT codeTransaction)"]
      );

      setTransactions(resTran);

      // console.log("PROFIT: ", resPr[0]["SUM(totalPrice)"]);
      // console.log("TR: ", resTr[0]["COUNT(*)"]);
      // console.log("PRD: ", resPrd);
      // console.log("TRAN: ", resTran);
    } catch (error) {
      console.error("ERROR: ", error.message);
    }
  };

  const fetchWeeklyTransactions = async () => {
    try {
      const transactionStatement = await db.prepareAsync(`
        SELECT 
          DATE(timestamps) as transaction_date,
          SUM(totalPrice) as total_price,
          COUNT(*) as transaction_count
        FROM 
          transactions
        WHERE 
          timestamps >= datetime('now', '-7 days')
        GROUP BY 
          DATE(timestamps)
        ORDER BY 
          transaction_date;
      `);

      const execTransaction = await transactionStatement.executeAsync();

      const resTransaction = await execTransaction.getAllAsync();
      await transactionStatement.finalizeAsync();

      setWeeklyTransactions(resTransaction);

      // console.log("Weekly Transactions: ", resTransaction);
    } catch (error) {
      console.error("Error fetching weekly transactions:", error.message);
    }
  };

  const screenWidth = Dimensions.get("window").width;

  const data = {
    // labels: weeklyTransactions.map(transaction => transaction.transaction_date),
    datasets: [
      {
        data: weeklyTransactions.map((transaction) => transaction.total_price),
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: "#fb8c00",
    backgroundGradientTo: "#ffa726",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  const handleRefresh = () => {
    fetch();
    fetchWeeklyTransactions();
  };

  const handleSheetStore = () => {
    refRbSheet.current.open();
  };

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const { codeTransaction } = transaction;
    if (!acc[codeTransaction]) {
      acc[codeTransaction] = [];
    }
    acc[codeTransaction].push(transaction);
    return acc;
  }, {});

  const transactionsArray = Object.values(groupedTransactions);

  return (
    <>
      <ScrollView className="flex-1">
        <StatusBar style="auto" />
        <View className="mt-6">
          <Animated.View
            entering={FadeIn.delay(300)}
            className="px-3 pb-2 flex flex-wrap flex-row justify-between items-center gap-2"
          >
            <TouchableOpacity onPress={handleSheetStore}>
              <Text className="text-[18px] font-bold text-neutral-700">
                {store.name}
              </Text>
              <Text className="text-sm font-semibold text-neutral-700">
                Owner: {store.owner}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              className="bg-blue-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold text-[14px]">
                <Icon name="refresh" size={14} color={"#ffffff"} /> Refresh Data
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(400)}
            className="flex flex-row justify-evenly items-center gap-2 pt-2 px-3"
          >
            <View className="bg-blue-300 w-[48%] rounded-lg p-4 shadow-lg">
              <Text className="text-lg font-bold text-neutral-800">
                {totalTransaction}
              </Text>
              <Text className="text-lg font-medium text-neutral-800">
                Total Transaksi
              </Text>
            </View>

            <View className="bg-blue-300 w-[48%] rounded-lg p-4 shadow-lg">
              <Text className="text-lg font-bold text-neutral-800">
                Rp {totalProfit ? totalProfit.toLocaleString("id-ID") : 0}
              </Text>
              <Text className="text-lg font-medium text-neutral-800">
                Total Profit
              </Text>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(500)} className="my-4 px-3">
            <Text className="text-start text-lg font-bold mb-2 text-neutral-800">
              Statistik Selama 7 Hari
            </Text>
            <View className="flex justify-center items-center shadow-lg ">
              {weeklyTransactions.length > 0 && (
                <LineChart
                  style={{ borderRadius: 10 }}
                  data={data}
                  width={screenWidth - 20}
                  height={220}
                  chartConfig={chartConfig}
                  bezier
                />
              )}
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(700)}
            className="px-3 pb-[100px]"
          >
            <Text className="text-start text-lg font-bold mb-2 text-neutral-800">
              Transaksi Hari Ini
            </Text>
            <ScrollView horizontal>
              <View>
                {/* Header Tabel */}
                <View className="flex-row bg-gray-200 p-2 border-b border-gray-400">
                  <Text className="w-[180px] text-center font-bold">
                    Kode Transaksi
                  </Text>
                  <Text className="w-40 text-center font-bold">Produk</Text>
                  <Text className="w-24 text-center font-bold">Jumlah</Text>
                  <Text className="w-32 text-center font-bold">
                    Total Harga
                  </Text>
                  <Text className="w-48 text-center font-bold">Timestamp</Text>
                </View>

                {transactionsArray.length > 0 ? (
                  transactionsArray.map((group, groupIndex) =>
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
                  )
                ) : (
                  <View className="pb-4 rounded-lg bg-white flex justify-center items-center">
                    <Image
                      source={require("../../assets/notFound.png")}
                      alt="Tidak Ada Transaksi"
                      className="w-72 h-72"
                    />
                    <Text className="font-bold text-neutral-700 text-xl">
                      Tidak Ada Produk...
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </Animated.View>

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
      </ScrollView>
      <BottomSheetUpdateStore
        db={db}
        refRBSheet={refRbSheet}
        store={store}
        setStore={setStore}
      />
      <BottomNavigation path="Home" />
    </>
  );
}
