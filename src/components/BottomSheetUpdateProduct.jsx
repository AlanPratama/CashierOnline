import React, { useRef, useState } from 'react';
import { Button, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BottomSheetUpdateProduct({ fetch, db, refRBSheet, updateProduct }) {
    
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
            height: "72%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={250}
      >
        <UpdateProductComp fetch={fetch} db={db} refRBSheet={refRBSheet} updateProduct={updateProduct} />
      </RBSheet>
    </View>
  )
}



const UpdateProductComp = ({ fetch, db, refRBSheet, updateProduct }) => {
    const [name, setName] = useState(updateProduct.name)
    const [price, setPrice] = useState(updateProduct.price)
    const [stock, setStock] = useState(updateProduct.stock)
    const [imageLink, setImageLink] = useState(updateProduct.image)

    const submit = async () => {
        await db.execAsync("BEGIN TRANSACTION;");

        await db.execAsync(`
            UPDATE products SET name = '${name}', price = ${price}, stock = ${stock}, image = '${imageLink}' WHERE id = ${updateProduct.id};
        `)

        await db.execAsync("COMMIT;");     

        refRBSheet.current.close()
        fetch()
    }

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
          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Nama Product
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Masukkan Nama Product...."
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View>

          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Harga Product
            </Text>
            <TextInput
              value={`${price}`}
              onChangeText={setPrice}
              placeholder="Masukkan Harga Product...."
              keyboardType='numeric'
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View>

          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Stok Product
            </Text>
            <TextInput
                value={`${stock}`}
                onChangeText={setStock}
              placeholder="Masukkan Stok Product...."
              keyboardType='numeric'
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View>
  
          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
            Link Gambar (Opsional. Note: Link Wajib Diawali Dengan https://)
            </Text>
            <TextInput
                value={imageLink}
                onChangeText={setImageLink}
              placeholder="Masukkan Link Gambar Product...."
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View>

          {/* <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Deskripsi Product (Opsional)
            </Text>
            <TextInput
              placeholder="Masukkan Deskripsi Product...."
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
          </View> */}
  
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
                  color: "#3b82f6",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              style={{
                backgroundColor: "#3b82f6",
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
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  