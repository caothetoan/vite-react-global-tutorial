import React, { useEffect } from 'react';
import { useDeviceMotion } from '../hooks/useDeviceMotion';
import MotionSwitcher from './MotionSwitcher';

type ShakeDetectorProps = {
    onShake: () => void;
};

const ShakeDetector: React.FC<ShakeDetectorProps> = ({ onShake }) => {
    const { motionData, shakeDetected, error, requestAccess, revokeAccess } = useDeviceMotion();

    const onToggle = (toggleState: boolean): void => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const result = toggleState ? requestAccess() : revokeAccess();
    };
    const motionInfo = (
        <div className="mt-6">
            <p>{shakeDetected ? 'Shake detected!' : 'Try shaking your device!'}</p>
            <pre>{JSON.stringify(motionData, null, 2)}</pre>
        </div>
    )
    useEffect(() => {
        if (shakeDetected) {
            onShake();
        }
    }, [shakeDetected, onShake]);
    return (
        <div>
            <div>Shake Detector</div>
            <MotionSwitcher
                onToggle={onToggle}
                labelOff="Show motion"
                labelOn="Hide motion"
            />
            {error ? (
                <p style={{ color: 'red' }}>{error.message}</p>
            ) : null}
            {motionInfo}
        </div>
    );
};

export default ShakeDetector;
