const thresholds=Array.from({length:50},(_,i)=>Math.round((500+29500*Math.pow(i/49,1.65))/100)*100);
function levelInfo(total){let level=0,left=total;while(level<50&&left>=thresholds[level])left-=thresholds[level++];return{level,current:left,need:level===50?thresholds[49]:thresholds[level],pct:level===50?100:left/thresholds[level]*100}}
window.LevelSystem={thresholds,levelInfo,rewardExp:()=>Math.floor(Math.random()*401)+100};
document.addEventListener('DOMContentLoaded',()=>{const info=levelInfo(4850);document.querySelector('[data-exp-bar]')?.style.setProperty('width',`${info.pct}%`)});
