import React, { useState } from 'react';

import { useDeviceMotion } from '../hooks/useDeviceMotion';
import Toggle from './Toggle';
import Alert, { ErrorAlert } from './Alert';

type MotionSwitcherProps = {
    onToggle: (toggleState: boolean) => void,
    labelOn?: string,
    labelOff?: string,
};

const MotionSwitcher = (props: MotionSwitcherProps): React.ReactElement => {
    const { onToggle: onSwitchToggle, labelOn = 'Using Motion', labelOff = 'Use Motion' } = props;

    const {
        error,
        requestAccess,
        revokeAccess,
    } = useDeviceMotion();

    const [MotionAvailable, setMotionAvailable] = useState(false);

    const onToggle = (toggleState: boolean): void => {
        if (toggleState) {
            requestAccess().then((granted: boolean) => {
                if (granted) {
                    setMotionAvailable(true);
                } else {
                    setMotionAvailable(false);
                }
            });
        } else {
            revokeAccess().then(() => {
                setMotionAvailable(false);
            });
        }
        onSwitchToggle(toggleState);
    };

    const errorElement = error ? (
        <div className="mt-6">
            <Alert type={ErrorAlert}>{error.message}</Alert>
        </div>
    ) : null;

    return (
        <div>
            <Toggle
                onChange={onToggle}
                isOn={MotionAvailable}
                labelOff={labelOff}
                labelOn={labelOn}
            />
            {errorElement}
        </div>
    );
};

export default MotionSwitcher;