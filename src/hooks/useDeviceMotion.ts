import { useEffect, useState, useCallback } from 'react';

type DeviceMotionData = {
    acceleration: {
        x: number | null;
        y: number | null;
        z: number | null;
    } | null;
    rotationRate: {
        alpha: number | null;
        beta: number | null;
        gamma: number | null;
    } | null;
    interval: number;
};

type UseDeviceMotionHook = {
    motionData: DeviceMotionData | null;
    shakeDetected: boolean;
    error: Error | null;
    requestAccess: () => Promise<boolean>;
    revokeAccess: () => Promise<void>;
};

const SHAKE_THRESHOLD = 15;
let lastX: number | null = null;
let lastY: number | null = null;
let lastZ: number | null = null;
let lastTime = 0;

export const useDeviceMotion = (): UseDeviceMotionHook => {
    const [motionData, setMotionData] = useState<DeviceMotionData | null>(null);
    const [shakeDetected, setShakeDetected] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    const onDeviceMotion = (event: DeviceMotionEvent): void => {
        const currentTime = Date.now();

        if (event.accelerationIncludingGravity) {
            const { x, y, z } = event.accelerationIncludingGravity;
            setMotionData({
                acceleration: event.accelerationIncludingGravity,
                rotationRate: event.rotationRate || null,
                interval: event.interval,
            });

            if (lastX !== null && lastY !== null && lastZ !== null) {
                const deltaX = Math.abs(x - lastX);
                const deltaY = Math.abs(y - lastY);
                const deltaZ = Math.abs(z - lastZ);

                if ((deltaX + deltaY + deltaZ) > SHAKE_THRESHOLD && (currentTime - lastTime) > 100) {
                    setShakeDetected(true);
                    setTimeout(() => setShakeDetected(false), 2000);
                }
            }

            lastX = x;
            lastY = y;
            lastZ = z;
            lastTime = currentTime;
        }
    };

    const requestAccessAsync = async (): Promise<boolean> => {
        if (
            // @ts-ignore
            DeviceMotionEvent.requestPermission
            // @ts-ignore
            && typeof DeviceMotionEvent?.requestPermission === 'function') {
            let permission: PermissionState;
            try {
                // @ts-ignore
                permission = await DeviceMotionEvent.requestPermission();

            } catch (err) {
                // @ts-ignore
                const e = new Error((err && err.message) || 'unknown error');
                setError(e);
                return false;
            }
            if (permission !== 'granted') {
                setError(new Error('Request to access the device motion was rejected'));
                return false;
            }
        }

        window.addEventListener('devicemotion', onDeviceMotion);

        return true;
    };

    const revokeAccessAsync = async (): Promise<void> => {
        window.removeEventListener('devicemotion', onDeviceMotion);
        setMotionData(null);
    };

    const requestAccess = useCallback(requestAccessAsync, []);
    const revokeAccess = useCallback(revokeAccessAsync, []);

    useEffect(() => {
        return () => {
            revokeAccess();
        };
    }, [revokeAccess]);

    return { motionData, shakeDetected, error, requestAccess, revokeAccess };
};
