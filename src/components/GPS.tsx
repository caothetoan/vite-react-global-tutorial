// src/components/GPS.tsx
import React from "react";
import useGPS from "../hooks/useGPS";

const GPS: React.FC = () => {
    const { location, error, getLocation } = useGPS();

    return (
        <div>
            <h2>Lấy vị trí GPS</h2>
            <button onClick={getLocation}>Lấy vị trí hiện tại</button>
            {location && (
                <p>
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default GPS;
