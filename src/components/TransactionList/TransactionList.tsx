import clsx from "clsx"
import { QRCodeCanvas } from "qrcode.react"
import React, { useContext, useEffect, useRef, useState } from "react"
import { ProjectContext } from "../../context/ProjectContext"
import { TransactionsContext } from "../../context/TransactionsContext"
import { defaultTransaction } from "../../defaults/Api"
import { Transaction } from "../../types/Api"
import { Component } from "../../types/Util"
import { apiToCurrency, capitalize, CurrencyItem, formatLargeNumber, formatNumber, getWalletQRValue } from "../../util"
import Button from "../Button"
import Card, { CardBody, CardTitle } from "../Card"
import Chip from "../Chip"
import Collapse from "../Collapse"
import Dialog, { DialogProps } from "../Dialog"
import { Loadable, Loader } from "../Loader"
import Pagination from "../Pagination"

import WarningIcon from "../../svg/icons/warning.svg"

import "./TransactionList.css"
import Input from "../Input"
import { CurrencyItemDisplay } from "../BuyPage"
import placeholder from "../../constants/placeholder"
import { AuthContext } from "../../context/AuthContext"
import { AlertContext } from "../../context/AlertContext"
import { Link } from "react-router-dom"

const TransactionList: Component = () => {
	const { transactions, getTransactionsRequest } = useContext(TransactionsContext)
	const params = new URLSearchParams(location.search)
	const { user } = useContext(AuthContext)
	const [ selectedTransaction, setSelectedTransaction ] = useState<Transaction | undefined>()
	const [ detailsOpen, setDetailsOpen ] = useState(false)

	const alertContext = useContext(AlertContext)

	const afterRef = useRef<string | undefined>()

	const [ page, setPage ] = useState(1)

	const paramsRef = useRef(false)

	useEffect(() => {
		let id = params.get("id")
		if (!id || paramsRef.current || transactions.length === 0) return;
		paramsRef.current = true;
		let transaction = transactions.find((txn) => txn.id === params.get("id"))
		if (!transaction) return;
		setSelectedTransaction(transaction)
		setDetailsOpen(true)
	}, [params, transactions])

	const next = () => {
		let after = getTransactionsRequest.data?.after?.[0]?.["@ref"].id
		if (!user || !after) return;
		getTransactionsRequest
			.sendRequest(user?.id, after)
			.then(() => setPage((page) => page + 1))
			.catch(() => alertContext.addAlert({type: "error", label: "Error getting transactions"}))
	}
	
	const prev = () => {
		let before = getTransactionsRequest.data?.before?.[0]?.["@ref"].id
		if (!user || !before) return;
		getTransactionsRequest
			.sendRequest(user?.id, undefined, before)
			.then(() => setPage((page) => page - 1))
			.catch(() => alertContext.addAlert({type: "error", label: "Error getting transactions"}))
	}

	return (
		<Loader loading={getTransactionsRequest.fetching}>
			{(transactions.length || getTransactionsRequest.fetching) > 0 ? (
				<Pagination
					page={page}
					onNext={() => next()}
					onPrevious={() => prev()}
					prevDisabled={getTransactionsRequest.data?.before === undefined || getTransactionsRequest.fetching}
					nextDisabled={getTransactionsRequest.data?.after === undefined  || getTransactionsRequest.fetching}
				>
					<div className="transactions-list">
						<div className="transactions-wrapper">
					<div className="item-value tablehead">
						<div>
							<p>Transaction ID</p>
						</div>
						<div>
							<p>Tokens</p>
						</div>
						<div>
							<p>Payment</p>
						</div>
						<div>
							<p>Amount</p>
						</div>
						<div>
							<p>USD</p>
						</div>
						<div
						style={{marginLeft:'40px',marginRight:'90px'}}
						>
							<p>To</p>
						</div>
						<div>
							<p>Type</p>
						</div>
						<div>
							<p>Status</p>
						</div>
					</div>
							{(getTransactionsRequest.fetching ? new Array(5).fill(defaultTransaction) : getTransactionsRequest.data?.data || []).map((txn, i) => (
								<TransactionItem
									key={i}
									transaction={txn}
									onActionClick={() => {
										setSelectedTransaction(txn)
										setDetailsOpen(true)
									}}
								/>
							))}
						</div>
					</div>
					<TransactionDetails
						transaction={selectedTransaction}
						open={detailsOpen}
						onClose={() => setDetailsOpen(false)}
					/>

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
				</Pagination>
			) : (
				<div className="transactions-list">
					
					<div className="transactions-wrapper">
						<div className="transaction-item">No transactions</div>
					</div>
				</div>
			)}
		</Loader>
	)
}

