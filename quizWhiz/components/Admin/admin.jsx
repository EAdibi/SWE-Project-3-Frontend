import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users from API or use mock data
    const mockUsers = [
      { id: 1, email: 'user1@example.com' },
      { id: 2, email: 'user2@example.com' },
      // ...more mock users
    ];
    setUsers(mockUsers);
  }, []);

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <Text>{item.email}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 10, backgroundColor: 'red', borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', margin: 10 }}>Admin Page</Text>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default Admin;