// src/hooks/useGPS.ts
import { useState } from "react";

type Location = {
    latitude: number;
    longitude: number;
} | null;

type UseGPSReturn = {
    location: Location;
    error: string | null;
    getLocation: () => void;
};

const useGPS = (): UseGPSReturn => {
    const [location, setLocation] = useState<Location>(null);
    const [error, setError] = useState<string | null>(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setError(null); // Clear any existing errors
                },
                (err) => {
                    setError(`Error fetching location: ${err.message}`);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    };

    return { location, error, getLocation };
};

export default useGPS;
