// Public part of VAPID key, generation of that covered in README
// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
// You MUST need generate your own VAPID keys!
// Newer share your PRIVATE_VAPID_KEY. It should be stored in a safe storage
const VAPID_PUBLIC_KEY =
  "BJGLpmIwUKXMJMKzqEhvhebzRFHqF90PomeQ3vHhAxxztvpje9eXs9ScIysLgkLVXOp9GulUv3hzNj9G16PdGlo";
const VAPID_PRIVATE_KEY = "90lkEXKc_Ax5URzGsIY_0s-cYdnqT6AO6lOyfwfhO0E";

// npm install web-push
const webpush = require("web-push");

webpush.setVapidDetails(
  "https://cdn.vnit.top/webpush/",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// CHANGE TO YOUR TOKEN FOR TEST
const pushSubscription = {
  endpoint: "https://fcm.googleapis.com/fcm/send/fXbyGY04zHY:APA91bE-EZI...", //for Google Chrome (FCM):
  //endpoint: "https://web.push.apple.com/QGuQyavXutnMH...",//For desktop and mobile Safari:
  expirationTime: null,
  keys: {
    p256dh: "BHqcQRz0HXwdZXZOT5GkQC_d5P1XFcevTkNPuJqh...",
    auth: "o3SJkOwZFr7deVnT98...",
  },
};
let pushData = JSON.stringify({
  title: "Push title",
  body: "Additional text with some description",
  icon: "https://cdn.vnit.top/webpush/images/favicon.png",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
  data: {
    url: "https://cdn.vnit.top/webpush/?page=success",
    message_id: "your_internal_unique_message_id_for_tracking",
  },
});
webpush.sendNotification(pushSubscription, pushData);
