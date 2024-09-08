 const socket = io();//connection request goes to the backend
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const{latitude,longitude}=position.coords;
        socket.emit("send-location",{latitude,longitude});//send to backend 
    },(error)=>{
        console.log(error);
    },{
      enableHighAccuracy:true,
      timeout:5000,
     maximumAge:0, //anytime data 
    }
);
}

const map =L.map("map").setView([0,0],10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
attribution:"OpenStreetMap"
}).addTo(map)

const markers ={};
socket.on("recieve-location",(data)=>{
const {id,latitude,longitude}=data;
map.setView([latitude,longitude]);//zoom (16)with , 16 
// giving current location 

if(markers[id]){
    markers[id].setLatLng([latitude,longitude]);
}
else {
    markers[id]=L.marker([latitude,longitude]).addTo(map);
}
});
socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
}); 