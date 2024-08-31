import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheetDeleteItem from "../components/BottomSheetDeleteItem";
import { useSQLiteContext } from "expo-sqlite";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
    const productStatement = await db.prepareAsync(`
      SELECT * FROM products;
    `);

    const execProduct = await productStatement.executeAsync();
    const resProduct = await execProduct.getAllAsync();
    setProductList(resProduct);
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

  const handleSimpan = async () => {
    if (buyProductList.length < 1) {
      setErrMessage("Pilih product terlebih dahulu");
      return;
    }
  
    setSelectedProduct(null);
    setQuantity(1);
    setErrMessage("");
    setBuyProductList([]);
    setTotalPrice(0);
    fetch()
    rbSheet.current.close();
  }

  const formatRp = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <View className="flex-1">
      <View className="mt-14">
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
                className="w-[25%]"
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
              TOTAL HARGA: <Text className="text-2xl">{formatRp(totalPrice)}</Text>
            </Text>
          </View>

          <View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="rounded-[10px] h-[350px]"
            >
              {buyProductList &&
                buyProductList.map((item) => {
                  return (
                    <>
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleDeleteSheet(item)}
                        className="flex-row justify-between items-center my-4 bg-white rounded-2xl py-2 px-4 gap-2"
                      >
                        <View>
                          <Text className="text-lg font-bold text-neutral-800">
                            {item.name}
                          </Text>
                          <Text className="text-[15px] mb-2 font-medium text-neutral-800">
                            {formatRp(item.price * item.quantity)}
                          </Text>
                        </View>
                        <Text className="font-bold text-xl">
                          {item.quantity}
                        </Text>
                      </TouchableOpacity>
                    </>
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
