import { DateTimePatternType } from "./constants/datetime-format.constants";
import * as moment from 'moment-timezone';

export class DateUtils {
	static timeZone = process.env.BACKEND_TZ || "UTC";

	static formatDate(date: string): string {
		return date.split("T")[0];
	}

	static getCurrentTimeString() {
		return new Date().toLocaleTimeString(); // '11:13:31 AM'
	}

	static getCurrentFullDate() {
		return new Date(Date.now());
	}

	static convertToString(date: Date) {
		return date.toISOString();
	}

	static getTodayDate(todayDate?: Date) {
		const currentFullDate = todayDate || this.getCurrentFullDate();
		const year = currentFullDate.getFullYear().toString();
		let month: number | string = currentFullDate.getMonth() + 1;
		month = month.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const date = currentFullDate
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const fullDate = `${year}-${month}-${date}`;
		const timestamp = currentFullDate.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});
		const formattedDateTime = `${fullDate} ${timestamp}`;
		return { year, month, date, fullDate, formattedDateTime };
	}

	static getYesterdayDate() {
		const today = this.getCurrentFullDate();
		const yesterdayFullDate = new Date(today.setDate(today.getDate() - 1));
		const date = yesterdayFullDate
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		let month: number | string = yesterdayFullDate.getMonth() + 1;
		month = month.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const year = yesterdayFullDate
			.getFullYear()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		return { yesterdayFullDate, year, month, date };
	}

	static getPreviousMonth() {
		const today = this.getCurrentFullDate();
		const previousMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1; // Handling January as special case
		const previousYear =
			today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
		const previousFullDate = new Date(previousYear, previousMonth + 1, 0); // Setting date to last day of previous month
		const date = previousFullDate
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		let month: number | string = previousFullDate.getMonth() + 1;
		month = month.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const year = previousFullDate
			.getFullYear()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		return { previousFullDate, year, month, date };
	}

	static getCurrentWeek() {
		const today = this.getCurrentFullDate();
		const day = today.getDay();
		let currentWeekFullDate = new Date(today.setDate(today.getDate() - day));
		const date = currentWeekFullDate
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		let month: number | string = currentWeekFullDate.getMonth() + 1;
		month = month.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const year = currentWeekFullDate
			.getFullYear()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const startOfCurrentWeek = { year, month, date };
		const endOfCurrentWeek = this.getTodayDate();
		return { currentWeekFullDate, startOfCurrentWeek, endOfCurrentWeek };
	}

	static getPreviousWeek() {
		const { currentWeekFullDate, startOfCurrentWeek } = this.getCurrentWeek();
		let endOfPreviousWeek = startOfCurrentWeek;
		let endOfPreviousWeekFullDate = new Date(
			`${startOfCurrentWeek.year}-${startOfCurrentWeek.month}-${startOfCurrentWeek.date}`
		);
		let endOfPreviousWeekYear, endOfPreviousWeekMonth, endOfPreviousWeekDate;
		if (parseInt(startOfCurrentWeek.date) - 1 <= 0) {
			endOfPreviousWeekMonth =
				endOfPreviousWeekFullDate.getMonth() === 0
					? 11
					: endOfPreviousWeekFullDate.getMonth() - 1; // Handling January as special case
			endOfPreviousWeekYear =
				endOfPreviousWeekFullDate.getMonth() === 0
					? endOfPreviousWeekFullDate.getFullYear() - 1
					: endOfPreviousWeekFullDate.getFullYear();
			const endWeekFullDate = new Date(
				endOfPreviousWeekYear,
				endOfPreviousWeekMonth + 1,
				0
			); // Setting date to last day of previous month
			endOfPreviousWeekDate = endWeekFullDate
				.getDate()
				.toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				});
			endOfPreviousWeek = {
				year: endOfPreviousWeekYear.toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				}),
				month: (endOfPreviousWeekMonth + 1).toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				}),
				date: endOfPreviousWeekDate.toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				}),
			};
		} else {
			endOfPreviousWeekDate = (
				parseInt(startOfCurrentWeek.date) - 1
			).toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			});
			endOfPreviousWeek = {
				...startOfCurrentWeek,
				date: endOfPreviousWeekDate,
			};
		}

		const previousWeekFullDate = new Date(
			currentWeekFullDate.setDate(currentWeekFullDate.getDate() - 7)
		);
		const date = previousWeekFullDate
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		let month: number | string = previousWeekFullDate.getMonth() + 1;
		month = month.toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const year = previousWeekFullDate
			.getFullYear()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const startOfPreviousWeek = { year, month, date };
		return { previousWeekFullDate, startOfPreviousWeek, endOfPreviousWeek };
	}
	static getCurrentYear(): number {
		const date = new Date(Date.now());
		return date.getFullYear();
	}
	static getCurrentMonth(): string {
		const date = new Date(Date.now());
		return date.toISOString().split("-")[1];
	}
	static getCurrentYearMonth(): string {
		return `${DateUtils.getCurrentYear()}${DateUtils.getCurrentMonth()}`;
	}

	static formatDateTime(
		dateTimeString: string | Date,
		format: string
	): string | null {
		if (!dateTimeString) {
			return null;
		}

		const timezone = process.env.BACKEND_TZ || "UTC";
		const dateTime = moment.tz(dateTimeString, timezone);

		const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const monthsOfYear = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];

		const dayOfWeek = daysOfWeek[dateTime.day()];
		const dayOfMonth = dateTime.date().toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const month = monthsOfYear[dateTime.month()];
		const year = dateTime.year();

		const formatTime = (date: moment.Moment, hour12: boolean) => {
			const formattedTime = date.format(hour12 ? "hh:mm:ss A" : "HH:mm:ss");
			return formattedTime;
		};

		switch (format) {
			case DateTimePatternType.MMM_DD_YYYY_HMS.displayname:
				return `${dayOfWeek} ${dayOfMonth} ${month}, ${year} ${formatTime(
					dateTime,
					true
				)}`;
			case DateTimePatternType.MMM_DD_YYYY.displayname:
				return `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`;
			case DateTimePatternType.DD_MM_YYYY.displayname:
				return `${dayOfMonth}/${dateTime.month() + 1}/${year}`;
			case "DD-MM-YYYY":
				return `${dayOfMonth}-${dateTime.month() + 1}-${year}`;
			case DateTimePatternType.YYYY_MM_DD.displayname:
				return `${year}/${(dateTime.month() + 1).toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}/${dayOfMonth}`;
			case DateTimePatternType.YYYY_MM_DD_HM.displayname:
				return `${year}-${(dateTime.month() + 1).toLocaleString("en-US", {
					minimumIntegerDigits: 2,
					useGrouping: false,
				})}-${dayOfMonth}, ${formatTime(dateTime, true)}`;
			case DateTimePatternType.dd_DD_MM_YYYY.displayname:
				return `${dayOfWeek} ${dayOfMonth} ${month}, ${year}`;
			case DateTimePatternType.HH_MM_SS_AMPM.displayname:
				return formatTime(dateTime, true);
			default:
				return `${dayOfWeek} ${dayOfMonth} ${month}, ${year} ${formatTime(
					dateTime,
					true
				)}`;
		}
	}

	static getYearFromDate(date: Date): number {
		const dateNow = new Date(date);
		return dateNow.getFullYear();
	}
	static getYearMonthFromDate(date: Date): number {
		return parseInt(`${date.getFullYear()}${date.toISOString().split("-")[1]}`);
	}
	static convertToIsoFormat(date): string {
		return (date as string).replace(" ", "T") + "Z";
	}
	static getDateFromHourDifference(hourDifference: number): string {
		const todayDateMinusHour = new Date(
			new Date().getTime() - hourDifference * 60 * 60 * 1000
		);
		const year = todayDateMinusHour.getFullYear().toString();
		const month = (todayDateMinusHour.getMonth() + 1).toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const dayOfMonth = todayDateMinusHour
			.getDate()
			.toLocaleString("en-US", { minimumIntegerDigits: 2, useGrouping: false });
		const timestamp = todayDateMinusHour.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "numeric",
			second: "numeric",
			hour12: false,
		});
		return `${year}-${month}-${dayOfMonth} ${timestamp}`;
	}
}
