 const Sendnotifi = (data) =>{
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer AAAAGnU5Q4U:APA91bHNyqDUaRTNhzBlUTa_p3__nmW33RVvPiE-7M15Mf3idnt3vKo6c-Q3xrr_UNoufVekR8zv4P2fCEtH7BTaFfBVxbLZtGg38A_GVLR9asuHpuoORP6OSIDuWAKMogXVfBoOsQ9d");

var raw = JSON.stringify({
  "data": {},
  "notification": {
    "title": data.title,
    "body": data.body
  },
  "to": data.token
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
 }

 export default {Sendnotifi} 