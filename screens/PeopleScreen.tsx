import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Pressable, 
  Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGift } from '../context/GiftContext';
import { Ionicons } from '@expo/vector-icons';
import { Person } from '@/types';
import { Swipeable } from 'react-native-gesture-handler';

const PeopleScreen = () => {
  const navigation = useNavigation();
  const { people, deletePerson } = useGift();

  const sortedPeople = [...people].sort((a, b) => {
    const dateA = new Date(a.dob);
    const dateB = new Date(b.dob);
    return dateA.getMonth() - dateB.getMonth() || 
           dateA.getDate() - dateB.getDate();
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const renderItem = ({ item }: { item: Person }) => (
      <Swipeable
      renderRightActions={() => (
        <Button
          title="Delete"
          onPress={() => deletePerson(item.id)}
          color="red"
        />
      )}
    >
    <Pressable
      style={styles.personItem}
      onPress={() => navigation.navigate('Ideas', { personId: item.id })}
    >
      <View style={styles.personInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.date}>{formatDate(item.dob)}</Text>
      </View>
      <View style={styles.ideaCount}>
        <Text style={styles.ideaCountText}>
          {item.ideas.length} {item.ideas.length === 1 ? 'idea' : 'ideas'}
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </View>
    </Pressable>
    </Swipeable>
  );

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No people added yet!</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to add someone
      </Text>
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPerson')}
          style={styles.headerButton}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedPeople}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={EmptyList}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  personItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  personInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  ideaCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ideaCountText: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  headerButton: {
    marginRight: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

export default PeopleScreen;
