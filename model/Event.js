//[name[required], startDatetime[required], endDateTime[required],  usersInTheEvent[required], location, owner[required]]

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//const bcrypt = require("bcryptjs");

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  usersInTheEvent: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  location: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});
EventSchema.pre('save', async function(next){
  const event = this;
  //Replace the plain text password with the hash and then store it
  this.startDateTime = new Date(this.startDateTime);
  this.endDateTime = new Date(this.endDateTime);
  //Indicates we're done and moves on to the next middleware
  next();
});


module.exports = Event = mongoose.model("events", EventSchema);