export default TransactionList

export type TransactionItemProps = {
	transaction: Transaction,
	onActionClick: (txn: Transaction) => void
}

const statusColorMap: Record<Transaction["status"] | Transaction["type"], [string, string]> = {
	completed: ["bg-success-main", "text-success-contrastText"],
	expired: ["bg-error-main", "text-error-contrastText"],
	failed: ["bg-error-main", "text-error-contrastText"],
	pending: ["bg-warning-main", "text-warning-contrastText"],
	processing: ["bg-info-main", "text-info-contrastText"],
	referral: ["bg-info-main", "text-info-contrastText"],
	purchase: ["bg-info-main", "text-info-contrastText"],
}


let myDate: any = new Date();

const tos=['0xY69V9wtJ32...','Trx69V9wtJ32...','BepY69V9wtJ32...','0xY69V9wtJ32...']

// function shuffle(array:'typeof array') {
//   let currentIndex = array.length,  randomIndex;

//   // While there remain elements to shuffle.
//   while (currentIndex != 0) {

//     // Pick a remaining element.
//     randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [array[currentIndex], array[randomIndex]] = [
//       array[randomIndex], array[currentIndex]];
//   }

//   return array;
// }
function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
};

// tos.forEach(tos=>{
// 	return tos[idx]
// })

const idx=Math.floor(Math.random()*tos.length)
const idx2=Math.floor(Math.random()*tos.length)
const idx3=Math.floor(Math.random()*tos.length)






export const TransactionItem: Component<TransactionItemProps> = ({ transaction, onActionClick }) => {
	const paymentToken = apiToCurrency(transaction.payment_token)
	const { currentProject } = useContext(ProjectContext)
	return (
		<>
		<div>
			<div className="transaction-item flex-gap-x-1">
			

			<div>
				<p>TNX005415</p>
				<span style={{color:'#7D7975',fontSize:'0.7rem'}}>{myDate.getDate()}</span>-<span style={{color:'#7D7975',fontSize:'0.7rem'}}>{myDate.getMonth()}</span>-<span style={{color:'#7D7975',fontSize:'0.7rem'}}>{myDate.getFullYear()}</span> | <span style={{color:'#7D7975',fontSize:'0.7rem'}}>{myDate.getHours()}:{myDate.getMinutes()}</span>
			</div>

			<span className="item-value token-value">
				{/* <Loadable component="img" className={clsx("token-image", {"invisible": transaction.type === "referral"})} src={paymentToken.imageUrl || placeholder.tokenImage } />
			</span>
			{transaction.type === "purchase" ? (
				<span className="item-value">
					<div className="value-group">
						<Loadable component="span">
							{formatLargeNumber(transaction.initial_purchase_amount_crypto)} 
							{" "}{paymentToken.symbol}
						</Loadable>
						<Loadable component="span" className="value-sub">
							${formatLargeNumber(transaction.initial_purchase_amount_fiat)}
						</Loadable>
					</div>*/}
					<p style={{marginTop:"10px"}}>+124,827,048.90</p>
					<p style={{color:'#7D7975',fontSize:'0.7rem'}}>CARL</p>
				</span>
				<span 

				className="item-value payment-column">
					{paymentToken.symbol}
				</span> 
				{/* <span className="item-value">
					<Loadable component={Chip} compact className={clsx(statusColorMap[transaction.type], "transaction-chip")}>
						{capitalize(transaction.type)}
					</Loadable>
				</span> */}
			<span className="item-value amount-column">
				<p
				style={{marginTop:"8px",marginRight:'20px'}}
				>{formatLargeNumber(transaction.initial_purchase_amount_crypto)}</p>
				<p style={{color:'#7D7975',fontSize:'0.7rem'}}>{paymentToken.symbol}</p>
			</span>
			<span className="item-value">
				<div
				style={{marginLeft:'20px'}}
				>
				<p>{formatLargeNumber(transaction.tokens.total * transaction.token_price, 1000, 0, 2)}</p>
				<p style={{color:'#7D7975',fontSize:'0.7rem'}}>USD</p>
				</div>
				
			</span>
			<span className="item-value">
				<div>
				<p>0xY69V9wtJ32...</p>
				<p style={{color:'#7D7975',fontSize:'0.7rem'}}>BEP 2.0 Address</p>
				</div>
			</span>
			{/* <span className="item-value">
				<div className="value-group">
					<Loadable component="span">
						{formatLargeNumber(transaction.tokens.total)} {currentProject?.symbol}
					</Loadable>
					<Loadable component="span" className="value-sub">
						${formatLargeNumber(transaction.tokens.total * transaction.token_price, 1000, 0, 2)}
					</Loadable>
				</div>
			</span> */}
			
			<span className="item-value"
			style={{color:'#46403B'}}
			>
						{capitalize(transaction.type)}
					
			</span>
			<span className="item-value">
				<div className="value-group"
				style={{color: '#9C8129'}}
				>
					<img src='/imagesCarlossy/pending.png'/>
					<div>
						{capitalize(transaction.status)}
						<p style={{fontSize:'0.5rem',color:'#7D7975'}}>See Details</p>
					</div>
				</div>
			</span>
			{/* <span className="item-value action-value">
				{transaction.status === "pending" && (
					<Button
						rounded
						type="button"
						className="!px-3 !py-1 text-sm w-full"
						color="primary"
						buttonStyle={transaction.status === "pending" ? "contained" : "outlined"}
						onClick={(e) => {
						e.stopPropagation()
							onActionClick(transaction)
						}}
					>
						{transaction.status === "pending" ? "Pay" : "Details"}
					</Button>
				)}
			</span> */}	
		</div>
		</div>
		</>
	)
}

