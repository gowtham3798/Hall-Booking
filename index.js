import express from "express";
import uniqid from "uniqid";
import bodyParser from "body-parser";
// import res from "express/lib/response";
import dotenv from 'dotenv';

dotenv.config()
 

const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());


app.get('/',(req,res) => {
    res.send("Welcome to our booking app")
    console.log("successful")
})

let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;
let time_regex = /^(0[0-9]|1\d|2[0-3])\:(00)/;

let rooms = [];
let roomNo = 100;
let bookings = [];

app.get("/getAllRooms",(req, res) => {
    res.send({
        output: rooms
    });
});

app.get("/getAllbookings",(req, res) => {
    res.send({
        output: bookings
    });
});

app.post('/createroom',(req,res) => {
    let room = {};
    room.id = uniqid();
    room.roomNo = roomNo;
    room.booking = []; 
    const newRoom = req.body;
    if(newRoom.noSeats){room.noSeats = newRoom.noSeats} else{res.status(400).send({message : "Please specify No of seats for Room"})};
    if(newRoom.amenities){room.amenities = newRoom.amenities} else{res.status(400).send({ message: 'Please specify all Amenities for Room in Array format'})};
    if(newRoom.price){room.price = newRoom.price} else{res.status(400).send({ message: 'Please specify price per hour for Room'})};
    rooms.push(room);
    console.log(rooms)
    roomNo++;
    res.status(200).send({message : "Room Created Successfully"})
})

app.post('/createbooking',(req,res) => {
    let booking = {};
    booking.id = uniqid();
    const newBooking = req.body;
    if(newBooking.custName){booking.custname = newBooking.custname} else{res.status(400).send({message : "Please specify customer Name for booking."})}
    if(newBooking.date){
        if(date_regex.test(newBooking.date)){
        booking.date = newBooking.date} 
        else{res.status(400).send({message: "Please specify date in MM/DD/YYYY"})}
         }
         else{res.status(400).send({message: "Please specify date for booking."})}

    if(newBooking.startTime){
        if(time_regex.test(newBooking.startTime)){
            booking.starttime = newBooking.startTime
        }
        else{
            res.status(400).send({message: "Please specify time in hh:min(24-hr format) where minutes should be 00 only"})
        }
    }
    else{res.status(400).send({message: 'Please specify Starting time for booking.'})}

    if(newBooking.endTime){
        if(time_regex.test(newBooking.endTime)){
            booking.endTime = newBooking.endTime
        }
        else{
            res.status(400).send({message: "Please specify time in hh:min(24-hr format) where minutes should be 00 only"})
        }
    }
    else{res.status(400).send({message: 'Please specify Ending time for booking.'})}

    const availableRooms = rooms.filter((room) => {
        if(room.booking.length == 0){
            return  true;
        }
        else{
            room.booking.filter(book => {
                if(book.date = req.body.date){
                    if((parseInt((book.startTime).substring(0, 1)) > parseInt((req.body.startTime).substring(0, 1)) ) && 
                    (parseInt((book.startTime).substring(0, 1)) > parseInt((req.body.endTime).substring(0, 1)) ) ){ 
                        if((parseInt((book.startTime).substring(0, 1)) < parseInt((req.body.startTime).substring(0, 1)) ) && 
                          (parseInt((book.startTime).substring(0, 1)) < parseInt((req.body.endTime).substring(0, 1)) ) ){ 
                            return true;
                        }
                    }
                }
                else{
                    return true;
                }
            })
            
        }
    })

      if(availableRooms.length == 0){res.status(400).send({message: 'No Rooms available on selected date and time'})}
      else{
       let roomRec = availableRooms[0];
          let count = 0;
          rooms.forEach(element =>{
            if(element.roomNo == roomRec.roomNo){
                let bookingdtl = rooms[count].booking
                bookingdtl.push({
                    custName: req.body.custName,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    date: req.body.date
                })
               }
               count++;
           });
           let bookingRec = req.body;
           bookingRec.roomNo = roomRec.roomNo;
           bookingRec.cost = parseInt(roomRec.price) * (parseInt((bookingRec.endTime).substring(0, 1)) - parseInt((bookingRec.startTime).substring(0, 1)));
        
        
           bookings.push(bookingRec);
           res.status(200).send({ output: 'Room Booking Successfully'}) 
        
      }
})
app.listen(port)
