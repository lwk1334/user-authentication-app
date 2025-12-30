import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


const Login = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Button title="Signup" onPress={() => { navigation.navigate("Signup") }} />
      <Button title="Login" onPress={() => { navigation.navigate("Home") }} />

    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})