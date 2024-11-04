import { ONE_DAY_IN_MILLISECONDS } from "../constant";

export const hasOneDayPassedSince = (date: Date): boolean => {
	return (
		new Date(date.getTime() + ONE_DAY_IN_MILLISECONDS).getTime() < Date.now()
	);
};
