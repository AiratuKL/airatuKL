const thresholds=Array.from({length:50},(_,i)=>Math.round((500+29500*Math.pow(i/49,1.65))/100)*100);
function levelInfo(total){let level=0,left=total;while(level<50&&left>=thresholds[level])left-=thresholds[level++];return{level,current:left,need:level===50?thresholds[49]:thresholds[level],pct:level===50?100:left/thresholds[level]*100}}
window.LevelSystem={thresholds,levelInfo,rewardExp:()=>Math.floor(Math.random()*401)+100};
document.addEventListener('DOMContentLoaded',()=>{
 const user=JSON.parse(localStorage.getItem('airatu_user')||'null');
 const info=levelInfo(user?.totalExp||4850);document.querySelector('[data-exp-bar]')?.style.setProperty('width',`${info.pct}%`);
 if(user?.role==='admin'){
  const name=document.querySelector('.profile-card h2'); if(name)name.textContent=user.displayName;
  const badge=document.querySelector('.profile-card .rank-badge'); if(badge)badge.innerHTML='<i class="fa-solid fa-crown"></i> Supreme Admin';
  const level=document.querySelector('.profile-card > div:last-child b'); if(level)level.textContent='Level 50';
  const frame=document.querySelector('.profile-card > div:last-child .muted'); if(frame)frame.textContent='Supreme Frame';
  const values=document.querySelectorAll('.stats-grid .stat strong');
  if(values.length>=4){values[0].textContent=(user.totalExp||0).toLocaleString('id-ID');values[1].textContent=user.matches;values[2].textContent=user.wins;values[3].textContent=((user.wins/user.matches)*100).toFixed(1).replace('.',',')+'%';}
  document.querySelector('[data-exp-bar]')?.style.setProperty('width','100%');
 }
});
