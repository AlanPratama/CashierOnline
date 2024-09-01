import React, { useRef, useState } from 'react';
import { Button, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BottomSheetDeleteItem({ refRBSheet, deleteProduct, handleDeleteProduct }) {
    
  return (
    <View>
        {/* <TouchableOpacity
            onPress={() => refRBSheet.current.open()}
            className="bg-blue-600 flex flex-row justify-center items-center p-2 rounded-lg"
        >
            <Icon name="plus" size={22} color={"#ffffff"} />
            <Text className="text-white text-center ml-2 font-extrabold">
            TAMBAH PRODUK
            </Text>
        </TouchableOpacity> */}

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
            height: "30%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={150}
      >
        <DeleteProductComp refRBSheet={refRBSheet} deleteProduct={deleteProduct} handleDeleteProduct={handleDeleteProduct} />
      </RBSheet>
    </View>
  )
}



const DeleteProductComp = ({ refRBSheet, deleteProduct, handleDeleteProduct }) => {
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

          <View className="px-6 mb-4">
            <Text
            className="font-semibold capitalize text-lg text-neutral-800"
            >
              Apakah anda yakin ingin menghapus produk <Text className="text-red-500 font-bold">{deleteProduct.name}</Text> dari daftar kasir?
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 8,
              paddingHorizontal: 18,
              paddingBottom: 25,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#f6f6f6",
                flex: 1,
                paddingVertical: 14,
                borderRadius: 999,
              }}
              onPress={() => refRBSheet.current.close()}
            >
              <Text
                style={{
                  color: "#ef4444",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteProduct}
              style={{
                backgroundColor: "#ef4444",
                flex: 1,
                paddingVertical: 14,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Ya, Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  