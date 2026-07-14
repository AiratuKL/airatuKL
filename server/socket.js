// Presence and chat transport. Persist messages to Firestore on the client.
module.exports = function initSocket(server){
 const io=require('socket.io')(server,{cors:{origin:true,methods:['GET','POST']},maxHttpBufferSize:10e6});
 const online=new Map();
 io.on('connection',socket=>{
  socket.on('user:join',user=>{ if(!user?.uid)return; socket.data.user=user; online.set(user.uid,socket.id); socket.join(user.uid); io.emit('presence',{uid:user.uid,online:true,lastSeen:null}); });
  socket.on('room:join',roomId=>roomId&&socket.join(`room:${roomId}`));
  socket.on('message:send',msg=>{ if(!msg?.roomId||!msg?.text&&!msg?.file)return; const safe={...msg,text:String(msg.text||'').slice(0,5000),id:msg.id||Date.now().toString(),createdAt:Date.now(),status:'delivered'}; io.to(`room:${msg.roomId}`).emit('message:new',safe); });
  socket.on('typing',data=>data?.roomId&&socket.to(`room:${data.roomId}`).emit('typing',{uid:socket.data.user?.uid,isTyping:!!data.isTyping}));
  socket.on('message:seen',data=>data?.roomId&&io.to(`room:${data.roomId}`).emit('message:status',{id:data.id,status:'seen'}));
  socket.on('disconnect',()=>{ const u=socket.data.user; if(u){online.delete(u.uid);io.emit('presence',{uid:u.uid,online:false,lastSeen:Date.now()});} });
 });
};
