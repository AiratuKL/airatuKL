const App={
 init(){const t=localStorage.getItem('theme')||'light';document.documentElement.dataset.theme=t;document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.onclick=()=>this.toggleTheme());},
 toggleTheme(){const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('theme',next)},
 toast(msg,type='primary'){const el=document.createElement('div');el.className=`position-fixed bottom-0 end-0 m-4 alert alert-${type} shadow animate__animated animate__fadeInUp`;el.style.zIndex=9999;el.textContent=msg;document.body.append(el);setTimeout(()=>el.remove(),2800)},
 sanitize(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML},
 user(){return JSON.parse(localStorage.getItem('airatu_user')||'null')}
};document.addEventListener('DOMContentLoaded',()=>App.init());window.App=App;
