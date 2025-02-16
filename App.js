import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';

const SCREEN_WIDTH = Dimensions.get('window').width;

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Atmosphere": "cloudy-gusts", 
  "Snow": "snow", 
  "Rain": "rains", 
  "Drizzle": "rain",
  "Thunderstorm": "lightning",
}

const API_KEY = "";

export default function App() {
  const [city, setCity] = useState("Loading......");
  const [days, setDays] = useState(null);
  const [main, setMain] = useState(null);
  const [ok, setOk] = useState(true);
  const ask = async() => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );
    setCity(location[0].city);
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await reponse.json();
    //console.log(json);
    setDays(json.weather[0]);
    //console.log(json.weather[0]);
    setMain(json.main);
    //console.log(json.main);
  }
  useEffect(() => {
    ask();
  }, []);
  return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView 
        pagingEnabled 
        horizontal 
        showsHorizontalScrollIndicator = "false"
        //indicatorStyle='white'
        contentContainerStyle={styles.weather}>
          {days === 0 ? 
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}}  />
          </View> : 
          <View style={styles.day}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Text style={styles.temp}>{parseFloat(main.temp).toFixed(1)}</Text>
              <Fontisto name={icons[days.main]} size={68} color="white" />
            </View>
            <Text style={styles.description}>{days.main}</Text>
            <Text style={styles.tinyText}>{days.description}</Text>
          </View>
          }
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    backgroundColor: "tomato",
  },
  city:{
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName:{
    fontSize: 68,
    fontWeight: "500",
    color: "white"
  },
  weather:{

  },
  day:{
    width: SCREEN_WIDTH,
    alignItems: "center",
    color: "white"
  },
  temp:{
    fontSize: 100,
    marginTop: 50,
    color: "white",
  },
  description:{
    fontSize: 40,
    marginTop: -10,
    color: "white",
  },
  tinyText:{
    fontSize: 30,
    color: "white",
  }
})