export type TransactionDetailsProps = DialogProps & {
	transaction?: Transaction
}

export const TransactionDetails: Component<TransactionDetailsProps> = ({ transaction, ...others }) => {
	const inputRef = useRef<HTMLInputElement>()

	const apiToken: CurrencyItem | Record<string, any> = transaction?.payment_token ? apiToCurrency(transaction?.payment_token) : {}

	return (
		<Dialog {...others} className={clsx("transaction-details", others.className)}>
			<Card className="transaction-details">
				<CardTitle center
				style={{marginLeft:'-200px',marginBottom:'-30px'}}
				>
					Confirm your receipt
				</CardTitle>
				<p >Your Order no. TNX005414 has been placed & waiting for payment. To receive 6781302.75 CARL token, please make your payment of 1000.99 USDT(TRC20). The token balance will appear in your account once we received your payment.</p>
				<p style={{marginBottom:'-30px'}}>Make your payment to the below address</p>
				<CardBody className="transaction-details-body flex-gap-y-2">
					{transaction?.status === "pending" && (
						<div className="pending-container">
							<img src="/imagesCarlossy/qrcode.png"/>
							{/* <QRCodeCanvas size={160} className="qr-code" value={getWalletQRValue(transaction.payment_token, transaction.payment_address)} /> */}
							
							{/* <div className="warning">
								<span className="warning-wrapper">
								<WarningIcon />
									Make sure you pay <span className="font-semibold">
										{transaction.initial_purchase_amount_crypto} {transaction.payment_token.short_name}
									</span> to the address below on the <span className="font-semibold">
										{apiToken?.chain || ""}
									</span> blockchain.
								</span>
							</div> */}
						</div>
					)}
					<div className="form-item">
						<label htmlFor="wallet-address"
						style={{fontSize:"0.7rem"}}
						>Address</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value='TM2GNNhaQuMt6qpqFzMPcrwKBVU...'
							id="wallet-address"
							copyable
						/>
					</div>
					{/* <div className="form-item">
						<label htmlFor="crypto-amount">Amount to Pay</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value={transaction?.initial_purchase_amount_crypto}
							id="crypto-amount"
							copyable
						/>
					</div> */}
					<div className="form-item">
						<label htmlFor="crypto-amount">Payment memo</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value='2038372'
							id="crypto-amount"
							copyable
						/>
					</div>
					<div className="form-item">
						<label htmlFor="crypto-amount">Amount</label>
						<Input
							ref={(el) => inputRef.current = (el || undefined)}
							value='1000.99'
							id="crypto-amount"
							copyable
						/>
					</div>
					<p>Tokens will appear in your account after payment successfully made and approved by our team. Please note that tokens will be distributed after the token sales end-date <Link to='/transactions'><h1 style={{fontSize:"1rem",color:"#7D7975"}}>Click Here If you already paid</h1></Link></p>
					{/* <div className="form-item">
						<label htmlFor="crypto-amount">Amount</label>
						{apiToken && (
							<CurrencyItemDisplay
								currencyItem={apiToken as CurrencyItem}
								className="rounded-item w-full bg-background-contrast py-3"
								fullDetails
							/>
						)}
					</div> */}
				</CardBody>
			</Card>
			
		</Dialog>
		
	)
}