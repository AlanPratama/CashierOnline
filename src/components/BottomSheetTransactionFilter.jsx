import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function BottomSheetTransactionFilter({ db, refRBSheet, setTransactions }) {
    
  return (
    <View>
        <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        draggable={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          draggableIcon: {
            backgroundColor: "gray",
            width: 100,
            height: 5,
            borderRadius: 5,
            marginVertical: 10,
          },
          container: {
            height: "60%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={250}
      >
        <TransactionFilterComp db={db} refRBSheet={refRBSheet} setTransactions={setTransactions} />
      </RBSheet>
    </View>
  )
}



const TransactionFilterComp = ({ fetch, db, refRBSheet, setTransactions }) => {

  const submit = async (filter) => {
    let query = `
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
    `;

    // Menambahkan kondisi filter berdasarkan parameter yang diterima
    switch (filter) {
      case "today":
        query += " WHERE date(transactions.timestamps) = date('now')";
        break;
      case "last3Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-3 days')";
        break;
      case "last7Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-7 days')";
        break;
      case "last14Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-14 days')";
        break;
      case "last30Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-30 days')";
        break;
      case "last90Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-90 days')";
        break;
      case "last180Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-180 days')";
        break;
      case "last365Days":
        query += " WHERE date(transactions.timestamps) >= date('now', '-365 days')";
        break;
      case "allDays":
      default:
        break;
    }

    query += " ORDER BY transactions.timestamps DESC"; 

    const productStatement = await db.prepareAsync(`
      ${query} 
      `);
      const execProduct = await productStatement.executeAsync();
      const resProduct = await execProduct.getAllAsync();
      await productStatement.finalizeAsync()

    setTransactions(resProduct);
    refRBSheet.current.close();
  };

    return (
      <ScrollView
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <View style={{ marginTop: 26 }}>
            <View className="px-[16px]">
              <TouchableOpacity onPress={() => submit("today")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">Hari Ini</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last3Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">3 Hari Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last7Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">1 Minggu Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last14Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">2 Minggu Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last30Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">1 Bulan Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last90Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">3 Bulan Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last180Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">6 Bulan Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("last365Days")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">1 Tahun Terakhir</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => submit("allDays")} className="bg-white border-2 border-gray-300 px-4 py-2 mb-3 rounded-[10px]">
                <Text className="text-neutral-600 font-semibold text-[18px] text-center">Seluruh Transaksi</Text>
              </TouchableOpacity>

            </View>
        </View>
      </ScrollView>
    );
  };
  