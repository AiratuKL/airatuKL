// Lindungi halaman privat dan sinkronkan session Firebase.
document.documentElement.style.visibility='hidden';
window.AiratuFirebase.auth.onAuthStateChanged(async user=>{
 if(!user){localStorage.removeItem('airatu_user');location.replace('login.html');return;}
 let profile={uid:user.uid,displayName:user.displayName||'Pengguna AiratuKL',email:user.email||'',phoneNumber:user.phoneNumber||'',photoURL:user.photoURL||''};
 try{if(AiratuFirebase.db){const snap=await AiratuFirebase.db.collection('users').doc(user.uid).get();if(snap.exists)profile={...profile,...snap.data()};await AiratuFirebase.db.collection('users').doc(user.uid).set({status:'online',lastSeen:firebase.firestore.FieldValue.serverTimestamp()},{merge:true})}}catch(e){console.warn('Profil Firestore belum dapat dibaca:',e)}
 localStorage.setItem('airatu_user',JSON.stringify(profile));window.airatuCurrentUser=profile;document.documentElement.style.visibility='visible';window.dispatchEvent(new CustomEvent('airatu-auth-ready',{detail:profile}));
});
window.addEventListener('beforeunload',()=>{const u=window.airatuCurrentUser;if(u&&AiratuFirebase.db)AiratuFirebase.db.collection('users').doc(u.uid).set({status:'offline',lastSeen:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(()=>{})});
window.firebaseLogout=async()=>{const u=window.airatuCurrentUser;try{if(u&&AiratuFirebase.db)await AiratuFirebase.db.collection('users').doc(u.uid).set({status:'offline',lastSeen:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});await AiratuFirebase.auth.signOut()}finally{localStorage.removeItem('airatu_user');location.replace('login.html')}};
