import { View, Text, StatusBar, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import img from "../../assets/gettingStartedImage.png"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSQLiteContext } from 'expo-sqlite';
import { useNavigation } from '@react-navigation/native';

export default function GettingStartedScreen() {

    const [business, setBusiness] = useState("")
    const [owner, setOwner] = useState("")

    const navigate = useNavigation()
    const db = useSQLiteContext()

    const isStoreExist = async () => {
        const storeStatement = await db.prepareAsync("SELECT * FROM stores;");
        const execStore = await storeStatement.executeAsync();
        const resStore = await execStore.getAllAsync();
        await storeStatement.finalizeAsync();
    
        console.log("Store LALALALLA: ", resStore.length === 0);
    
        if(resStore.length > 0) {
          navigate.navigate("Home");
        }
    };

    const handleSubmit = async () => {
        if (business === "" || owner === "") {
            alert("Data tidak boleh kosong")
        }

        try {
            const storeStatement = await db.prepareAsync(
                `INSERT INTO stores (name, owner) VALUES ('${business}', '${owner}');`
            )

            await storeStatement.executeAsync();

            await storeStatement.finalizeAsync();

            console.log("STORE BERHASIL!!!!");

            navigate.navigate("Home")
        } catch (error) {
            console.log("ERROR: ", error.message);
            
        }
    }

    useEffect(() => {
        isStoreExist();
    }, [])

  return (
    <ScrollView className="flex-1">
        <StatusBar barStyle={"light-content"} />
        <View className="h-screen w-full bg-blue-500 flex justify-center items-center">
        <View className="w-72 mb-4">
                <Text className="text-2xl font-bold text-white">Selamat Datang Kak!</Text>
                <Text className="text-2xl font-bold text-white">Kenalan Dulu Yuk <Icon name='emoticon-wink-outline' size={24} /></Text>
            </View>
            <View>
                <TextInput
                    value={business}
                    onChangeText={setBusiness}
                    placeholder="Masukkan Nama Bisnis..."
                    className="w-72 h-12 px-4 py-2 my-2 border-1 bg-white border-gray-200 rounded-lg"
                />
                <TextInput
                    value={owner}
                    onChangeText={setOwner}
                    placeholder="Masukkan Nama Kamu..."
                    className="w-72 h-12 px-4 py-2 my-2 border-1 bg-white border-gray-200 rounded-lg"
                />
                <TouchableOpacity
                onPress={handleSubmit}
                disabled={business === "" || owner === ""}
                    className={`${business === "" || owner === "" ? "bg-gray-300 border-gray-300" : "bg-white border-gray-200"} border-1 w-72 px-4 py-4 my-2 rounded-lg`}
                >
                    <Text className="text-center font-bold text-blue-500 text-lg">{business === "" || owner === "" ? (null) : null} Mulai</Text>
                </TouchableOpacity>
            </View>

            <View className="mt-8 p-2 bg-white rounded-full">
                <Image source={img} className="w-72 h-72 p-4 rounded-full bg-white"/>
            </View>
        </View>
    </ScrollView>
  )
}