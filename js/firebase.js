// Firebase Web App configuration — kredensial publik untuk SDK client.
const firebaseConfig = {
  apiKey: "AIzaSyBf0SIqD9svGHEl9lbss1Q_vMvEN8nNh1U",
  authDomain: "airatukl.firebaseapp.com",
  projectId: "airatukl",
  storageBucket: "airatukl.firebasestorage.app",
  messagingSenderId: "570606603035",
  appId: "1:570606603035:web:f97bbb5dbf094e8e0a61be",
  measurementId: "G-BJY71378R8"
};

let fb = { configured: false };
try {
  if (!window.firebase) throw new Error('Firebase SDK gagal dimuat. Pastikan internet aktif.');
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  fb = {
    configured: true,
    app: firebase.app(),
    auth: firebase.auth(),
    db: typeof firebase.firestore === 'function' ? firebase.firestore() : null,
    storage: typeof firebase.storage === 'function' ? firebase.storage() : null
  };
  // Session tetap aktif setelah browser ditutup.
  fb.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
} catch (error) {
  console.error('Firebase initialization error:', error);
  fb.error = error;
}
window.AiratuFirebase = fb;
