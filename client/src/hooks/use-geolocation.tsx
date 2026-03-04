import { useState, useEffect } from "react";

interface Position {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  position: Position | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        error: "Geolocation não é suportado neste navegador",
        loading: false,
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        position: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        error: null,
        loading: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = "Erro ao obter localização";
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Permissão de localização negada";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Localização indisponível";
          break;
        case error.TIMEOUT:
          errorMessage = "Timeout ao obter localização";
          break;
      }

      setState({
        position: null,
        error: errorMessage,
        loading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  const refreshPosition = () => {
    setState(prev => ({ ...prev, loading: true }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(prev => ({ ...prev, error: error.message, loading: false }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { ...state, refreshPosition };
}
