const Event = require("../model/Event");
const keys = require("../config/keys");

const addEvent = async (req, res) => {
  const {
    name,
    startDateTime,
    endDateTime,
    usersInTheEvent,
    location
  } = req.body;
  if (name && startDateTime && endDateTime && usersInTheEvent) {
    const owner = req.user._id;
    const newEvent = new Event({
      name,
      startDateTime,
      endDateTime,
      usersInTheEvent: usersInTheEvent.split(","),
      location,
      owner
    });
    const saveEvent = await newEvent.save();
    if (saveEvent) {
      res.status(200).json(saveEvent);
    }
  } else {
    res.status(400).json({
      msg: "Name,startDateTime,endDateTime,usersIntheEvent are required fields"
    });
  }
};

const searchEvents = async (req, res) => {
  const { startDateTime, endDateTime } = req.body;
  try {
    const eve = await Event.find({
      startDateTime: {
        $gte: new Date(startDateTime),
        $lte: new Date(endDateTime)
      }
    });
    res.status(200).json(eve);
  } catch (err) {
    res.status(400).json(err);
  }
};

const listEvents = async (req, res) => {
  try {
    const eveList = await Event.find({
      $or: [
        { usersInTheEvent: { $elemMatch: { $eq: req.user._id } } },
        { owner: req.user._id }
      ]
    });
    //query for list of events created by the user or the events in which the user is included
    const finalList = eveList.map(eve => {
      return {
        name: eve.name,
        startDateTime: eve.startDateTime,
        endDateTime: eve.endDateTime,
        location: eve.location
      };
    });
    res.status(200).json(finalList);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteEvent = async (req, res) => {
  const { event_id } = req.params;
  if (event_id) {
    try {
      var matchedRow = await Event.findOne({
        _id: event_id,
        owner: req.user._id
      });
    } catch (err) {
      return res.status(400).json({ msg: "No such event found!!" });
    }
    if (matchedRow) {
      try {
        const delRow = await Event.deleteOne({ _id: event_id });
        return res.status(200).json(delRow);
      } catch (err) {
        return res.status(400).json({ msg: "Could not delete event!!" });
      }
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to delete this event!" });
    }
  }
};

const updateUsersInEvent = async (req, res) => {
  const { event_id } = req.params;
  if (event_id) {
    try {
      var eventRow = await Event.findOne({
        _id: event_id,
        owner: req.user._id
      });
    } catch (err) {
      return res.status(400).json({ msg: "No such event found!!" });
    }
    if (eventRow) {
      let usersInTheEventArr = [];
      let { usersInTheEvent, action } = req.body;
      if (usersInTheEvent && usersInTheEvent.length > 0 && action) {
        //check for usersIntheEvent
        usersInTheEventArr = usersInTheEvent.split(",");
        try {
          let updEvent;
          if (action == "add") {
            //for add we need to use $push in mongodb
            updEvent = await Event.updateOne(
              { _id: event_id },
              { $push: { usersInTheEvent: { $each: usersInTheEventArr } } }
            );
          } else if (action == "remove") {
            //for removing elements from array we need to use $pull
            updEvent = await Event.updateOne(
              { _id: event_id },
              { $pull: { usersInTheEvent: { $in: usersInTheEventArr } } }
            );
          }
          if (updEvent) {
            return res.status(200).json(updEvent);
          } else {
            return res.status(400).json({ msg: "No data found!!" });
          }
        } catch (err) {
          return res.status(400).json(err);
        }
      } else {
        return res
          .status(400)
          .json({ msg: "Please pass one or a list of users and action!!" });
      }
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to update this event!" });
    }
  } else {
    return res.status(400).json({ msg: "Please enter event ID!!" });
  }
};

const updateEvent = async (req, res) => {
  const { event_id } = req.params;
  if (event_id) {
    try {
      var eventRow = await Event.findOne({
        _id: event_id,
        owner: req.user._id
      });
    } catch (err) {
      return res.status(400).json({ msg: "No such event found!!" });
    }
    if (eventRow) {
      const updInfo = {};
      let { name, startDateTime, endDateTime } = req.body;
      if (name) {
        updInfo.name = name;
      }
      if (startDateTime) {
        updInfo.startDateTime = new Date(startDateTime);
      }
      if (endDateTime) {
        updInfo.endDateTime = new Date(endDateTime);
      }
      //updInfo array filled up
      try {
        const updEvent = await Event.updateOne(
          { _id: event_id },
          { $set: updInfo }
        );
        if (updEvent) {
          return res.status(200).json(updEvent);
        } else {
          return res.status(400).json({ msg: "No data found!!" });
        }
      } catch (err) {
        return res.status(400).json(err);
      }
    } else {
      return res
        .status(401)
        .json({ msg: "You are not authorized to update this event!" });
    }
  } else {
    return res.status(400).json({ msg: "Please enter event ID!!" });
  }
};

module.exports = {
  addEvent,
  deleteEvent,
  updateEvent,
  deleteEvent,
  updateUsersInEvent,
  searchEvents,
  listEvents
};
