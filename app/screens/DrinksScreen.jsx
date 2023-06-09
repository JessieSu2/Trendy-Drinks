import React, { Component, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
const Drink = (props) => {
  const [imageUrl, setImageUrl] = useState();
  const navigation = useNavigation();
  const name = props.name;
  const storekey = props.storekey;
  const drinkid = props.drinkid;
  console.log("Drink props::", props);
  const url = props.imageUrl;
  if (url) {
    const storageRef = ref(storage, `drinkImages/${url}`);
    getDownloadURL(storageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    const storageRef = ref(storage, `drinkImages/filler_icon.png`);
    getDownloadURL(storageRef)
      .then((url) => {
        setImageUrl(url);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  console.log("CoffeeShops::Shops", props);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Description", {
          selectedDrink: props,
          name: name,
          storekey: storekey,
          drinkid: drinkid,
        });
        console.log("DrinksScreen::Navigated to: Description");
      }}
    >
      <View style={styles.drink}>
        <View style={styles.image}>
          <Image
            source={{ uri: imageUrl }}
            style={{
              flex: 1,
              resizeMode: "contain",
              height: 100,
              width: 80,
              borderRadius: 5,
            }}
          />
        </View>
        <Text style={styles.text}>{name}</Text>
      </View>
    </TouchableOpacity>
  );
};

function Drinks({ route }) {
  const navigation = useNavigation();
  const [drinks, setDrinks] = useState([]);
  const path = route.params.mykey;
  console.log("DrinksScreen::Collection:", path);
  const RenderDrinks = () => {
    return drinks.map((item) => {
      console.log("drinks itme::", item);
      return (
        <Drink
          name={item.drinkname}
          id={item.id}
          storekey={path}
          key={item.key}
          drinkid={item.key}
          imageUrl={item.imageUrl}
        />
      );
    });
  };

  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#603C30" },
      headerTintColor: "#F8A621",
    });
    const drinksquery = collection(db, `/stores/${path}/drinks`);
    onSnapshot(drinksquery, (snapshot) => {
      let drinkslist = [];
      snapshot.docs.map((doc) =>
        drinkslist.push({ ...doc.data(), key: doc.id })
      );
      setDrinks(drinkslist);
      console.log(drinkslist);
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <RenderDrinks />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eacdb7",
  },
  drink: {
    justifyContent: "space-between",
    backgroundColor: "#603C30",
    padding: 15,
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    // color: "#EBDBCC",
    color: "#FFFFFF",
    marginLeft: 15,
    fontSize: 15,
    flex: 1,
  },
  image: {
    resizeMode: "contain",
  },
});

export default Drinks;
