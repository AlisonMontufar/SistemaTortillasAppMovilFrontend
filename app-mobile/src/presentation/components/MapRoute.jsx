import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

export default function MapRoute({ destino, onArrive }) {
  const [location, setLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const markerRef = useRef(null);

  // Para animar la posición del marcador
  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.03,
      longitudeDelta: 0.03,
    })
  );

  // Función para geocodificar dirección a coordenadas
  const geocodeAddress = async (addressObj) => {
    try {
      const { calle, numero, ciudad, estado} = addressObj;
      const address = `${calle} ${numero}, ${ciudad}, ${estado}, Mexico`;
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        console.log('Dirección geocodificada:', { latitude: lat, longitude: lng });
        return { latitude: lat, longitude: lng };
      } else {
        console.warn('No se encontraron resultados para la dirección:', address);
      }
    } catch (error) {
      console.error('Error en geocodificación:', error);
      // Coordenadas por defecto (CDMX) si hay error
      return { latitude: 19.4326, longitude: -99.1332 };
    }
  };

  // Función para calcular la distancia entre dos coordenadas (en metros)
  const getDistance = (coord1, coord2) => {
    const R = 6371e3; // metros
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  useEffect(() => {
    let locationSubscription = null;
    let isMounted = true;

    const startWatchingLocation = async () => {
      try {
        setLoading(true);

        // 1. Geocodificar el destino si existe
        let finalDestinationCoords;
        if (destino && destino.calle) {
          console.log('Geocodificando destino:', destino);
          finalDestinationCoords = await geocodeAddress(destino);
        } else {
          console.log('Usando destino por defecto');
          finalDestinationCoords = { latitude: 19.4326, longitude: -99.1332 };
        }

        if (isMounted) {
          setDestinationCoords(finalDestinationCoords);
        }

        // 2. Obtener permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          alert('Se necesita permiso para acceder a la ubicación.');
          if (isMounted) setLoading(false);
          return;
        }

        // 3. Obtener ubicación actual
        const currentLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = currentLocation.coords;
        
        if (isMounted) {
          setLocation({ latitude, longitude });
        }

        // Inicializa coordenadas animadas
        coordinate.timing({
          latitude,
          longitude,
          duration: 0,
          useNativeDriver: false,
        }).start();

        // 4. Iniciar seguimiento de ubicación
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 2,
          },
          (newLocation) => {
            if (!isMounted) return;

            const { latitude, longitude } = newLocation.coords;
            const currentCoords = { latitude, longitude };
            setLocation(currentCoords);

            // Animar el marcador suavemente
            coordinate.timing({
              latitude,
              longitude,
              duration: 1500,
              useNativeDriver: false,
            }).start();

            // ✅ Checar si ya llegó al destino (por ejemplo, < 30 metros)
            if (finalDestinationCoords) {
              const distance = getDistance(currentCoords, finalDestinationCoords);
              console.log(`Distancia al destino: ${distance.toFixed(2)} metros`);
              
              if (distance < 30) {
                console.log("Repartidor ha llegado al destino");
                if (onArrive) onArrive(); // 👈 Notificar al padre
              }
            }
          }
        );

        if (isMounted) setLoading(false);

      } catch (error) {
        console.error('Error en MapRoute:', error);
        if (isMounted) setLoading(false);
      }
    };

    startWatchingLocation();

    return () => {
      isMounted = false;
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [destino]); // Se ejecuta cuando cambia el destino

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#083D56" />
        <Text style={styles.loadingText}>Calculando ruta...</Text>
      </View>
    );
  }

  if (!location || !destinationCoords) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#083D56" />
        <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation={false}
        followsUserLocation={true}
      >
        {/* Marcador animado del repartidor */}
        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate}
          title="Tu ubicación"
          description="Repartidor"
          pinColor="blue"
        />

        {/* Marcador de destino */}
        <Marker
          coordinate={destinationCoords}
          title="Destino de entrega"
          description={`${destino?.calle || 'Dirección'} ${destino?.numero || ''}`}
          pinColor="red"
        />

        {/* Línea de la ruta */}
        <MapViewDirections
          origin={location}
          destination={destinationCoords}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={5}
          strokeColor="#1E90FF"
          onError={errorMessage => console.warn('MapViewDirections Error: ', errorMessage)}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});