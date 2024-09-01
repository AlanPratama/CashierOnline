import React, { useRef, useState } from 'react';
import { Button, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function BottomSheetUpdateStore({ db, refRBSheet, store, setStore }) {
    
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
            height: "48%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={250}
      >
        <UpdateStoreComp db={db} refRBSheet={refRBSheet} store={store} setStore={setStore} />
      </RBSheet>
    </View>
  )
}



const UpdateStoreComp = ({ db, refRBSheet, store, setStore }) => {
    const [name, setName] = useState(store.name)
    const [owner, setOwner] = useState(store.owner)

    const submit = async () => {
        const statement = await db.prepareAsync(
          `UPDATE stores SET name = '${name}', owner = '${owner}';`
        )

        await statement.executeAsync();
        await statement.finalizeAsync();

        setStore({name, owner})

        refRBSheet.current.close()
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
              Nama Bisnis
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Masukkan Nama Bisnis...."
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
              Nama Owner
            </Text>
            <TextInput
              value={owner}
              onChangeText={setOwner}
              placeholder="Masukkan Nama Owner...."
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
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
  