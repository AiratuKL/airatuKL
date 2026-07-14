# AiratuKL

Aplikasi chat realtime modern dengan Firebase Authentication/Firestore/Storage, Socket.io, sistem level, EXP, reward, dan profil premium.

## Menjalankan proyek

1. Pasang **Node.js 18+**.
2. Buka terminal pada folder proyek:
   ```bash
   cd chatconnect
   npm install
   npm run dev
   ```
3. Buka `http://localhost:3000`. Tanpa Firebase, login berjalan dalam **mode demo** agar UI dapat langsung diuji.

## Konfigurasi Firebase

1. Buat proyek di [Firebase Console](https://console.firebase.google.com/), lalu tambahkan **Web App**.
2. Salin konfigurasi aplikasi ke `js/firebase.js`.
3. **Authentication → Sign-in method**: aktifkan Email/Password, Google, dan Phone.
4. Untuk OTP web, tambahkan domain produksi dan `localhost` ke **Authorized domains**. Firebase memakai reCAPTCHA; implementasi produksi perlu membuat `RecaptchaVerifier`, memanggil `signInWithPhoneNumber`, lalu `confirmationResult.confirm(code)`.
5. Buat Firestore Database dan Firebase Storage. Pilih region yang dekat dengan pengguna.

### Koleksi Firestore yang disarankan

- `users/{uid}`: profil, presence, `level`, `totalExp`, `wins`, `matches`, frame aktif.
- `rooms/{roomId}`: anggota, pinned message, waktu pembaruan.
- `rooms/{roomId}/messages/{messageId}`: sender, type, text/file URL, status, timestamps, reply.
- `matches/{matchId}`: peserta, pemenang, EXP acak, signature server.
- `users/{uid}/levelHistory/{id}`: level, reward, waktu.

### Security Rules awal (sesuaikan sebelum produksi)

```txt
rules_version = '2';
service cloud.firestore {
 match /databases/{db}/documents {
  match /users/{uid} { allow read: if request.auth != null; allow write: if request.auth.uid == uid; }
  match /rooms/{roomId} {
   allow read, write: if request.auth != null && request.auth.uid in resource.data.members;
   match /messages/{id} { allow read, create: if request.auth != null; allow update, delete: if request.auth.uid == resource.data.senderId; }
  }
  match /matches/{id} { allow read: if request.auth != null; allow write: if false; }
 }
}
```

Storage:
```txt
rules_version = '2';
service firebase.storage {
 match /b/{bucket}/o {
  match /profiles/{uid}/{file} { allow read: if true; allow write: if request.auth.uid == uid && request.resource.size < 5 * 1024 * 1024 && request.resource.contentType.matches('image/.*'); }
  match /chat/{room}/{file} { allow read, write: if request.auth != null && request.resource.size < 20 * 1024 * 1024; }
 }
}
```

> Catatan: rules room harus diperkuat dengan pengecekan membership memakai `get()`; rules Storage juga perlu dibedakan per tipe berkas.

## Sistem level

Kurva progresif dibuat di `js/profile.js`: level 0–50, mulai ±500 EXP dan berakhir 30.000 EXP. EXP kemenangan 100–500. **EXP wajib dihitung dan diberikan oleh server tepercaya/Cloud Functions**, bukan client, untuk mencegah manipulasi. Gunakan transaksi Firestore untuk memperbarui EXP, kemenangan, pertandingan, level, dan reward secara atomik.

Milestone frame: 0 Standard, 5 Silver, 10 Gold, 15 Emerald, 20 Sapphire, 25 Ruby, 30 Diamond, 35 Galaxy, 40 Mythic, 45 Legendary, 50 Supreme.

## Catatan produksi

- Helmet, rate limiting, payload limits, escaping pesan, dan HTTPS disiapkan/diwajibkan.
- Firebase Auth menangani hashing password; aplikasi tidak menyimpan password mentah.
- Tambahkan App Check, CSRF token untuk endpoint berbasis cookie, antivirus upload, image compression, logging, dan Redis adapter Socket.io untuk multi-instance.
- Persistensi pesan Firestore, crop via Cropper.js, GIF/sticker provider, WebRTC call, serta mesin LUDO authoritative adalah modul lanjutan; UI/hook-nya telah disiapkan, tetapi game/call lengkap membutuhkan server game dan signaling tersendiri.

## Konfigurasi proyek Firebase AiratuKL (wajib)

Konfigurasi Web App telah dimasukkan. Di Firebase Console proyek `airatukl`, aktifkan **Authentication → Sign-in method → Email/Password, Google, Phone**. Tambahkan `localhost` dan domain deployment ke **Authentication → Settings → Authorized domains**. Buat Firestore Database dan Storage, lalu pasang rules yang dijelaskan di atas. Google popup tidak dapat digunakan dengan membuka HTML melalui `file://`; jalankan `npm start` dan buka `http://localhost:3000`.

## Mengaktifkan Rules terbaru

Proyek menyertakan `firestore.rules` dan `storage.rules`. Salin isi masing-masing file ke Firebase Console → Firestore Database/Storage → tab **Rules**, lalu klik **Publish**. Rules ini memungkinkan pengguna yang sudah login membaca pesan, mengirim pesan miliknya, mengunggah lampiran maksimal 20 MB, dan memperbarui profil sendiri. Perketat membership room sebelum skala produksi.
