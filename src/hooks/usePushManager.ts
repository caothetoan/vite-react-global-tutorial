// src/hooks/usePushNotification.ts
import { useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt";

interface usePushManagerProps {
    vapidPublicKey: string;
}

interface UsePushNotificationReturn {
    permissionState: PermissionState;
    subscription: PushSubscription | null;
    error: string | null;
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
    testSendNotification: () => Promise<void>;
    setBadge: (count: number) => Promise<void>;
}

const usePushManager = ({
    vapidPublicKey,
}: usePushManagerProps): UsePushNotificationReturn => {
    const [permissionState, setPermissionState] = useState<PermissionState>("prompt");
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initServiceWorker = async () => {
            try {
                if (!navigator.serviceWorker) {
                    setError("Service workers are not supported.");
                    return;
                }

                const swRegistration = await navigator.serviceWorker.register("/sw.js", {
                    scope: "https://dapp.vnit.top/",
                });

                const pushManager = swRegistration.pushManager;
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

    const subscribe = async () => {
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

    const unsubscribe = async () => {
        if (!subscription) {
            setError("No active subscription found.");
            return;
        }

        try {
            await subscription.unsubscribe();
            setSubscription(null);
            setError(null); // Clear any existing errors
        } catch (err) {
            console.error("Error unsubscribing from push notifications:", err);
            setError("Failed to unsubscribe.");
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

    const setBadge = async (count: number) => {
        if ("setAppBadge" in navigator) {
            try {
                await (navigator as any).setAppBadge(count);
            } catch (err) {
                console.error("Failed to set app badge:", err);
                setError("Failed to set app badge.");
            }
        }
    };

    return {
        permissionState,
        subscription,
        error,
        subscribe,
        unsubscribe,
        testSendNotification,
        setBadge,
    };
};

export default usePushManager;
