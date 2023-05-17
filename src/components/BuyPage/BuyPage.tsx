import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Component, ComponentType } from "../../types/Util"
import { CurrencyItem, deserializeObjFromQuery, dollarItem, formatLargeNumber, formatNumber, getBonusName, isDuplicate, floorToDP, roundToNearest, tokenImageMap, useBonusCalculations, useDebounce, useInterval, useStateRef, useCreateTransaction, errorToString, useGetMinimumAmount } from "../../util"
import Button from "../Button"
import Form, { FormRender } from "../Form"
import FormPage from "../FormPage"
import Page from "../Page"

import _DropdownIcon from "../../svg/icons/down-chevron.svg"

const DropdownIcon = _DropdownIcon as unknown as Component<any>

import "./BuyPage.css"
import FormNumberInput from "../FormNumberInput"
import clsx from "clsx"
import { FormTokenSelectModal } from "../TokenSelectModal"
import Collapse from "../Collapse"
import { SelectModalWrapper } from "../SelectModal"
import { PriceContext } from "../../context/PriceContext"
import { PricesResponse, TokenBonus, Transaction } from "../../types/Api"
import { StageContext } from "../../context/StageContext"
import { AuthContext } from "../../context/AuthContext"
import { ProjectContext } from "../../context/ProjectContext"
import { Loadable, Loader, LoaderContext } from "../Loader"
import { AlertContext } from "../../context/AlertContext"
import { TransactionsContext } from "../../context/TransactionsContext"
import TieredBonusButtons from "../TieredBonusButtons"

import * as Yup from "yup"
import { defaultTransaction } from "../../defaults/Api"
import placeholder from "../../constants/placeholder"
import { TransactionDetails } from "../TransactionList"
import Info from "../Info"
import Card, { CardBody, CardTitle } from "../Card"

