import { LimitedSignupBonus, Stage } from "../types/Api";
import { getTimeString } from "./data";
import { capitalize, plural } from "./string";

export const limitedSignupBonusValid = (signupDate: string, bonus: LimitedSignupBonus): boolean => {
	let endDate = new Date(new Date(signupDate).getTime() + bonus.minutes_after_signup * 60 * 1000)
	if (new Date() > endDate) return false
	return true
}

export const getTimeLeftLimitedSignupBonus = (signupDate: string, bonus: LimitedSignupBonus): number => {
	let endDate = new Date(signupDate).getTime() + bonus.minutes_after_signup * 60 * 1000
	return endDate - Date.now() 
}

const nameMap: Record<string, string> = {
	"base_bonus": "Stage Bonus",
	"spending_bonus": "$ Amount Purchase Bonus",
	"limited_time_bonus": "Limited Time Bonus",
	"limited_time_signup_bonus": "Signup Bonus",
	"first_purchase_bonus": "First Purchase Bonus",
	"tiered_fiat_bonus": "Payment Token Bonus"
}

export const getBonusName = (bonusKey: string) => {
	if (nameMap[bonusKey]) return nameMap[bonusKey];
	return bonusKey.split("_").map((str) => capitalize(str)).join(" ");
}

export interface BannerItem {
	label: string,
	key: string,
	closable?: boolean
}

export const getBonusBanners = (bonuses: Stage["bonuses"] | undefined, signupDate: string | undefined): BannerItem[] => {
	if (!signupDate) return [];
	let banners: BannerItem[] = []

	let signupLimitedBonus = bonuses?.signup?.limited_time
	if (signupLimitedBonus?.percentage && limitedSignupBonusValid(signupDate, signupLimitedBonus)) {
		banners.push({
			label: `Signup bonus available. +${signupLimitedBonus.percentage}% bonus if you purchase within ${getCountdownString(getTimeLeftLimitedSignupBonus(signupDate, signupLimitedBonus))}`,
			key: "signup-limited",
			closable: true
		})
	}

	let limitedBonus = bonuses?.limited_time
	let limitedDiff = new Date(limitedBonus?.end_date || "").getTime() - Date.now()

	if (limitedBonus?.percentage && limitedDiff && limitedDiff > 0) {
		banners.push({
			label: `Limited time bonus available. +${limitedBonus?.percentage}% bonus if you purchase within ${getCountdownString(limitedDiff)}`,
			key: "limited",
			closable: true
		})
	}

	return banners
}

const divisorMap = {
	day: 1000 * 60 * 60 * 24,
	hour: 1000 * 60 * 60,
	min: 1000 * 60,
	sec: 1000,
}

const divisorMapEntries = Object.entries(divisorMap)

export const getCountdownString = (timeLeft: number) => {
	let totalStr = ""

	for (let i = 0; i < divisorMapEntries.length; i++) {
		let [ currentKey, divisor ] = divisorMapEntries[i]

		let currentValue = Math.floor(timeLeft / divisor)
		if (currentValue > 0) {
			totalStr = `${totalStr} ${currentValue} ${plural(currentValue, currentKey, `${currentKey}s`)}`
		}

		timeLeft = timeLeft - (currentValue * divisor);
	}
	
	return totalStr
}