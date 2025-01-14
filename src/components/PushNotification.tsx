// src/components/PushNotification.tsx
import React from "react";
import usePushManager from "../hooks/usePushManager";

interface PushNotificationProps {
    vapidPublicKey: string;
}

const PushNotification: React.FC<PushNotificationProps> = ({ vapidPublicKey }) => {
    const {
        permissionState,
        subscription,
        error,
        subscribe,
        unsubscribe,
        testSendNotification,
        setBadge,
    } = usePushManager({ vapidPublicKey });

    return (
        <div>
            <h2>Push Notification Demo</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {permissionState === "prompt" && (
                <button onClick={subscribe}>Subscribe to Notifications</button>
            )}

            {permissionState === "granted" && (
                <>
                    <h3>Active Subscription:</h3>
                    <div>{JSON.stringify(subscription?.toJSON(), null, 2)}</div>
                    <button onClick={unsubscribe}>Unsubscribe</button>
                    <button onClick={testSendNotification}>Test Send Notification</button>
                    <button onClick={() => setBadge(10)}>Set Badge</button>
                </>
            )}

            {permissionState === "denied" && <p>User denied push permission.</p>}
        </div>
    );
};

export default PushNotification;
