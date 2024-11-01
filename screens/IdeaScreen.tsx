import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useGift } from "../context/GiftContext";
import { Ionicons } from "@expo/vector-icons";

const IdeaScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { getPerson, deleteIdea } = useGift();
  // @ts-ignore
  const personId = route.params?.personId;
  const person = getPerson(personId);

  const handleDelete = (ideaId: string) => {
    Alert.alert("Delete Idea", "Are you sure you want to delete this idea?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteIdea(personId, ideaId);
          } catch (e) {
            Alert.alert("Error", "Failed to delete idea");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.ideaItem}>
      <Image
        source={{ uri: item.img }}
        style={[styles.image, { aspectRatio: item.width / item.height }]}
      />
      <View style={styles.ideaContent}>
        <Text style={styles.ideaText}>{item.text}</Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No gift ideas yet!</Text>
      <Text style={styles.emptySubtext}>Tap the + button to add an idea</Text>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: `${person?.name}'s Gift Ideas`,
      headerRight: () => (
        <TouchableOpacity
          // @ts-ignore
          onPress={() => navigation.navigate("AddIdea", { personId })}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, person]);

  return (
    <View style={styles.container}>
      <FlatList
        data={person?.ideas || []}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    flexGrow: 1,
    padding: 16,
  },
  ideaItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  image: {
    width: "100%",
    backgroundColor: "#f0f0f0",
  },
  ideaContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ideaText: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
  deleteButton: {
    padding: 8,
  },
  headerButton: {
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "50%",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
});

export default IdeaScreen;
