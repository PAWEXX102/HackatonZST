import { initializeApp ,getApp,getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBRQmH0c2SgujZbPgAVBJkadqtdCi-jZGE",
  authDomain: "tidal-22798.firebaseapp.com",
  projectId: "tidal-22798",
  storageBucket: "tidal-22798.appspot.com",
  messagingSenderId: "179782453800",
  appId: "1:179782453800:web:514379c6a50145921c031d",
  measurementId: "G-ZMCNC8R8M4",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export const messaging = async () => {
  const supported = await isSupported();
  return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
  try {
    const fcmMessaging = await messaging();
    if (fcmMessaging) {
      const token = await getToken(fcmMessaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      });
      return token;
    }
    return null;
  } catch (err) {
    console.error("An error occurred while fetching the token:", err);
    return null;
  }
};
