"use strict";

// npm install web-push
const webpush = require("web-push");
// Public part of VAPID key, generation of that covered in README
// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
// You MUST need generate your own VAPID keys!
// Newer share your PRIVATE_VAPID_KEY. It should be stored in a safe storage
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

module.exports = {
  /*
   * Send a message to a device(s) or a topic.
   * @param {Object} entry - of type: see the attributes in schema ../server/content-types/fcm-notification/schema.json
   * @returns {Promise<any>}
   * */
  send: async (entry) => {
    console.log("send to webpush manager", entry);
    let payload = {
      title: entry.title,
    };

    if (entry.body) {
      payload.body = entry.body;
    }

    if (entry.image) {
      payload.image = entry.image;
    }

    if (entry.icon) {
      payload.icon = entry.icon;
    }

    if (entry.payload) {
      try {
        let jsonPayload = JSON.parse(entry.payload);
        payload = { ...payload, ...jsonPayload };
      } catch {
        console.log("parsing failed so sending without payload");
      }
    }
    const subscription = entry.subscription || {
      endpoint:
        "https://web.push.apple.com/QH48OkoA0jS4SOaeGZEqRwgTRXl340hsEqcc8ieg-Pn7sGLbc2d2ICgvSK0N-rFpFp6T0QJ2hvmUVPv48P_WlkDkQ5Oq3cejPbdP1wArG0Okce5e3FKCloWIWAO_ddFpj1RBsTjtGW1vTLRQmwcHO6dyTlIj8n5lAK-HZZnKyTY", //For desktop and mobile Safari:
      expirationTime: null,
      keys: {
        p256dh:
          "BGo3UQc6dOOuuhIYVjszTpTiEBnA8IpShYUtwy7sNVs9YVqfrdU1ZrY_oOyZdbXYfsjQW9W6DZdnA80il-PlbUw",
        auth: "jPwyxImZ5GCChn6-ojZxcw",
      },
    };
    let pushData = JSON.stringify(payload);
    let res = webpush.sendNotification(subscription, pushData);
    // console.log('payload', payload, 'target is ', entry.target);

    console.log("send to webpush res", JSON.stringify(res));
    return res;
  },
};