const BuyPage: Component = () => {
	const [ timeRemaining, setTimeRemaining ] = useState(0);
	const { prices, refreshPrices, priceRequest } = useContext(PriceContext)
	const bonusCalculationRequest = useBonusCalculations()
	const [ bonusUSDFixed, setBonusUSDFixed ] = useState(0)

	const { activeStage, activeStageRequest, presaleEnded } = useContext(StageContext)
	const { user } = useContext(AuthContext)
	const { currentProject, currencyTokenList, currProjectRequest } = useContext(ProjectContext)

	const [ searchParams, setSearchParams ] = useSearchParams()
	const [ tokenModalOpen, setTokenModalOpen ] = useState(false)
	const lastChanged = useRef("usd_amount")

	const { createTransactionRequest, createTransaction } = useContext(TransactionsContext)

	const params = new URLSearchParams(searchParams)

	const initialValues = {
		usd_amount: Number.parseFloat(params.get("usd_amount") || "0") || 1000,
		buy_token_amount: 1,
		token: currencyTokenList?.find((token) => token.id === params.get("token_id")) || currencyTokenList?.[0]
	}

	const [ values, setValues, valuesRef ] = useStateRef(initialValues)
	
	useEffect(() => {
		if (values.token !== undefined || !currencyTokenList || currencyTokenList.length === 0) return

		let found = currencyTokenList?.find((token) => {
			return token.id === params.get("token_id")
		})
		updateValue("token", found || currencyTokenList?.[0])
	}, [values?.token, currencyTokenList])
	
	const minimumAmountRequest = useGetMinimumAmount()

	useEffect(() => {
		if (!values.token?.id) return;
		minimumAmountRequest.sendRequest(values.token.id)
	}, [values.token, prices])


	const updateValue = (key: string, value: any) => {
		if (["usd_amount", "buy_token_amount"].includes(key)) lastChanged.current = key;
		setValues((val) => {
			let newValues = {...val, [key]: value}
			return newValues
		})
		updatePrices()
	}

	const updatePrices = (newPrices: PricesResponse = prices) => {
		const { usd_amount, buy_token_amount, token} = valuesRef.current
		let tokenSymbol = token?.symbol || ""
		if (lastChanged.current === "usd_amount") {
			setValues((vals) => ({
				...vals,
				buy_token_amount: (usd_amount as number) !== 0 ? (usd_amount as number) / (newPrices[tokenSymbol]?.USD || 1) : 0
			}))
		} else {
			
			setValues((vals) => ({
				...vals,
				usd_amount: (newPrices[tokenSymbol]?.USD || 1) * (buy_token_amount as number)
			}))
		}
	}

	const [ bonusLoading, setBonusLoading ] = useState(false)

	const fetchBonuses = useDebounce(() => {
		let vals = valuesRef.current
		if (!vals.token?.id || !activeStage) return;
		let usd = vals.usd_amount
		bonusCalculationRequest.sendRequest({
			purchase_token_id: vals.token?.id,
			bonuses: activeStage?.bonuses,
			purchase_amount: vals.usd_amount,
			token_price: activeStage.token_price
		}).then(() => {
			setBonusUSDFixed(usd)
		}).finally(() => {
			setBonusLoading(false)
		})
	}, 200)

	const updateBonuses = () => {
		setBonusLoading(true)
		fetchBonuses()
	}

	useEffect(() => {
		updateBonuses();
	}, [values, activeStage])

	const { getTimeRemaining } = useInterval(useCallback(async () => {
		if (Date.now() - priceRequest.fetchedAt < 60 * 100 || priceRequest.fetching) return;
		let prices = await refreshPrices()
		updatePrices(prices)
	}, []), 60*1000, true)
	

	useInterval(useCallback(() => setTimeRemaining(Math.floor(getTimeRemaining() / 1000)), []), 1000, true)

	const toDisplay = (num: number) => {
		return floorToDP(num, 5)
	}

	let bonuses: {label: string, amount: number, dollar: number}[] = useMemo(() => {
		let bonusArr = Object.entries(bonusCalculationRequest.data || {}).map(([key, value]) => ({
			label: getBonusName(key),
			amount: (value * (activeStage?.token_price || 0)) * 100 / (bonusUSDFixed || 1),
			dollar: (value * (activeStage?.token_price || 0))
		})).filter((bonus) => bonus.amount > 0)

		return bonusArr
	}, [bonusCalculationRequest, activeStage])

	const totalBonus = useMemo(() => {
		return bonuses.reduce((acc, currBonus) => ({amount: acc.amount + (currBonus.amount || 0), dollar: acc.dollar + (currBonus.dollar || 0)}), {amount: 0, dollar: 0})
	}, [bonuses])

	const totalBonusItem = {label: "Total Bonus", amount: totalBonus.amount, dollar: totalBonus.dollar}

	const alertContext = useContext(AlertContext)

	const [ transactionDetailsOpen, setTransactionDetailsOpen ] = useState(false)
	const [ createdTransaction, setCreatedTransaction ] = useState<Transaction>();


	const createPurchaseTransaction = () => {
		if (!values.token?.id) return;
		createTransaction({
			purchase_amount: values.usd_amount,
			purchase_token_id: values.token?.id
		}).then((res) => {
			alertContext.addAlert({type: "success", label: "Successfully created transaction", duration: 4000})
			setCreatedTransaction(res.data)
			setTransactionDetailsOpen(true)
		}).catch((err) => {
			alertContext.addAlert({type: "error", label: errorToString(err, "Error creating transaction")})
		})
	}

	const minimum = Math.max(minimumAmountRequest.data?.min_amount_fiat || 0, activeStage?.min_fiat_amount || 0)
	const maximum = activeStage?.max_fiat_amount || Infinity

	return (
		<Page path="/buy" title="Buy" userRestricted>
			{presaleEnded ? (
				<div className="buy-page flex items-center justify-center p-4">
					<Card className="presale-ended">
						<CardTitle center>
							Presale has Ended
						</CardTitle>
					</Card>
				</div>
			) : (
			<>
			<p className="buywelcomeText welcomeText"
					>Welcome back, {user?.first_name}</p>
			<div className="buy_page_carlossy">
			
			<div>
			<Form
				className={clsx("buy-page", {"modal-open": tokenModalOpen})}
				initialValues={values}
				values={values}
				onUpdate={(newVals) => {
					setValues(newVals as typeof values)
					updatePrices()
				}}
				onSubmit={() => createPurchaseTransaction()}
				validationSchema={
					Yup.object()
						.shape({
							usd_amount: Yup.number()
								.min(minimum, `Can't spend less than ${formatNumber(minimum)}`)
								.max(maximum, `Can't spend more than ${formatNumber(maximum)}`)
						})
					}
			>
				<Loader loading={currProjectRequest.fetching}>
					
					<FormPage
						// title={`Buy ${currentProject?.symbol.toUpperCase() || "Tokens"}`}
						title={`Buy Token`}
						classes={{body: "flex-gap-y-6", wrapper: "relative"}}
						outsideElement={
							<SelectModalWrapper open={tokenModalOpen}>
								<FormTokenSelectModal
									bonuses={activeStage?.bonuses.payment_tokens}
									className="fixed pointer-events-auto"
									open={tokenModalOpen}
									onClose={() => setTokenModalOpen(false)}
									field="token"
								/>
							</SelectModalWrapper>
						}
					>
						<div className="form-item">
							<label htmlFor="buy-token-amount">I want to pay with</label>
							<FormRender>
										{(formContext) => (
											<CurrencyItemDisplay
											style={{backgroundColor:'#EEEAE6',color:'#46403B'}}
											    className="pay_with"
												currencyItem={formContext.values.token}
												currencyList={currencyTokenList}
												component={Button}
												type="button"
												color="bg-light"
												flush="left"
												onClick={() => setTokenModalOpen(true)}
												bonuses={activeStage?.bonuses.payment_tokens}
											>
												<DropdownIcon className="w-3 h-3 ml-2 fill-current !text-text-primary" />
											</CurrencyItemDisplay>
										)}
									</FormRender>
							{/* <FormNumberInput
								id="buy-token-amount"
								field="buy_token_amount"
								onFocus={() => lastChanged.current = "buy_token_amount"}
								maxDecimals={5}
								rightContent={(
									<FormRender>
										{(formContext) => (
											<CurrencyItemDisplay
												currencyItem={formContext.values.token}
												currencyList={currencyTokenList}
												component={Button}
												type="button"
												color="bg-light"
												flush="left"
												onClick={() => setTokenModalOpen(true)}
												bonuses={activeStage?.bonuses.payment_tokens}
											>
												<DropdownIcon className="w-3 h-3 ml-2 fill-current !text-text-primary" />
											</CurrencyItemDisplay>
										)}
									</FormRender>
								)}
							/> */}
						</div>
						<div className="form-item">
							<label htmlFor="usd-amount"
							style={{ marginBottom:'-17px' }}
							>I want to buy</label>
							<div className="buy_container">
								<FormNumberInput
							    className='buypage_input'
								id="usd-amount"
								field="usd_amount"
								rightContent={<CurrencyItemDisplay currencyItem={dollarItem} />}
								onFocus={() => lastChanged.current = "usd_amount"}
							/>
							<div>
								<img src='/imagesCarlossy/arrowright.png'/>
							</div>
							<div className="buy_eth_container">
								<p>Amount in ETH</p>
								<div>{toDisplay(values.buy_token_amount)} {values.token?.symbol}</div>
							</div>
							</div>
							
							{/* <TieredBonusButtons
								bonuses={activeStage?.bonuses.tiered_fiat || []}
								onSelect={(item) => updateValue("usd_amount", item.amount)}
								usdAmount={values.usd_amount}
							/> */}
						</div>
						
						{/* <div className="form-item">
							<span>
								Eligible Bonuses <Info>
								Bonuses may change depending on your pending transactions e.g. referral bonus for a transaction might not be awarded if a previous transaction completes and obtains a referral bonus
								</Info>
							</span>
							<Loader loading={bonusLoading}>
								<Collapse
									classes={{inner: "bonus-list"}}
									title={
										<div className="bonus-item total">
											<span className="bonus-label">{totalBonusItem.label}</span>
											<Loadable component="span" length={2} className="bonus-percent">+{floorToDP(totalBonusItem.amount || 0, 0)}%</Loadable>
											<Loadable component="span" length={2.5} className="bonus-usd">+${floorToDP((totalBonusItem.dollar || 0), 2)}</Loadable>
										</div>
									}
								>
									{bonuses.map((bonus) => (
										<div
											key={bonus.label}
											className={clsx("bonus-item", {total: bonus.label === "Total"})}
										>
											<Loadable component="span" className="bonus-label">{bonus.label}</Loadable>
											<Loadable component="span" length={2} className="bonus-percent">+{floorToDP(bonus.amount || 0, 0)}%</Loadable>
											<Loadable component="span" length={2.5} className="bonus-usd">+${floorToDP(bonus.dollar || 0, 2)}</Loadable>
										</div>
									))}
								</Collapse>
							</Loader>
						</div> */}

						<div className="promo_field">
							<p>Insert Promo Code if any (optional)</p>
							<input type="text"
							
							/>
						</div>
						<div>
							I will recieve
						</div>
						<div className="recieve">
							<div className="recieve_inner">
								<p>6604866.290925</p>
								<div>
									<img src='/imagesCarlossy/carlossyface.png'/><span>$CARL</span>
								</div>
								
							</div>
								
						</div>
						<div className="form-item">
							{/* <span className="flex">
								Summary
								<span className="ml-auto">
									Quote updates in {timeRemaining}s
								</span>
							</span> */}
							{/* <div className="summary-container">
								You send
								<span className="font-semibold mx-1">
									{toDisplay(values.buy_token_amount)} {values.token?.symbol}
								</span>
								for
								<span className="font-semibold mx-1">
									{formatLargeNumber((values.usd_amount + (totalBonus.dollar || 0)) / (activeStage?.token_price || 1))}
								</span>
								{currentProject?.symbol}
							</div> */}
						</div>
						<div className="flex-1 !mb-0" />
						<div className="agreetoterms">
						<input type="checkbox"
						/><span>I hereby agree to the token purchase agreement and token sale term</span>
						</div>
						<Button
							color="primary"
							loading={createTransactionRequest.fetching}
							disabled={currProjectRequest.fetching || activeStageRequest.fetching || minimumAmountRequest.fetching || bonusLoading}
						>
							Make Payment
						</Button>
					</FormPage>
				</Loader>
			</Form>
		</div>
		{/* <div className="token_info_buy_page"
		
		>
			<div className="token_info_first">
				<div className="token_balance_buypage">
				<p className="tokenbalancetext">Token Balance</p>
				<h1 className="midtexttokenfirst">683,948,283 CARL</h1>
				<p>$121,873,483.903</p>
			</div>
			<div className="token_balance_buypage">
				<p>Your Contribution in</p>
				<div className="contribution_numbers">
				<div>
				<h1>$12K</h1>
				<p>USD</p>	
				</div>
				<div>
					<h1>4.2</h1>
					<p>ETH</p>
				</div>
				<div>
					<h1>0.34</h1>
					<p>BTC</p>
				</div>
				</div>
				{/* <p>$121,873,483.903</p>
			</div>
			</div>
			
			<div className="presale_info">
				<div className="presale_info_one">
				<div>
				<p style={{marginBottom:'15px',fontWeight:'600',color:"#582900"}}>Presale Information</p>
				<p className="info_one_text">Presale Stage</p>
				<div className="running_stage_2"><p style={{color:'##582900'}}>Stage 2</p><span className="running_info">Running</span></div>
				</div>

				<div>
				<p className="info_one_text">Current Bonus</p>
				<p style={{fontWeight:'600',color:"#582900"}}>3% per transaction</p>
				</div>
				
				<div>
				<p className="info_one_text">Start date</p>
				<p style={{fontWeight:'600',color:"#582900"}}>18th July 2022</p>
				</div>
				</div>
				<div className="presale_info_two">
					<div>
					<p className="info_one_text">Token Price</p>
					<div className="token_price_small">
					<p style={{fontWeight:'600',color:"#582900"}}>$0.00152</p><span style={{color:'green'}}>+125%</span>
					</div>
					</div>

					<div>
					<p className="info_one_text">Exchange rate</p>
					<p style={{fontWeight:'600',color:"#582900"}}>1 USD = 0.1232 ETH</p>
					</div>
					
					<div>
					<p className="info_one_text">End Date</p>
					<p style={{fontWeight:'600',color:"#582900"}}>18th July 2022</p>
					</div>
					
				</div>
			</div>
			<div className="presale_progress">
				<div>
				<p style={{fontWeight:'600',color:'#7D7975'}}>Presale Stage Progress</p>
				<div className="presale_progress_inner">
				<div>
					<div className="inner_CARL">
						<div style={{backgroundColor:"#744D2B"}}></div><p className="info_one_text">Total Stage Tokens</p>
					</div>
					<p style={{fontWeight:'600',color:"#582900"}}>10 million CARL</p>
				</div>
				<div>
					<div className="inner_CARL">
						<div style={{backgroundColor:"#6A8F1A"}}></div><p className="info_one_text">Solid Tokens</p>
					</div>
					<p style={{fontWeight:'600',color:"#582900"}}>4.4 million CARL</p>
				</div>
				<div>
					<div className="inner_CARL">
					<div style={{backgroundColor:'#C6D570'}}></div><p className="info_one_text">Remaining Tokens</p>
					</div>
					<p style={{fontWeight:'600',color:"#582900"}}>6.6 million CARL</p>
				</div>
				</div>
				</div>
				<div>
					<img src='/imagescarlossy/carlchart.png'/>
				</div>
			</div>
		</div> */}
	</div>

	<div className="dashboardBottom_carlossy">
				<p >We support a wide range of crypto</p>
				<div className="images_bottom">
				<img src='/imagesCarlossy/1.png'/>
				<img src='/imagesCarlossy/2.png'/>
				<img src='/imagesCarlossy/3.png'/>
				<img src='/imagesCarlossy/4.png'/>
				<img src='/imagesCarlossy/5.png'/>
				<img src='/imagesCarlossy/6.png'/>
				<img src='/imagesCarlossy/7.png'/>
				<img src='/imagesCarlossy/8.png'/>
				<img src='/imagesCarlossy/9.png'/>
				<img src='/imagesCarlossy/10.png'/>
				<img src='/imagesCarlossy/11.png'/>
				<img src='/imagesCarlossy/12.png'/>
				<img src='/imagesCarlossy/13.png'/>
				<img src='/imagesCarlossy/14.png'/>
				<img src='/imagesCarlossy/15.png'/>
				<img src='/imagesCarlossy/16.png'/>
				<img src='/imagesCarlossy/17.png'/>
				</div>
				
			</div>
			
			<TransactionDetails
				transaction={createdTransaction || defaultTransaction}
				open={transactionDetailsOpen}
				onClose={() => setTransactionDetailsOpen(false)}
			/>
			</>
			)}
		</Page>
	)
}

