const calendarRouter = require("express").Router();
const calendarController = require("../controllers/calendar");
const { authenticationMiddleWare } = require("../middleware/auth");

calendarRouter.use(authenticationMiddleWare);
calendarRouter.post("/keywords", calendarController.getKeywordValues);
calendarRouter.post(
	"/",
	calendarController.createNewCalendar.validate,
	calendarController.createNewCalendar
);
calendarRouter.get("/", calendarController.getCalendar);
calendarRouter.patch(
	"/:id",
	calendarController.updateCalendar.validate,
	calendarController.updateCalendar
);

module.exports = calendarRouter;
