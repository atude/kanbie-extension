/*global chrome*/
import moment from "moment";
import { updateBadge } from "./utils/badge";
import { filterStringIncludeSpace } from "./utils/generic";

// Alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
	try {
		chrome.storage.sync.get("columns", (data) => {
			if (!chrome.runtime.error) {
				const columns = data.columns;
				columns.forEach((column) => {
					column.items.forEach((card) => {
						if (card.id === alarm.name) {
							// Create notif
							const timeFrom = moment(new Date(alarm.scheduledTime)).fromNow();
							chrome.notifications.create(
								card.id, 
								{ 
									title: "Task is due", 
									message: `${filterStringIncludeSpace(card.content)} was due ${timeFrom}.`, 
									type: "basic", 
									iconUrl: "./logo-small.png" 
								},
								() => {}
							);
							try {
								chrome.storage.sync.get("alarms", (data) => {
									if (!chrome.runtime.error) {
										// Set to notified
										const alarms = {
											...data.alarms,
											[alarm.name]: {
												...data.alarms[alarm.name],
												notified: true,
											},
										};
										// Update badge
										updateBadge(alarms);
										chrome.storage.sync.set({
											"alarms": alarms,
										}, () => {
											if (chrome.runtime.error) {
												console.warn("Runtime error. Failed to save edited alarms.");
											}
										});
									}
								})
							} catch (error) {
								console.warn("Error syncing storage with chrome extensions.");
							}
						}
					});
					return;
				});
			}
		});
	} catch (error) {
		console.warn("Could not trigger alarm.");
	}
});