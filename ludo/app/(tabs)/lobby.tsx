import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

interface Room {
  id: string;
  name: string;
  betAmount: number;
  playerCount: number;
  maxPlayers: number;
}

export default function LobbyScreen() {
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data for now
  const [availableRooms] = useState<Room[]>([
    {
      id: '1',
      name: 'Beginners Room',
      betAmount: 10,
      playerCount: 2,
      maxPlayers: 4,
    },
    {
      id: '2',
      name: 'High Stakes',
      betAmount: 100,
      playerCount: 1,
      maxPlayers: 4,
    },
    {
      id: '3',
      name: 'Quick Game',
      betAmount: 25,
      playerCount: 3,
      maxPlayers: 4,
    },
  ]);

  const handleRefresh = () => {
    setRefreshing(true);
    // Refresh room list
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCreateRoom = () => {
    // TODO: Implement room creation
    router.push('/(game)/board');
  };

  const handleJoinRoom = (roomId: string) => {
    // TODO: Implement room joining
    router.push('/(game)/board');
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const renderRoomItem = ({ item: room }: { item: Room }) => (
    <View style={styles.roomCard}>
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomBet}>{formatCurrency(room.betAmount)}</Text>
      </View>
      
      <View style={styles.roomDetails}>
        <Text style={styles.roomPlayers}>
          Players: {room.playerCount}/{room.maxPlayers}
        </Text>
        
        <TouchableOpacity
          style={[
            styles.button,
            styles.joinButton,
            room.playerCount >= room.maxPlayers && styles.disabledButton
          ]}
          onPress={() => handleJoinRoom(room.id)}
          disabled={room.playerCount >= room.maxPlayers}
        >
          <Text style={[styles.buttonText, styles.joinButtonText]}>
            {room.playerCount >= room.maxPlayers ? 'Full' : 'Join'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Game Lobby</Text>
        <TouchableOpacity
          style={[styles.button, styles.createButton]}
          onPress={handleCreateRoom}
        >
          <Text style={[styles.buttonText, styles.createButtonText]}>
            Create Room
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={availableRooms}
        renderItem={renderRoomItem}
        keyExtractor={(item) => item.id}
        style={styles.roomsList}
        contentContainerStyle={styles.roomsListContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No rooms available</Text>
            <Text style={styles.emptySubtext}>Create a room to start playing!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7cd',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f97316',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#ffffff',
  },
  createButtonText: {
    color: '#f97316',
  },
  roomsList: {
    flex: 1,
  },
  roomsListContent: {
    padding: 16,
    gap: 12,
  },
  roomCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  roomBet: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f97316',
  },
  roomDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roomPlayers: {
    fontSize: 14,
    color: '#6b7280',
  },
  joinButton: {
    backgroundColor: '#22c55e',
    minWidth: 60,
  },
  joinButtonText: {
    color: '#ffffff',
  },
  disabledButton: {
    backgroundColor: '#d1d5db',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