export default BuyPage

export type CurrencyItemDisplayProps = React.HTMLAttributes<HTMLDivElement> & {
	classes?: {
		bonusChip?: string
	},
	currencyItem?: CurrencyItem,
	component?: ComponentType,
	currencyList?: CurrencyItem[],
	bonuses?: TokenBonus[],
	fullDetails?: boolean,
	[key: string]: any
}

export const CurrencyItemDisplay: Component<CurrencyItemDisplayProps> = ({
	currencyItem, component = "div", children, currencyList,
	bonuses, classes, fullDetails, ...others
}) => {
	const bonusItem = bonuses ? bonuses.find((bonus) => bonus.token_id.toLowerCase() === currencyItem?.id?.toLowerCase()) : undefined;

	const Comp = (component || "div") as Component<any>
	
	const duplicate = useMemo(() => {
		return isDuplicate(currencyItem, currencyList || [], (currItem) => currItem?.symbol === currencyItem?.symbol)
	}, [currencyItem, currencyList])


	return (
		<Comp
			{...others}
			className={
				clsx(
					"currency-display-item",
					others.className,
				)
			}>
			<div className="currency-image-container">
				<Loadable component="img"
					className="currency-image"
					src={currencyItem?.imageUrl || placeholder.tokenImage}
				/>
				{duplicate && (
					<div className="chain-chip">
						{currencyItem?.chain?.substring(0,1)}
					</div>
				)}
			</div>
			<Loadable length={2} component="span" className="text-container">
				{currencyItem?.symbol}
				{fullDetails && ` - ${currencyItem?.chain} `}
				{/* {bonusItem && <span className={clsx("text-2xs text-success-light font-bold bg-background-contrast py-0.5 px-1.5 rounded-full", classes?.bonusChip)}>
					+{bonusItem.percentage}%
				</span>} */}
			</Loadable>
			{children}
		</Comp>
	)
}