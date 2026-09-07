import moment from "moment";

const convertAmPmTimeTo24Hour = (time) => 
	time.substr(-2) === "AM" ? 
	time.replace("AM", "")
		.split(":")
		.map((timeSect, i) => (i === 0 && timeSect !== "12") ? 
			`0${timeSect}` : 
			timeSect === "12" ? 
				"00" : 
				timeSect
		).join(":") :
	time.replace("PM", "")
		.split(":")
		.map((timeSect, i) => (i === 0 && timeSect !== "12") ? 
			(Number(timeSect) + 12).toString() : 
			timeSect === "12" ? 
				"12" : 
				timeSect
		).join(":");

const formatTimeToMention = (items) => items.map((item) => (
	{ id: `__TIME: ${convertAmPmTimeTo24Hour(item)}`, display: item }
));
const timeHours = [12, ...[...Array(11).keys()].map((i) => ++i)];
const timeMins = [...Array(2).keys()].map((i) => i * 30);

const times = timeHours.flatMap(timeHour => 
	timeMins.map((timeMin) => `${timeHour}:${timeMin.toString().length === 1 ? `${timeMin}0` : timeMin }`)
);

export const allTimes = formatTimeToMention(
	times.flatMap(time => ["AM", "PM"].map((amOrPm) => `${time}${amOrPm}`))
);

export const allDays = [
	{ id: `__DATE: ${moment().add(0, 'days').format("DD/MM/YYYY")}`, display: "Today" },
	{ id: `__DATE: ${moment().add(1, 'days').format("DD/MM/YYYY")}`, display: "Tomorrow" },
	...[...Array(12).keys()].map((i) => {
		const dayDate = moment().add(2 + i, 'days');
		const formattedDate = dayDate.format("DD/MM/YYYY");
		const amPm = dayDate.format("DD/MM");
		const formattedDisplay = `${i < 5 ? '' : 'Next '}${dayDate.format("dddd")} ${amPm}`;
		return {
			id: `__DATE: ${formattedDate}`,
			display: formattedDisplay,
		};
	}),
];

