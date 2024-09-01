import { View, Text, ScrollView, Image, TouchableOpacity, StatusBar } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BottomNavigation from "../components/BottomNavigation";
import BottomSheetProduct from "../components/BottomSheetProduct";
import { useSQLiteContext } from "expo-sqlite";
import Icon from "react-native-vector-icons/FontAwesome";
import ImgDefault from "../../assets/image.png";
import BottomSheetUpdateProduct from "../components/BottomSheetUpdateProduct";
import BottomSheetDeleteProduct from "../components/BottomSheetDeleteProduct";
import Animated, { FadeIn } from "react-native-reanimated";

export default function ProductScreen() {
  const db = useSQLiteContext();

  const [products, setProducts] = useState([]);
  const [updateProduct, setUpdateProduct] = useState({});
  const [deleteProduct, setDeleteProduct] = useState({});

  const fetch = async () => {
    try {
      const productStatement = await db.prepareAsync("SELECT * FROM products ORDER BY id DESC");
      const execProduct = await productStatement.executeAsync();
      const resProduct = await execProduct.getAllAsync();
      await productStatement.finalizeAsync()

      setProducts(resProduct);
      console.log(resProduct);
    } catch (error) {
      console.log("ERROR: ", error.message);
    } 
  };

  const formatRp = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const refRBSheet = useRef();
  const refRBSheetDelete = useRef();

  const handleUpdateSheet = (product) => {
    setUpdateProduct(product);
    refRBSheet.current.open();
  };

  const handleDeleteSheet = (product) => {
    setDeleteProduct(product);
    refRBSheetDelete.current.open();
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <View className="flex-1">
      <StatusBar barStyle={"light-content"} />
      <View className="mt-6 px-3 pb-[130px]">
      <View className="flex flex-row justify-center items-center gap-2">
      <BottomSheetProduct fetch={fetch} db={db} />
      <View className="mb-2">
      <TouchableOpacity onPress={fetch} className="bg-blue-500 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold text-[14px]"><Icon name="refresh" size={14} color={"#ffffff"} /> Refresh Data</Text>
        </TouchableOpacity>
      </View>
      </View>
        <View className="mt-4">
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
          >
            {products.map((product) => (
              <Animated.View entering={FadeIn.delay(800 / product.id)}
                key={product.id}
                className="flex-row justify-start items-start bg-white rounded-2xl p-2 mb-4 gap-2"
              >
                <View className="border-2 border-gray-100 rounded-lg">
                  <Image
                    source={
                      !product.image ? ImgDefault : { uri: product.image }
                    }
                    className="w-[104px] h-[104px] rounded-lg"
                  />
                </View>
                <View>
                  <Text className="text-lg font-bold text-neutral-800">
                    {product.name}
                  </Text>
                  <Text className="text-[15px] font-medium text-neutral-800">
                    Stok: {product.stock}
                  </Text>
                  <Text className="text-[15px] mb-2 font-medium text-neutral-800">
                    {formatRp(product.price)}
                  </Text>
                  <View className="flex flex-row justify-start items-center gap-2">
                    <TouchableOpacity
                      onPress={() => handleDeleteSheet(product)}
                      className="flex flex-row justify-center items-center bg-red-100 p-1 rounded"
                    >
                      <Icon name="trash" size={21} color={"#ef4444"} />
                      <Text className="font-semibold text-red-500">Hapus</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleUpdateSheet(product)}
                      className="flex flex-row justify-center items-center bg-green-100 p-1 rounded"
                    >
                      <Icon name="edit" size={21} color={"#22c55e"} />
                      <Text className="font-semibold text-green-500">Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </View>

      <BottomNavigation path="Product" />
      <BottomSheetUpdateProduct
        fetch={fetch}
        db={db}
        refRBSheet={refRBSheet}
        updateProduct={updateProduct}
      />
      <BottomSheetDeleteProduct
        fetch={fetch}
        db={db}
        refRBSheet={refRBSheetDelete}
        deleteProduct={deleteProduct}
      />
    </View>
  );
}
