const formatToMention = (items) => items.map((item) => ({ id: item, display: item }));
const timeHours = [...Array(12).keys()].map((i) => ++i);
const timeMins = [...Array(2).keys()].map((i) => i * 30);

const times = timeHours.flatMap(timeHour => 
	timeMins.map((timeMin) => `${timeHour}:${timeMin.toString().length === 1 ? `${timeMin}0` : timeMin }`)
);

export const allTimes = formatToMention(
	times.flatMap(time => ["AM", "PM"].map((amOrPm) => `${time}${amOrPm}`))
);
