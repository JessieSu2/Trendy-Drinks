import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Icon } from "react-native-elements";
import { auth, db, storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  onSnapshot,
} from "firebase/firestore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { Platform } from "react-native";
const removeKeyIfEmpty = async (keyToRemove, favoriteStoreKeyPath, uid) => {
  if (uid) {
    try {
      const docRef = doc(db, "users", uid);
      const documentSnapshot = await getDoc(docRef);
      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        if (
          data &&
          data.favorites &&
          data.favorites[keyToRemove].length === 0
        ) {
          await updateDoc(docRef, {
            [`${favoriteStoreKeyPath}`]: deleteField(),
          });
          console.log("Array removed successfully");
        }
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("removeKeyIfEmpty::No account");
  }
};

const updateAddUserFavorites = async (drinkId, storeKey) => {
  const uid = auth.currentUser?.uid;
  if (uid) {
    const favoriteStoreKeyPath = `favorites.${storeKey}`;
    try {
      const docRef = doc(db, "users", uid);
      const documentSnapshot = await getDoc(docRef);
      const favorites = documentSnapshot.data().favorites;
      updateDoc(
        doc(db, "users", `${uid}`),
        {
          [`${favoriteStoreKeyPath}`]: arrayUnion(drinkId),
        },
        { merge: true }
      ).catch((error) => {
        console.log("couldnt update doc");
        alert(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("updateAddUserFav:: No Account");
  }
};

const updateRemoveUserFavorites = async (drinkId, storeKey) => {
  const uid = auth.currentUser?.uid;
  if (uid) {
    const favoriteStoreKeyPath = `favorites.${storeKey}`;
    try {
      updateDoc(
        doc(db, "users", `${uid}`),
        {
          [`${favoriteStoreKeyPath}`]: arrayRemove(drinkId),
        },
        { merge: true }
      ).catch((error) => {
        console.log("couldnt update doc");
        alert(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("updateRemoveUserFav::No account");
  }
};

const updateLiked = async (drinkId, liked) => {
  const uid = auth.currentUser?.uid;
  if (uid) {
    try {
      const docRef = doc(db, "favorites", uid);
      const documentSnapshot = await getDoc(docRef);
      console.log(documentSnapshot);
      updateDoc(
        doc(db, "favorites", `${uid}`),
        {
          [drinkId]: liked,
        },
        { merge: true }
      ).catch((error) => {
        console.log("updateLiked:: couldnt update doc");
        alert(error.message);
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("UpdateLiked::No account");
  }
};

const GetLikedData = async (selectedDrinkData) => {
  const currentUser = auth.currentUser?.uid;
  if (currentUser) {
    const docRef = doc(db, "favorites", `${currentUser}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      data = docSnap.data();
      console.log("GetLikedData", data[selectedDrinkData.drinkid]);
      if (data[selectedDrinkData.drinkid] == true) {
        return true;
      } else {
        return false;
      }
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
      return false;
    }
  } else {
    console.log("not logged in");
    return false;
  }
};

const DrinkDescription = ({ route }) => {
  const navigation = useNavigation();
  const uid = auth.currentUser?.uid;
  const [liked, setLiked] = useState(false);
  const [howTo, setHowTo] = useState("");
  const [showTo, setShowTo] = useState();
  const [imageUrl, setImageUrl] = useState();
  const selectedDrinkData = route.params.selectedDrink;
  const favoriteStoreKeyPath = `favorites.${selectedDrinkData.storekey}`;
  // console.log("DrinkDescription::route ", route);
  // console.log("DrinkDescription::DrinkName ", selectedDrinkData.name);
  const selectedDrinkName = selectedDrinkData.name;
  // console.log("DrinkDescriptionData::storkey", selectedDrinkData.storekey);
  // console.log("DrinkDescriptionData::drinkid", selectedDrinkData.drinkid);
  const isFocused = useIsFocused();
  useEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#603C30" },
      headerTintColor: "#F8A621",
    });
    const fetchData = async () => {
      try {
        if (isFocused) {
          const isLiked = await GetLikedData(selectedDrinkData);
          setLiked(isLiked);
          console.log("UseEffect", isLiked);
          const docRef = doc(
            db,
            `stores/${selectedDrinkData.storekey}/drinks`,
            `${selectedDrinkData.drinkid}`
          );
          const querySnapshot = await getDoc(docRef);
          const howToOrder = querySnapshot.get("howTo");
          setHowTo(howToOrder);
          // console.log(showTo);
          const showBaristaData = querySnapshot.get("showBarista");
          setShowTo(showBaristaData);
          const getImageUrl = querySnapshot.get("imageUrl");
          // console.log(getImageUrl);
          const storageRef = ref(storage, `drinkImages/${getImageUrl}`);
          if (getImageUrl) {
            const storageRef = ref(storage, `drinkImages/${getImageUrl}`);
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
        }
      } catch (error) {
        console.error(error);
        setLiked(false);
      }
    };

    fetchData();

    // Clean-up function here (if needed)
  }, [isFocused]);

  const toggleLike = () => {
    // Update the liked state67
    if (uid) {
      setLiked(!liked);
      console.log(!liked);
      if (!liked) {
        console.log("Added Favorites");
        updateAddUserFavorites(
          selectedDrinkData.drinkid,
          selectedDrinkData.storekey
        );
        updateLiked(selectedDrinkData.drinkid, !liked);
      } else {
        console.log("Removed Favorites");
        updateRemoveUserFavorites(
          selectedDrinkData.drinkid,
          selectedDrinkData.storekey
        );
        updateLiked(selectedDrinkData.drinkid, !liked);
        removeKeyIfEmpty(selectedDrinkData.storekey, favoriteStoreKeyPath, uid);
      }
    } else {
      if (Platform.OS == "ios") {
        Alert.alert(
          "Can't Favorite",
          "If you want to favorite a drink please make an account",
          [
            {
              text: "Ok",
              onPress: () => {},
            },
            {
              text: "Create an Account",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Can't Favorite",
          "If you want to favorite a drink please make an account",
          [
            {
              text: "Ok",
              style: "cancel",
            },
            {
              text: "Create an Account",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ],

          {
            cancelable: true,
            onDismiss: () =>
              Alert.alert(
                "This alert was dismissed by tapping outside of the alert dialog."
              ),
          }
        );
      }
    }
  };

  const TopSection = () => {
    return (
      <>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            // source={require("../assets/favicon.png")}
            source={{ uri: imageUrl }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.top}>
          {/* Drink Name */}
          <Text style={[styles.drinkName, styles.headingColor]}>
            {selectedDrinkName}
          </Text>
          <View style={styles.row1}>
            <View style={styles.row}>
              <Text>Recipe By:</Text>
              <View style={styles.username}>
                <Text style={{ color: "#FFFFFF" }}>CoffeeCraze</Text>
              </View>
            </View>
            <View style={styles.icon}>
              <TouchableOpacity onPress={toggleLike}>
                {liked ? (
                  <Icon name="favorite" color="#F8A621" underlayColor="black" />
                ) : (
                  <Icon name="favorite-outline" color="#F8A621" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.middle}>
          {/* Title */}
          <Text style={[styles.title, styles.headingColor]}>How To Order</Text>
          <Text>{howTo}</Text>
        </View>

        <Text style={styles.or}>or</Text>

        <View style={styles.bottom}>
          <Text style={[styles.title, styles.headingColor]}>
            Show The Barista
          </Text>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sizeOfColumn}>
        <FlatList
          contentContainerStyle={{ paddingBottom: 100 }}
          style={styles.bottom}
          showsVerticalScrollIndicator={false}
          data={showTo}
          renderItem={({ item }) => <Text>{`\u2043 ${item} `}</Text>}
          ListHeaderComponent={TopSection}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  // Whole container
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#eacdb7",
  },
  // Inner container
  sizeOfColumn: {
    paddingHorizontal: 10,
    // paddingBottom: 15,
  },
  // Image
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },

  image: {
    borderRadius: 15,
    height: 300,
    width: 200,
  },

  //Drink name + username
  top: {
    flexDirection: "column",
    paddingVertical: 15,
  },
  drinkName: {
    fontSize: 30,
    marginBottom: 10,
    fontWeight: 400,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  username: {
    backgroundColor: "#603C30",
    width: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    padding: 5,
    marginLeft: 10,
  },

  icon: {
    justifyContent: "space-evenly",
  },

  //HOW TO ORDER???
  middle: {
    paddingVertical: 15,
  },

  or: {},

  // SHOW BARISTA!!!
  bottom: {
    paddingTop: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: 500,
    paddingBottom: 5,
  },

  headingColor: {
    color: "#603C30",
  },
  textColor: {},
});
export default DrinkDescription;
