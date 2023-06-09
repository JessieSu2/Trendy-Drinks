import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import { auth, createUserDocument, db } from "../../firebase";
import { collection, getDatabase, ref, set } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { User } from "./ProfileScreen";
import LottieView from "lottie-react-native";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.replace("Home");
        console.log("Login::User uid: ", user.uid);
        this.userId = user.uid;
        console.log("Login::User id: ", this.userId);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    console.log("hel");
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(userCredentials);
        console.log(user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container} behavior="padding">
      <View>
        <LottieView
          autoPlay
          style={{
            width: 100,
            height: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
          source={require("../assets/44298-coffee-love.json")}
        />
      </View>
      <View style={styles.signIn}>
        <Text style={styles.signInText}>Sign In</Text>
      </View>
      {/*  */}
      <View style={styles.inputContainer}>
        {/* <View style={styles.userInput}>
          <TextInput
            placeholder="Username"
            value={displayName}
            onChangeText={(text) => setDisplayName(text)}
          />
        </View> */}
        <View style={styles.userInput}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.userInput}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        </View>
        {/*  */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.3}
            style={styles.buttons}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text style={[{ marginTop: 15 }, styles.subText]}>
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: "center" }}>
            <Text style={{ margin: 15 }}>or</Text>
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => {
                navigation.navigate("Home");
              }}
            >
              <Text>Skip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#eacdb7",
    justifyContent: "center",
  },
  signIn: {
    // backgroundColor: "yellow",
    textAlign: "center",
    alignItems: "center",
  },
  signInText: {
    fontSize: 20,
    fontWeight: "300",
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 20,
  },
  userInput: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttons: {
    width: "100%",
    backgroundColor: "#603C30",
    textAlign: "center",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonOutline: {
    marginTop: 5,
    borderColor: "#603C30",
    backgroundColor: "#EBDBCC",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonOutlineText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#603C30",
  },
  subText: {
    fontWeight: "700",
    color: "#603C30",
  },
});

export default Login;
