import { View, Text } from 'react-native'
import React from 'react'
import BottomNavigation from '../components/BottomNavigation'

export default function TransactionScreen() {
  return (
    <View className="flex-1">
      <Text>TransactionScreen</Text>

      <BottomNavigation path="Transaction" />
    </View>
  )
}