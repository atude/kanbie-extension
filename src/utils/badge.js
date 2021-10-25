/*global chrome*/
import moment from "moment";
import { badge } from "../constants/Colors";

// Update badge for due tasks
// Note: Uses alarm object from chrome storage, not alarm from chrome alarms api
export const updateBadge = (alarms) => {
	if (alarms && Object.values(alarms).length) {
		const totalDueTasks = Object.values(alarms).reduce(
			(totalNotified, currAlarm) => totalNotified += moment(currAlarm.alarmDue).isBefore() ? 1 : 0, 0
		);
		if (totalDueTasks > 0) {
			chrome.action.setBadgeText({ text: totalDueTasks.toString() });
			chrome.action.setBadgeBackgroundColor({ 
				color: badge.color,
			});
		} else {
			chrome.action.setBadgeText({ text: "" });
		}
	}
};
