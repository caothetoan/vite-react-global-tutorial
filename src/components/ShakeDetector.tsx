// src/components/ShakeDetector.tsx
import React, { useEffect, useState } from "react";

type ShakeDetectorProps = {
    onShake: () => void;
};

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ onShake }) => {
    const [acceleration, setAcceleration] = useState<{ x: number; y: number; z: number } | null>(null);

    useEffect(() => {
        let lastX = 0;
        let lastY = 0;
        let lastZ = 0;
        let lastTime = 0;
        const threshold = 15; // Adjust to control shake sensitivity

        const handleMotion = (event: DeviceMotionEvent) => {
            const accel = event.accelerationIncludingGravity;
            if (!accel) return;

            const currentTime = Date.now();
            if (currentTime - lastTime > 100) { // Check at intervals
                const deltaX = accel.x ? accel.x - lastX : 0;
                const deltaY = accel.y ? accel.y - lastY : 0;
                const deltaZ = accel.z ? accel.z - lastZ : 0;

                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
                if (magnitude > threshold) {
                    onShake();
                }

                lastX = accel.x || 0;
                lastY = accel.y || 0;
                lastZ = accel.z || 0;
                lastTime = currentTime;
            }

            setAcceleration({ x: accel.x || 0, y: accel.y || 0, z: accel.z || 0 });
        };

        window.addEventListener("devicemotion", handleMotion);

        return () => {
            window.removeEventListener("devicemotion", handleMotion);
        };
    }, [onShake]);

    return (
        <div>
            <h2>Shake Detector</h2>
            {acceleration && (
                <p>
                    Acceleration - X: {acceleration.x.toFixed(2)}, Y: {acceleration.y.toFixed(2)}, Z: {acceleration.z.toFixed(2)}
                </p>
            )}
        </div>
    );
};

export default ShakeDetector;