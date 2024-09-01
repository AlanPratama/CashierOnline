import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { FadeIn } from "react-native-reanimated";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheetDeleteItem from "../components/BottomSheetDeleteItem";

export default function CashierScreen() {
  const rbSheet = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [errMessage, setErrMessage] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  const [productList, setProductList] = useState([]);
  const [buyProductList, setBuyProductList] = useState([]);
  const db = useSQLiteContext();

  const fetch = async () => {
    const productStatement = await db.prepareAsync("SELECT * FROM products;");
  
    try {
      const execProduct = await productStatement.executeAsync();
  
      const resProduct = await execProduct.getAllAsync();
  
      setProductList(resProduct);
    } catch (error) {
      console.error("ERROR: ", error.message);
    } finally {
      await productStatement.finalizeAsync();
    }
  };

  const handleSubmit = (product) => {
    if (quantity <= 0) {
      setErrMessage("Jumlah harus lebih dari 0");
      return;
    }

    if (selectedProduct === null) {
      setErrMessage("Pilih product terlebih dahulu");
      return;
    }

    const productObj = {
      ...product,
      quantity,
    };

    const newProductList = [...buyProductList, productObj];
    setBuyProductList(newProductList);
    setProductList(productList.filter((item) => item.id !== product.id));
    setTotalPrice(totalPrice + (product.price * quantity));

    setSelectedProduct(null);
    setQuantity(1);
    setErrMessage("");
  };

  const handleDeleteSheet = (deleteProduct) => {
    setDeleteProduct(deleteProduct);
    rbSheet.current.open()
  }
  const handleDeleteProduct = () => {
    setBuyProductList(buyProductList.filter((product) => product.id !== deleteProduct.id));
    setProductList([...productList, deleteProduct])
    setTotalPrice(totalPrice - (deleteProduct.price * deleteProduct.quantity))
    rbSheet.current.close()
  };

  const generateTransactionCode = () => {
    const timestamp = Date.now().toString(36);
    const randomString = Math.random().toString(36).slice(2, 10);
    return `TX-${timestamp}-${randomString}`.toUpperCase();
  };

  const handleSimpan = async () => {
    try {
      if (buyProductList.length < 1) {
        setErrMessage("Pilih product terlebih dahulu");
        return;
      }
      const transactionCode = generateTransactionCode();

      // await db.execAsync("BEGIN TRANSACTION;");

      for(const product of buyProductList) {
        const pre1 = await db.prepareAsync(`
          INSERT INTO transactions 
          (codeTransaction, productId, quantity, totalPrice) 
          VALUES 
          ('${transactionCode}', ${product.id}, ${product.quantity}, ${product.price * product.quantity});
        `);

        pre1.executeAsync();
        pre1.finalizeAsync();

        const pre2 = await db.prepareAsync(`
          UPDATE products SET stock = stock - ${product.quantity} WHERE id = ${product.id};  
        `)

        pre2.executeAsync();
        pre2.finalizeAsync();
        console.log("BERHASIL!");
      }

      // await db.execAsync("COMMIT;");

      setSelectedProduct(null);
      setQuantity(1);
      setErrMessage("");
      setBuyProductList([]);
      setTotalPrice(0);
      fetch()
      rbSheet.current.close();
    } catch (error) {
      console.log("ERROR: ", error.message);    
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  
  return (
    <View className="flex-1">
      <StatusBar barStyle={"light-content"} />
      <View entering={FadeIn.delay(300)} className="mt-6">
        <View className="px-4">
          <View className="mb-2">
            <View className="flex flex-row justify-between items-center gap-4 w-full">
              <View className="border border-gray-500 rounded-[10px] w-[70%]">
                <SelectDropdown
                  data={productList}
                  search={true}
                  defaultValue={selectedProduct}
                  onSelect={(selectedItem, index) => {
                    setSelectedProduct(selectedItem);
                    console.log(selectedItem, index);
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(selectedProduct && selectedItem.name) ||
                            "Pilih produk"}
                        </Text>
                        <Icon
                          name={isOpened ? "chevron-up" : "chevron-down"}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View
                        key={index}
                        style={{
                          ...styles.dropdownItemStyle,
                          ...(isSelected && { backgroundColor: "#D2D9DF" }),
                        }}
                      >
                        <Text style={styles.dropdownItemTxtStyle}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
              </View>
              <TextInput
                className="w-[25%] text-center"
                value={`${quantity}`}
                onChangeText={setQuantity}
                placeholder="Jumlah"
                keyboardType="numeric"
                style={{
                  padding: 10,
                  paddingHorizontal: 16,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              />
            </View>
            {errMessage && (
              <Text className="text-red-500 font-semibold text-sm">
                {errMessage}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => handleSubmit(selectedProduct)}
            className="w-full bg-blue-500 py-3.5 rounded-[10px]"
          >
            <Text className="text-white text-center font-bold">TAMBAH</Text>
          </TouchableOpacity>

          <View className="my-6">
            <Text className="text-lg font-bold text-neutral-800">
              TOTAL HARGA: <Text className="text-2xl">Rp {totalPrice.toLocaleString("id-ID")}</Text>
            </Text>
          </View>

          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="rounded-[10px] h-[370px]"
            >
              {buyProductList &&
                buyProductList.map((item, index) => {
                  return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleDeleteSheet(item)}
                        className="flex-row justify-between items-center my-4 bg-white rounded-2xl py-2 px-4 gap-2"
                      >
                        <View>
                          <Text className="text-lg font-bold text-neutral-800">
                            {item.name}
                          </Text>
                          <Text className="text-[15px] mb-2 font-medium text-neutral-800">
                            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                          </Text>
                        </View>
                        <Text className="font-bold text-xl">
                          {item.quantity}
                        </Text>
                      </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
          {
            buyProductList.length > 0 && (
              <TouchableOpacity onPress={() => handleSimpan()} className="mt-4 w-full bg-green-500 py-3.5 rounded-[10px]">
              <Text className="text-white font-bold text-sm text-center">
                SIMPAN
              </Text>
            </TouchableOpacity>
            )
          }
        </View>
      </View>

      <BottomSheetDeleteItem refRBSheet={rbSheet} deleteProduct={deleteProduct} handleDeleteProduct={handleDeleteProduct} />
      <BottomNavigation path="Cashier" />
    </View>
  );
}

const styles = StyleSheet.create({
  dropdownButtonStyle: {
    width: "100%",
    height: 50,
    backgroundColor: "transparent",
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});
