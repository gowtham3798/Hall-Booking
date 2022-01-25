//Tested in Postman //

create room url : "https://hallbookingo.herokuapp.com/createroom"
Format :
   {
    "noSeats": 5,
    "amenities": ["AC", "Geyser"],
    "price": 110
   }
   
create booking url : "https://hallbookingo.herokuapp.com/createbooking"
Format :
     {
    "custName": "Rajesh",
    "date": "01/01/2015",
    "startTime": "16:00",
    "endTime": "06:00"
    }
    
get booked rooms: "https://hallbookingo.herokuapp.com/getAllRooms"

get all bookings: "https://hallbookingo.herokuapp.com/getAllbookings"
