const express = require("express");
const router = express.Router();
const event_controller = require("../../controller/event_controller");
const passport = require("passport");

//@route GET api/events/
//@desc List Events (If owner / If anyone has added to some event)
//@access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  event_controller.listEvents
);

//@route GET api/events/search
//@desc Filter Event by date
//@access Private
router.get(
  "/search",
  passport.authenticate("jwt", { session: false }),
  event_controller.searchEvents
);

//@route POST api/events/
//@desc Add Event
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  event_controller.addEvent
);

//@route PUT api/events/:event_id
//@desc Update Event
//@access Private
router.put(
  "/:event_id",
  passport.authenticate("jwt", { session: false }),
  event_controller.updateEvent
);

//@route PUT api/events/user/:event_id
//@desc Update Users in Event
//@access Private
router.put(
  "/user/:event_id",
  passport.authenticate("jwt", { session: false }),
  event_controller.updateUsersInEvent
);

//@route DELETE api/events/:event_id
//@desc Delete events
//@access Private
router.delete(
  "/:event_id",
  passport.authenticate("jwt", { session: false }),
  event_controller.deleteEvent
);

module.exports = router;
