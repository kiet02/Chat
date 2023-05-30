
var admin = require("firebase-admin");
var express = require('express');
var app = express()
var serviceAccount = require("./serviceAccountKey.json");
app.use(express.json())
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://chat-e4c0d-default-rtdb.firebaseio.com"
});
app.post('/send',(req,res) =>{
console.log(req.body);
const message = {
  notification:{
    title:'new ad',
    body:' new'
  },token:'diGJaPTjSiyAYcd8wkBq0x:APA91bEm9LOjMbr7hkJDLbaFRwoGrwISd_AKPe0H144rC4X3CgPoxJQ_B_oaIKOFhPnt0sTmTgMnNaFWL5bTSUP7eUnoc7niyDbqkQ_ZPbGMVO3qDy3NSyiXj7ljSK27ShdcpvD64dIm'
}
})
app.listen(3000,()=>{
  console.log('ok roi');
 
})
app.get(3000,(req,res,next)=>{
  res.status(200).send({
    message
  })

})
const message = {
  notification:{
    title:'new ad',
    body:' new'
  },token:'diGJaPTjSiyAYcd8wkBq0x:APA91bEm9LOjMbr7hkJDLbaFRwoGrwISd_AKPe0H144rC4X3CgPoxJQ_B_oaIKOFhPnt0sTmTgMnNaFWL5bTSUP7eUnoc7niyDbqkQ_ZPbGMVO3qDy3NSyiXj7ljSK27ShdcpvD64dIm'
}
admin.messaging().send(message);