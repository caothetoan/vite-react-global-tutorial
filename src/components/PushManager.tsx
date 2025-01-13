import React, { useEffect, useState } from "react";

interface PushNotificationProps {
    vapidPublicKey: string;
}

const PushNotification: React.FC<PushNotificationProps> = ({ vapidPublicKey }) => {
    const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isStandalone, setIsStandalone] = useState<boolean>(false);

    useEffect(() => {
        const checkStandaloneMode = () => {
            setIsStandalone(!!(window.navigator as any).standalone);
        };

        const initServiceWorker = async () => {
            try {
                if (!navigator.serviceWorker) {
                    console.error("Service workers are not supported.");
                    return;
                }

                const swRegistration = await navigator.serviceWorker.register(
                    "/sw.js",
                    { scope: "https://dapp.vnit.top/" }
                );

                const pushManager = swRegistration.pushManager;

                if (!isPushManagerActive(pushManager)) {
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

        checkStandaloneMode();
        initServiceWorker();
    }, []);

    const isPushManagerActive = (pushManager: PushManager | undefined): boolean => {
        if (!pushManager) {
            if (!isStandalone) {
                return false;
            } else {
                throw new Error("PushManager is not active.");
            }
        }
        return true;
    };

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

    const displaySubscriptionInfo = () => {
        if (!subscription) return null;

        return (
            <div>
                <h3>Active Subscription:</h3>
                <pre>{JSON.stringify(subscription.toJSON(), null, 2)}</pre>
            </div>
        );
    };

    return (
        <div id="content">
            {!isStandalone && (
                <div id="add-to-home-screen">
                    For WebPush to work, you may need to add this website to your Home Screen on iPhone or iPad.
                    <img src="images/webpush-add-to-home-screen.jpg" alt="Add to Home Screen" />
                </div>
            )}

            <div id="scan-qr-code">
                Open this page on your iPhone/iPad:
                <img src="images/qrcode.png" alt="QR Code" />
            </div>

            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {permissionState === "prompt" && (
                <button id="subscribe_btn" onClick={subscribeToPush}>
                    Subscribe to Notifications
                </button>
            )}

            {permissionState === "granted" && displaySubscriptionInfo()}

            {permissionState === "denied" && <p>User denied push permission.</p>}

            {subscription && (
                <button id="test_send_btn" onClick={testSendNotification}>
                    Send Test Push
                </button>
            )}
        </div>
    );
};

export default PushNotification;
