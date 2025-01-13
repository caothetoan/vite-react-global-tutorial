
// src/components/GPS.tsx
import React, { useState } from "react";

type Location = {
    latitude: number;
    longitude: number;
} | null;

const GPS: React.FC = () => {
    const [location, setLocation] = useState<Location>(null);

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error fetching location:", error);
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <h2>Lấy vị trí GPS</h2>
            <button onClick={getLocation}>Lấy vị trí hiện tại</button>
            {location && (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )}
        </div>
    );
};

export default GPS;