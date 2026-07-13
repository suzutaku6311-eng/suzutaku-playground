import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { destinations, type Destination, TOKYO_STATION } from './destinations';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './TokyoDistanceGame.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons for From/To
const fromIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const toIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Haversine formula
const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

interface GeocodeResult {
  lat: number;
  lon: number;
  name: string;
}

interface RouteData {
  distanceKm: number;
  coordinates: [number, number][]; 
  isFallback: boolean;
}

const MapBoundsFitter = ({ coordinates }: { coordinates: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordinates, map]);
  return null;
};

export const TokyoDistanceGame: React.FC = () => {
  const { t, language } = useLanguage();
  
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');

  // Map Input States
  const [fromCoord, setFromCoord] = useState<L.LatLng | null>(null);
  const [toCoord, setToCoord] = useState<L.LatLng | null>(null);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [userRoute, setUserRoute] = useState<RouteData | null>(null);
  const [userGeos, setUserGeos] = useState<{from: GeocodeResult, to: GeocodeResult} | null>(null);
  
  const [tokyoRoute, setTokyoRoute] = useState<RouteData | null>(null);
  const [matchedDest, setMatchedDest] = useState<Destination | null>(null);

  const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
      const data = await res.json();
      if (data && data.address) {
        return data.address.city || data.address.town || data.address.village || data.address.county || data.address.state || data.name || "Unknown Location";
      }
      return "Unknown Location";
    } catch (e) {
      console.error(e);
      return "Map Location";
    }
  };

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const isResetting = fromCoord && toCoord;
    
    if (isResetting) {
      // Optimistic visual clear
      setFromCoord(null);
      setToCoord(null);
    }

    setIsReverseGeocoding(true);
    const { lat, lng } = e.latlng;
    const name = await reverseGeocode(lat, lng);
    setIsReverseGeocoding(false);

    if (isResetting || !fromCoord) {
      setFromCoord(e.latlng);
      setFromLocation(name);
      if (isResetting) {
        setToCoord(null);
        setToLocation('');
      }
    } else if (!toCoord) {
      setToCoord(e.latlng);
      setToLocation(name);
    }
  };

  const InputMapEvents = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const geocode = async (query: string): Promise<GeocodeResult> => {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error(`Location not found: ${query}`);
    }
    return { 
      lat: parseFloat(data[0].lat), 
      lon: parseFloat(data[0].lon),
      name: data[0].display_name.split(',')[0]
    };
  };

  const getRoute = async (from: {lat: number, lon: number}, to: {lat: number, lon: number}): Promise<RouteData> => {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${from.lon},${from.lat};${to.lon},${to.lat}?overview=full&geometries=geojson`);
      const data = await res.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
        return {
          distanceKm: data.routes[0].distance / 1000,
          coordinates: coords,
          isFallback: false
        };
      }
    } catch (e) {
      console.error("Routing error", e);
    }
    
    return {
      distanceKm: getHaversineDistance(from.lat, from.lon, to.lat, to.lon),
      coordinates: [[from.lat, from.lon], [to.lat, to.lon]],
      isFallback: true
    };
  };

  const findClosestDestination = (distanceKm: number): Destination => {
    let closest = destinations[0];
    let minDiff = Math.abs(distanceKm - destinations[0].distanceKm);

    for (let i = 1; i < destinations.length; i++) {
      const diff = Math.abs(distanceKm - destinations[i].distanceKm);
      if (diff < minDiff) {
        minDiff = diff;
        closest = destinations[i];
      }
    }
    return closest;
  };

  useEffect(() => {
    if (fromCoord && toCoord && fromLocation && toLocation && !isLoading) {
      handleCalculate();
    }
  }, [toCoord]);

  const handleCalculate = async () => {
    if (!fromLocation.trim() || !toLocation.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setUserRoute(null);
    setTokyoRoute(null);
    setMatchedDest(null);

    try {
      // If user used map pins and hasn't changed text, we can use exact coords.
      // But text might have been edited. We will just use the geocoder for consistency, 
      // or use pins if text is exactly the reverse-geocoded string. 
      // For simplicity and accuracy, if pins exist, use them. Else geocode text.
      
      let fromGeo: GeocodeResult;
      if (fromCoord && fromLocation !== '') {
        fromGeo = { lat: fromCoord.lat, lon: fromCoord.lng, name: fromLocation };
      } else {
        fromGeo = await geocode(fromLocation);
      }

      let toGeo: GeocodeResult;
      if (toCoord && toLocation !== '') {
        toGeo = { lat: toCoord.lat, lon: toCoord.lng, name: toLocation };
      } else {
        toGeo = await geocode(toLocation);
      }

      setUserGeos({from: fromGeo, to: toGeo});

      const uRoute = await getRoute(fromGeo, toGeo);
      setUserRoute(uRoute);

      const closestDest = findClosestDestination(uRoute.distanceKm);
      setMatchedDest(closestDest);

      const tRoute = await getRoute(TOKYO_STATION, {lat: closestDest.lat, lon: closestDest.lon});
      setTokyoRoute(tRoute);

    } catch (err: any) {
      setError(t('tokyoDistance.error') || "Failed to calculate.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="distance-container">
        <div className="distance-header">
          <h1 className="distance-title">{t('tokyoDistance.title')}</h1>
          <p>{t('tokyoDistance.subtitle')}</p>
        </div>

        <div className="distance-input-group">
          
          <div className="input-map-container">
            <div className="input-map-header">
              <div className="input-map-hint">
                {!fromCoord ? (
                  <><span className="pin-indicator from"></span> {language === 'ja' ? '地図をクリックして「出発地」を指定' : 'Click map to set Start'}</>
                ) : !toCoord ? (
                  <><span className="pin-indicator to"></span> {language === 'ja' ? '地図をクリックして「目的地」を指定' : 'Click map to set End'}</>
                ) : (
                  <>{language === 'ja' ? '地点がセットされました！' : 'Locations set!'}</>
                )}
                {isReverseGeocoding && <span className="spinner" style={{width: '1rem', height: '1rem', borderTopColor: 'var(--accent-color)'}}></span>}
              </div>
            </div>
            <div className="input-map-wrapper">
              <MapContainer center={[51.5074, -0.1278]} zoom={5} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <InputMapEvents />
                {fromCoord && <Marker position={fromCoord} icon={fromIcon}><Popup>Start</Popup></Marker>}
                {toCoord && <Marker position={toCoord} icon={toIcon}><Popup>End</Popup></Marker>}
                {fromCoord && toCoord && (
                  <Polyline positions={[fromCoord, toCoord]} color="#64748b" weight={2} dashArray="5 5" />
                )}
              </MapContainer>
            </div>
          </div>

          <div className="input-row">
            <div className="input-field">
              <label>{t('tokyoDistance.from')}</label>
              <input 
                type="text" 
                placeholder="e.g. London" 
                value={fromLocation}
                onChange={(e) => { setFromLocation(e.target.value); setFromCoord(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              />
            </div>
            <div className="input-field">
              <label>{t('tokyoDistance.to')}</label>
              <input 
                type="text" 
                placeholder="e.g. Paris" 
                value={toLocation}
                onChange={(e) => { setToLocation(e.target.value); setToCoord(null); }}
                onKeyDown={(e) => e.key === 'Enter' && handleCalculate()}
              />
            </div>
          </div>
          {isLoading && (
            <div className="calculating-indicator">
              <span className="spinner"></span>
              <span>{t('tokyoDistance.calculating')}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {userRoute && tokyoRoute && matchedDest && userGeos && (
          <div className="distance-result-area">
            
            <div className="result-summary">
              <div className="result-distance">
                {Math.round(userRoute.distanceKm).toLocaleString()} km
              </div>
              <div className="result-equivalence">
                {t('tokyoDistance.resultMsg')}
              </div>
              <div className="result-tokyo">
                <span>{language === 'ja' ? '東京駅' : 'Tokyo Station'}</span>
                <span className="arrow">→</span>
                <span className="destination-highlight">
                  {language === 'ja' ? matchedDest.nameJa : matchedDest.nameEn}
                </span>
              </div>
              {(userRoute.isFallback || tokyoRoute.isFallback) && (
                <div className="fallback-message">
                  {t('tokyoDistance.fallbackMsg')}
                </div>
              )}
            </div>

            <div className="maps-grid">
              <div className="map-card">
                <h3 className="map-title">
                  {userGeos.from.name} → {userGeos.to.name}
                </h3>
                <div className="map-wrapper">
                  <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap'
                    />
                    <Polyline positions={userRoute.coordinates} color="#EF4444" weight={4} dashArray={userRoute.isFallback ? "8 8" : ""} />
                    <Marker position={userRoute.coordinates[0]} icon={fromIcon}>
                      <Popup>Start: {userGeos.from.name}</Popup>
                    </Marker>
                    <Marker position={userRoute.coordinates[userRoute.coordinates.length - 1]} icon={toIcon}>
                      <Popup>End: {userGeos.to.name}</Popup>
                    </Marker>
                    <MapBoundsFitter coordinates={userRoute.coordinates} />
                  </MapContainer>
                </div>
              </div>

              <div className="map-card">
                <h3 className="map-title">
                  {language === 'ja' ? '東京駅' : 'Tokyo Station'} → {language === 'ja' ? matchedDest.nameJa : matchedDest.nameEn}
                </h3>
                <div className="map-wrapper">
                  <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenStreetMap'
                    />
                    <Polyline positions={tokyoRoute.coordinates} color="#3B82F6" weight={4} dashArray={tokyoRoute.isFallback ? "8 8" : ""} />
                    <Marker position={tokyoRoute.coordinates[0]} icon={fromIcon}>
                      <Popup>Start: {language === 'ja' ? '東京駅' : 'Tokyo Station'}</Popup>
                    </Marker>
                    <Marker position={tokyoRoute.coordinates[tokyoRoute.coordinates.length - 1]} icon={toIcon}>
                      <Popup>End: {language === 'ja' ? matchedDest.nameJa : matchedDest.nameEn}</Popup>
                    </Marker>
                    <MapBoundsFitter coordinates={tokyoRoute.coordinates} />
                  </MapContainer>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
