import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useSQLiteContext } from 'expo-sqlite';

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [rows, setRows] = useState([]);
  const db = useSQLiteContext();

  // const db = 
  const fetch = async () => {

    const statement = await db.prepareAsync(
      'SELECT * FROM stores'
    );


    const items = await statement.executeAsync();
    const allRows = await items.getAllAsync()
    console.log(allRows);
    
    setRows(allRows)
  }


  const submit = async () => {

    console.log("aasas, ", name);
    console.log("aasasss, ", owner);

    await db.execAsync(
      `
      INSERT INTO stores (name, owner) VALUES ('${name}', '${owner}');
      `
    );
    setName("")
    setOwner("")

    fetch()
  }

  const update = async () => {
    await db.execAsync(`
      UPDATE stores SET name = '${name}', owner = '${owner}' WHERE id = 35;
      `)
    setName()
    setOwner()
    fetch()
  }

  const handleDelete = async (id) => {
    await db.execAsync(
      `
        DELETE FROM stores WHERE id = ${id}
      `
    )
    fetch()
  }
  

useEffect(() => {
  fetch()
}, [])

  return (
    <View className="flex-1 bg-gray-100 flex justify-center items-center">
        <StatusBar style='dark' />
        {
            rows.map((row, index) => <TouchableOpacity key={index} className="bg-[#f6f6f6] m-2 p-2" onPress={() => handleDelete(row.id)} ><Text className="text-black">{row.name} - {row.id} - {row.owner}</Text></TouchableOpacity>)
        }

        <TextInput className="text-black" placeholder='Name' value={name} onChangeText={setName}/>
        <TextInput className="text-black" placeholder='Owner' value={owner} onChangeText={setOwner}/>
        <TouchableOpacity onPress={update}><Text>SUBMIT</Text></TouchableOpacity>

        <Text className="text-white">ASASAS</Text>
    </View>
  )
}