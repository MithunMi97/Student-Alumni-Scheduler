var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;

var SlotSchema = mongoose.Schema({
  slot:{
    type:String,
    enum: ['01:00pm-02:00pm', '04:00pm-05:00pm', '06:00pm-07:00pm']
  },
  date: {
    type: String
  },
  alumni:{
    type: String,
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

var Slot = module.exports = mongoose.model('Slot', SlotSchema);

// Get all slots booked to an alumnus.
module.exports.getAlumniSlots = function(id, callback){
  var query = {alumni: id};
  Slot.find(query, callback);
}

// Get all slots booked by a student.
module.exports.getUserSlots = function(username, callback){
  var query = {student: username};
  Slot.find(query, callback);
}

// Get all slots, that are still pending, booked by a student.
module.exports.pendingSlots = function(username, callback){
  var query = {student: username, status: 'unconfirmed'};
  Slot.find(query, callback);
}

module.exports.allPendingSlots = function(callback){
  var query = { status: {"$in": ['unconfirmed', 'confirmed']}};
  Slot.find(query, callback);
}
