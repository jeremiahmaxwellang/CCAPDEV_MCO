const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Foreign key to User._id

    request_date: { type: Date, required: true },
    reserved_date: { type: Date, required: true },

    room_num: { type: String, ref: 'Room', required: true },
    seat_num: { type: Number, required: true },
    
    anonymous: { type: String, enum: ['Y', 'N'], required: true },

    reserved_for_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Foreign key to another user
});

module.exports = mongoose.model('Reservation', ReservationSchema);