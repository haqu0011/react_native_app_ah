import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Person, Idea } from '../types';
import * as Crypto from 'expo-crypto';

interface GiftContextType {
  people: Person[];
  addPerson: (name: string, dob: string) => Promise<void>;
  addIdea: (personId: string, text: string, img: string, width: number, height: number) => Promise<void>;
  deleteIdea: (personId: string, ideaId: string) => Promise<void>;
  getPerson: (id: string) => Person | undefined;
  deletePerson: (id: string) => Promise<void>;
}

const GiftContext = createContext<GiftContextType | undefined>(undefined);

export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@giftr_people');
      if (jsonValue != null) {
        setPeople(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
  };

  const saveData = async (newPeople: Person[]) => {
    try {
      await AsyncStorage.setItem('@giftr_people', JSON.stringify(newPeople));
      setPeople(newPeople);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  const addPerson = async (name: string, dob: string) => {
    const newPerson: Person = {
      id: Crypto.randomUUID(),
      name,
      dob,
      ideas: [],
    };
    const newPeople = [...people, newPerson];
    await saveData(newPeople);
  };

  const addIdea = async (personId: string, text: string, img: string, width: number, height: number) => {
    const newIdea: Idea = {
      id: Crypto.randomUUID(),
      text,
      img,
      width,
      height,
    };
    
    const newPeople = people.map(person => 
      person.id === personId 
        ? { ...person, ideas: [...person.ideas, newIdea] }
        : person
    );
    await saveData(newPeople);
  };

  const deleteIdea = async (personId: string, ideaId: string) => {
    const newPeople = people.map(person =>
      person.id === personId
        ? { ...person, ideas: person.ideas.filter(idea => idea.id !== ideaId) }
        : person
    );
    await saveData(newPeople);
  };

  const getPerson = (id: string) => {
    return people.find(person => person.id === id);
  };

const deletePerson = async (personId : string) => {
  const updatedPeople = people.filter(p => p.id !== personId);
  setPeople(updatedPeople);
  await AsyncStorage.setItem('people', JSON.stringify(updatedPeople));
};

  return (
    <GiftContext.Provider value={{ people, addPerson, addIdea, deleteIdea, getPerson , deletePerson}}>
      {children}
    </GiftContext.Provider>
  );
};

export const useGift = () => {
  const context = useContext(GiftContext);
  if (context === undefined) {
    throw new Error('useGift must be used within a GiftProvider');
  }
  return context;
};
