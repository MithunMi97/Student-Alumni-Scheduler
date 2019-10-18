const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const SlotSchema = mongoose.Schema({
  slot:{
    type:String
  },
  date: {
    type: String
  },
  alumni:{
    type: String
  },
  student:{
    type: String
  },
  status: {
    type: String,
    enum: ['unconfirmed', 'confirmed', 'rejected'],
    default: 'unconfirmed'
  },
  al_act: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: String,
  }
});

const Slot = module.exports = mongoose.model('Slot', SlotSchema);

// Get all slots booked to an alumnus.
module.exports.getAlumniSlots = function(id, callback){
  const query = {alumni: id};
  Slot.find(query, callback);
}

// Get all slots booked by a student.
module.exports.getUserSlots = function(username, callback){
  const query = {student: username};
  Slot.find(query, callback);
}

// Get all slots, that are still pending, booked by a student.
module.exports.pendingSlots = function(username, callback){
  const query = {student: username, status: 'unconfirmed'};
  Slot.find(query, callback);
}

module.exports.allPendingSlots = function(callback){
  const query = { status: {"$in": ['unconfirmed', 'confirmed']}};
  Slot.find(query, callback);
}
