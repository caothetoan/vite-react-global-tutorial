import React, { useEffect, useState } from "react";

interface PushNotificationProps {
    vapidPublicKey: string;
}

const PushNotification: React.FC<PushNotificationProps> = ({ vapidPublicKey }) => {
    const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initServiceWorker = async () => {
            try {
                if (!navigator.serviceWorker) {
                    console.error("Service workers are not supported.");
                    return;
                }

                const swRegistration = await navigator.serviceWorker.register("/sw.js", {
                    scope: "https://dapp.vnit.top/",
                });
                const pushManager = swRegistration.pushManager;

                if (!pushManager) {
                    setError("PushManager is not active");
                    return;
                }

                const permission = await pushManager.permissionState({ userVisibleOnly: true });
                setPermissionState(permission);

                if (permission === "granted") {
                    const existingSubscription = await pushManager.getSubscription();
                    setSubscription(existingSubscription);
                }
            } catch (err) {
                console.error("Error initializing service worker:", err);
                setError("Failed to initialize service worker.");
            }
        };

        initServiceWorker();
    }, []);

    const subscribeToPush = async () => {
        try {
            const swRegistration = await navigator.serviceWorker.getRegistration();
            if (!swRegistration) {
                setError("Service worker registration not found.");
                return;
            }

            const pushManager = swRegistration.pushManager;
            const subscriptionOptions = {
                userVisibleOnly: true,
                applicationServerKey: vapidPublicKey,
            };

            const newSubscription = await pushManager.subscribe(subscriptionOptions);
            setSubscription(newSubscription);
            setError(null); // Clear any existing errors
        } catch (err) {
            console.error("Error subscribing to push notifications:", err);
            setError("User denied push permission.");
        }
    };

    const displaySubscriptionInfo = () => {
        if (!subscription) return null;

        return (
            <div>
                <h3>Active Subscription:</h3>
                <pre>{JSON.stringify(subscription.toJSON(), null, 2)}</pre>
            </div>
        );
    };

    const testSendNotification = async () => {
        const title = "Push title";
        const options = {
            body: "Additional text with some description",
            icon: "https://cdn.vnit.top/webpush/images/push_icon.jpg",
            image:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
            data: {
                url: "https://cdn.vnit.top/webpush/?page=success",
                message_id: "your_internal_unique_message_id_for_tracking",
            },
        };

        try {
            const swRegistration = await navigator.serviceWorker.ready;
            await swRegistration.showNotification(title, options);
        } catch (err) {
            console.error("Failed to send notification:", err);
            setError("Failed to send test notification.");
        }
    };

    const handleSetBadge = async (count: number) => {
        if ("setAppBadge" in navigator) {
            try {
                await (navigator as any).setAppBadge(count);
            } catch (err) {
                console.error("Failed to set app badge:", err);
                setError("Failed to set app badge.");
            }
        }
    };

    return (
        <div>
            <h2>Push Notification Demo</h2>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {permissionState === "prompt" && (
                <button onClick={subscribeToPush}>Subscribe to Notifications</button>
            )}

            {permissionState === "granted" && displaySubscriptionInfo()}

            {permissionState === "denied" && <p>User denied push permission.</p>}

            {subscription && (
                <>
                    <button onClick={testSendNotification}>Test Send Notification</button>
                    <button onClick={() => handleSetBadge(10)}>Set Badge</button>
                </>
            )}
        </div>
    );
};

export default PushNotification;
