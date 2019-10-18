const express = require('express');
const router = express.Router();
const moment = require('moment');

const User = require('../models/user');
const Slot = require('../models/slot');

const today = moment().add(1, 'days').format('YYYY-MM-DD');
const nextWeek = moment().add(7,'days').format('YYYY-MM-DD');
const date = { today, nextWeek};

router.get('/', ensureAuthenticated, function(req, res){

  // If alumni logs in, render alumni dashboard.

  if(req.user.permission == "alumni"){
    Slot.getAlumniSlots(req.user.username, function(err, docs){
      if(!err){
        res.render('pages/dashboard/alumni', { slots: docs});
      }
      else {
        console.log('Error finding in slots: ' + JSON.stringify(err, undefined, 2))
      }
    });
  }
  else{

    // If student los in, render student dashboard.

    Slot.getUserSlots(req.user.username, function(err, docs){
      if(!err){
        const Slots = docs;
        User.getAlumni(function(err, docs){
          if(!err){
            // date: Student can only book a slot at most a week early.
            res.render('pages/dashboard/student', {alumni: docs, slots: Slots, date: date });
          }
          else {
            console.log("getAlumni: Error: " + JSON.stringify(err));
          }
        });
      }
      else{
        console.log("Find the Slot: Error: " + JSON.stringify(err));
      }
    });
  }
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		res.redirect('/users/login');
	}
}

module.exports = router;
