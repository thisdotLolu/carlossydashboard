export interface APIError {
	code: number,
	message: string
}

export interface User {
	id: string,
	first_name: string,
	last_name: string,
	email: string,
	mobile: string | null,
	nationality: string,
	role: "user" | "admin",
	purchased: boolean,
	signup_date: string,
	is_email_verified: boolean,
	wallet: string | null,
	tokens: {
		base: number,
		bonuses: number,
		total: number
	} | null
}

export interface Token {
	token: string,
	expires: string
}

export interface Tokens {
	access?: Token,
	refresh?: Token
}

export interface LoginResponse {
	user: User,
	tokens: Tokens
}

export interface TokenBonus {token_id: string, percentage: number}
export interface LimitedSignupBonus {
	minutes_after_signup: 15,
	percentage: 100
}

export interface TieredBonus {
	amount: number,
	percentage: number
}

export interface Stage {
	id: string,
	name: string
	type: string,
	token_price: number,
	start_date: string,
	end_date: string,
	total_tokens: number,
	disabled: boolean,
	min_fiat_amount: number | null,
	max_fiat_amount: number | null,
	bonuses: {
		base_percentage: number,
		tiered_fiat?: TieredBonus[],
		payment_tokens?: TokenBonus[],
		limited_time?: {
			start_date: string,
			end_date: string,
			percentage: number
		},
		signup?: {
			first_purchase_percentage?: 100,
			limited_time?: LimitedSignupBonus
		},
		referrals: {
			spend: number,
			earn: number
		}
	}
}

export interface PricesResponse {
	[key: string]: {
		[key: string]: number
	}
}

export interface FinalPriceResponse {
	final_price: number
}

export interface PaymentToken {
	id: string,
	name: string,
	short_name: string,
	chain: string,
	payment_provider_ids: {
		[key: string]: string
	}
}

export interface Project {
	id: string,
	name: string,
	symbol: string,
	frontend_url: string,
	main_site_url: string,
	wallet: {
		type: string,
		name: string,
		symbol: string,
	},
	payment_tokens: PaymentToken[],
	social_media: Record<string, string>

}

export interface BonusCalculations {
	[key: string]: number
}

export interface Transaction {
	id: string,
	payment_id: string,
	payment_address: string,
	status: "pending" | "processing" | "completed" | "expired" | "failed"
	tokens: {
		base: number,
		bonuses: Record<string, number>,
		total: number
	},
	payment_token: PaymentToken,
	initial_purchase_amount_fiat: number,
	initial_purchase_amount_crypto: number,
	token_price: number,
	completed_date: string | null,
	actual_purchase_amount_crypto: number | null,
	actual_purchase_amount_fiat: number | null,
	user_id: string,
	type: "purchase" | "referral"
}

export type Paginated<T> ={ 
	after?: [{"@ref": {id: string}}],
	before?: [{"@ref": {id: string}}],
	data: T[]
}

export type TransactionsResponse = Paginated<Transaction>

export interface MinimumAmountResponse {
	token_id: string,
	min_amount_fiat: number,
}

export interface PriceChartDataItem {
	date: string,
	price: number,
}

export interface PriceChartResponse {
	price_chart: PriceChartDataItem[]
}

export interface ReferralStatsResponse {
	referred: number,
	earned_tokens: number,
}

export type PromotionImage = {
	image: string,
	buy_params: Record<string, string | number>
}

export type PromotionImageResponse = Record<string, PromotionImage>