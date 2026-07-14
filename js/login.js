const fb = window.AiratuFirebase;
const busy = (button, state, label='Memproses…') => { if(!button)return; if(state){button.dataset.old=button.innerHTML;button.innerHTML=label;button.disabled=true}else{button.innerHTML=button.dataset.old||button.innerHTML;button.disabled=false} };
function saveUser(user, extra={}) {
  const data={uid:user.uid,displayName:user.displayName||extra.displayName||'Pengguna AiratuKL',email:user.email||'',phoneNumber:user.phoneNumber||'',photoURL:user.photoURL||'',...extra};
  localStorage.setItem('airatu_user',JSON.stringify(data));
  location.replace('chat.html');
}
async function ensureProfile(user, extra={}){
  if(!fb.db)return saveUser(user,extra);
  try{const ref=fb.db.collection('users').doc(user.uid), snap=await ref.get();
   if(!snap.exists) await ref.set({uid:user.uid,name:user.displayName||extra.displayName||'Pengguna AiratuKL',username:extra.username||`user_${user.uid.slice(0,7)}`,email:user.email||'',phone:user.phoneNumber||'',photoURL:user.photoURL||'',bio:'Hai, saya menggunakan AiratuKL!',status:'online',level:0,totalExp:0,wins:0,matches:0,role:'user',createdAt:firebase.firestore.FieldValue.serverTimestamp()});
   const profile=(await ref.get()).data(); return saveUser(user,profile);
  }catch(error){console.warn('Firestore belum siap, login tetap dilanjutkan:',error);return saveUser(user,extra)}
}

document.getElementById('loginForm')?.addEventListener('submit',async e=>{
 e.preventDefault(); const btn=e.submitter,email=e.target.email.value.trim(),password=e.target.password.value;
 busy(btn,true,'Masuk…');
 try{if(!fb.configured)throw new Error('Firebase tidak tersedia. Jalankan lewat http://localhost:3000 dan periksa internet.');const result=await fb.auth.signInWithEmailAndPassword(email,password);await ensureProfile(result.user)}catch(err){App.toast(readable(err),'danger');busy(btn,false)}
});

document.getElementById('googleLogin')?.addEventListener('click',async e=>{
 const btn=e.currentTarget;busy(btn,true,'Membuka Google…');
 try{const provider=new firebase.auth.GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});const result=await fb.auth.signInWithPopup(provider);await ensureProfile(result.user)}catch(err){App.toast(readable(err),'danger');busy(btn,false)}
});

let confirmationResult;
document.getElementById('phoneBtn')?.addEventListener('click',()=>document.querySelector('.otp-box').classList.toggle('show'));
document.getElementById('sendOtp')?.addEventListener('click',async e=>{
 const phone=document.getElementById('phoneNumber').value.trim(); if(!/^\+[1-9]\d{8,14}$/.test(phone))return App.toast('Gunakan format internasional, contoh +628123456789','danger');
 busy(e.currentTarget,true,'Mengirim OTP…');
 try{
  if(!window.recaptchaVerifier)window.recaptchaVerifier=new firebase.auth.RecaptchaVerifier('recaptcha-container',{size:'normal'});
  confirmationResult=await fb.auth.signInWithPhoneNumber(phone,window.recaptchaVerifier);
  document.getElementById('otpConfirm').classList.remove('d-none');App.toast('Kode OTP telah dikirim','success');
 }catch(err){App.toast(readable(err),'danger');window.recaptchaVerifier?.clear();window.recaptchaVerifier=null}finally{busy(e.currentTarget,false)}
});
document.getElementById('verifyOtp')?.addEventListener('click',async e=>{
 const code=document.getElementById('otpCode').value.trim();if(!confirmationResult)return App.toast('Kirim OTP terlebih dahulu','danger');busy(e.currentTarget,true,'Memverifikasi…');
 try{const result=await confirmationResult.confirm(code);await ensureProfile(result.user)}catch(err){App.toast(readable(err),'danger');busy(e.currentTarget,false)}
});
function readable(err){const map={'auth/invalid-credential':'Email atau password salah.','auth/user-not-found':'Akun tidak ditemukan.','auth/wrong-password':'Password salah.','auth/popup-closed-by-user':'Jendela Google ditutup sebelum selesai.','auth/unauthorized-domain':'Domain ini belum ditambahkan ke Authorized domains Firebase.','auth/too-many-requests':'Terlalu banyak percobaan. Coba lagi nanti.','auth/network-request-failed':'Koneksi ke Firebase gagal. Periksa internet.'};return map[err.code]||err.message||'Terjadi kesalahan.'}
