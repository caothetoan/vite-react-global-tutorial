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
  "https://dapp.vnit.top/",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// CHANGE TO YOUR TOKEN FOR TEST
// const pushSubscription = {
//   endpoint:
//     "https://fcm.googleapis.com/fcm/send/ejvRINwyQ38:APA91bHjxmQxvyiwUySHePbCJW5E9qLqjtjoSzlTvv0hJ46Xd6Nvk8uMsPESTrXpQnejD6hKOoIyhxlX6h8iWmaOf9xn5UxlDCprekoa82oSwUce6stu4mLkbHco3jfM1XwPEGWoRbWa",
//   expirationTime: null,
//   keys: {
//     p256dh:
//       "BOUzjUAOFSXtrMSbRtT0KExAiZMBpmhIiaVe6wxn_OBK98lFHEoykTQ35xiuFauCwaHdrUHL0PA8NE6R3x2RuGE",
//     auth: "12JQyh0gqCQmA3XhwVRN1w",
//   },
// };

const pushSubscription = {
  endpoint:
    "https://web.push.apple.com/QH48OkoA0jS4SOaeGZEqRwgTRXl340hsEqcc8ieg-Pn7sGLbc2d2ICgvSK0N-rFpFp6T0QJ2hvmUVPv48P_WlkDkQ5Oq3cejPbdP1wArG0Okce5e3FKCloWIWAO_ddFpj1RBsTjtGW1vTLRQmwcHO6dyTlIj8n5lAK-HZZnKyTY", //For desktop and mobile Safari:
  expirationTime: null,
  keys: {
    p256dh:
      "BGo3UQc6dOOuuhIYVjszTpTiEBnA8IpShYUtwy7sNVs9YVqfrdU1ZrY_oOyZdbXYfsjQW9W6DZdnA80il-PlbUw",
    auth: "jPwyxImZ5GCChn6-ojZxcw",
  },
};
let pushData = JSON.stringify({
  title: "Push title",
  body: "Additional text with some description",
  icon: "https://dapp.vnit.top//images/favicon.png",
  image:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg/1920px-Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg",
  data: {
    url: "https://dapp.vnit.top/?page=success",
    message_id: "your_internal_unique_message_id_for_tracking",
  },
});
webpush.sendNotification(pushSubscription, pushData);
