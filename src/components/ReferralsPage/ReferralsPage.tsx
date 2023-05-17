// import React, { useContext, useEffect, useState } from "react"
// import { AuthContext } from "../../context/AuthContext"
// import { ProjectContext } from "../../context/ProjectContext"
// import { StageContext } from "../../context/StageContext"
// import { Component } from "../../types/Util"
// import { formatLargeNumber, formatNumber, generateShareLink, getURL, useGetReferralStats } from "../../util"
// import Button from "../Button"
// import Card, { CardBody, CardTitle } from "../Card"
// import Input from "../Input"
// import Page from "../Page"

// import "./ReferralsPage.css"

// import FacebookIcon from "../../svg/icons/facebook.svg"
// import TwitterIcon from "../../svg/icons/twitter.svg"
// import TelegramIcon from "../../svg/icons/telegram.svg"
// import ShareIcon from "../../svg/icons/share.svg"

// import Dialog from "../Dialog"

// import { ReferralContext } from "../../context/ReferralContext"
// import { Loadable, Loader } from "../Loader"
// import clsx from "clsx"

// const ReferralsPage: Component = () => {
// 	const { activeStage, activeStageRequest } = useContext(StageContext)
// 	const { currentProject, currProjectRequest } = useContext(ProjectContext)
// 	const { user, userRequest } = useContext(AuthContext)

// 	const [ modalOpen, setModalOpen ] = useState(false)

// 	const shareText = `Use my referral link to get $${activeStage?.bonuses?.referrals?.earn}`
// 	const shareUrl = `${getURL(currentProject?.frontend_url || "")}/register?referral=${user?.id}`

// 	const earn = activeStage?.bonuses?.referrals?.earn || 0
// 	const spend = activeStage?.bonuses?.referrals?.spend || 0

// 	const loading = activeStageRequest.fetching || currProjectRequest.fetching || userRequest.fetching

// 	return (
// 		<div>

// 		</div>
// 	)
// 		<Page path="/referrals" title="Referrals">
// 			<div className="referrals-page flex-gap-y-4">
// 				<ReferralInfoCard
// 					shareText={shareText}
// 					shareUrl={shareUrl}
// 					onHowToClick={() => !loading && setModalOpen(true)}
// 					earn={earn}
// 					spend={spend}
// 					loading={loading}
// 				/>
// 				<ReferralStatsCard />
// 				<ReferralHowToDialog
// 					open={modalOpen}
// 					onClose={() => setModalOpen(false)}
// 					earn={earn}
// 					spend={spend}
// 				/>
// 			</div>
// 		</Page>
// 	)
// }

// export default ReferralsPage

// export const ReferralInfoCard: Component<{
// 	onHowToClick?: () => void
// 	earn: number,
// 	spend: number,
// 	shareUrl: string,
// 	shareText: string,
// 	loading?: boolean
// }> = (props) => {
// 	return (
// 		<Loader loading={!!props.loading}>
// 			<Card className="referrals-card">
// 				<CardBody className="flex flex-col flex-gap-y-4">
// 					<div className="referrals-description flex-gap-y-1">
// 						<Loadable component="h1">Refer & Earn Rewards</Loadable>
// 						<Loadable component="p">Earn ${props.earn} per referral when they spend ${props.spend} or more</Loadable>
// 						<Button
// 							color="primary"
// 							compact
// 							buttonStyle="transparent"
// 							onClick={props.onHowToClick}
// 						>
// 							How it Works?
// 						</Button>
// 					</div>
// 					<Input
// 						value={props.loading ? "" : props.shareUrl}
// 						copyable
// 					>
// 						<Loadable variant="block" loadClass="w-[calc(100%-4.5rem)] absolute left-4 h-5 top-1/2 -translate-y-1/2" />
// 					</Input>
// 					<div className={clsx("referral-share-buttons gap-2", {"can-share": !!navigator.share})}>
// 						<Button
// 							compact
// 							color="bg-light"
// 							icon={FacebookIcon}
// 							component="a"
// 							target="_blank"
// 							href={generateShareLink("facebook", props.shareText, props.shareUrl)}
// 						>Share</Button>
// 						<Button
// 							compact
// 							color="bg-light"
// 							icon={TwitterIcon}
// 							component="a"
// 							target="_blank"
// 							href={generateShareLink("twitter", props.shareText, props.shareUrl)}
// 						>Tweet</Button>
// 						<Button
// 							compact
// 							color="bg-light"
// 							icon={TelegramIcon}
// 							href={generateShareLink("telegram", props.shareText, props.shareUrl)}
// 							target="_blank"
// 							component="a"
// 						>Post</Button>
// 						<Button
// 							compact
// 							color="bg-light"
// 							icon={ShareIcon}
// 							onClick={() => {
// 								if (!navigator.share) return;
// 								navigator.share({
// 									url: props.shareUrl,
// 									text: props.shareText
// 								})
// 							}}
// 						>Share</Button>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</Loader>
// 	)
// }

// export const ReferralStatsCard: Component = () => {
// 	const { referralStats, getReferralStatsRequest } = useContext(ReferralContext)
// 	const { activeStage, activeStageRequest } = useContext(StageContext)

// 	return (
// 		<Loader loading={getReferralStatsRequest.fetching || activeStageRequest.fetching}>
// 			<Card>
// 				<CardTitle center>Referred Friends</CardTitle>
// 				<CardBody className="referral-stats flex-gap-x-4">
// 					<div className="referral-stat referred">
// 						<Loadable length={1} component="p" className="referral-stat-value">{referralStats?.referred}</Loadable>
// 						<span className="referral-stat-label">Referred</span>
// 					</div>
// 					<div className="referral-stat dollar">
// 						<Loadable length={2} component="p" className="referral-stat-value">${formatLargeNumber((referralStats?.earned_tokens || 0) * (activeStage?.token_price || 0), 1000, 0, 2)}</Loadable>
// 						<span className="referral-stat-label">Earned</span>
// 					</div>
// 				</CardBody>
// 			</Card>
// 		</Loader>
// 	)
// }

// export const ReferralHowToDialog: Component<{open: boolean, onClose: () => void, earn: number, spend: number}> = (props) => {
// 	return (
// 		<Dialog open={props.open} onClose={props.onClose} className="referrals-how-root">
// 			<Card className="referrals-how-container">
// 				<CardTitle>
// 					How it Works
// 				</CardTitle>
// 				<CardBody className="referrals-how flex-gap-y-8">
// 					{[
// 						{title: "Share Link", desc: "Share your unique referral link with friends and have them sign up through it"},
// 						{title: "Top Up", desc: `Once a friend registers, have them make a purchase of at least $${props.spend}`},
// 						{title: "Earn $", desc: `Both you and your friend will earn $${props.earn} in tokens`},
// 					].map((item, i) => (
// 						<div className="referrals-how-step" key={i}>
// 							<span className="step-num">{i+1}</span>
// 							<div className="step-text">
// 								<h2>{item.title}</h2>
// 								<p>{item.desc}</p>
// 							</div>
// 						</div>
// 					))}
// 				</CardBody>
// 			</Card>
// 		</Dialog>
import React from 'react'
import { Link } from 'react-router-dom'
import './ReferralsPage.css'


const ReferralsPage = () => {
  return (
	<div className='myToken'>
		<p className='welcomeText'>Welcome back</p>
		<div className='myToken_container'>
			<div className='myToken_inner'>
				<p className='myToken_header'
				style={{fontWeight:'700',color:'#582900'}}
				>My Token</p>
				<div className='tabs_token_carl'>
					<Link to='/referrals'
					style={{textDecoration:'none'}}
					>
					<div>
						CARL Tokens
					</div>
					</Link>
					<Link to='/referralsinfo'
						style={{textDecoration:'none'}}
						>
					<div>
							Referrals
					</div>
					</Link>
				</div>
				<div className='carl_tokens_flex'>
					<div className='carl_tokens_1'>
					<div className='carl_tokens_1a'>
						<p className='token_balance_text'>Token Balance</p>
						<p className='carl_number'>683,948,283 CARL</p>
						<p className='carl_number_2'>$121,873,483,903</p>
						<button>Buy More $CARL</button>
					</div>
					<div className='carl_tokens_1b'>
						<div className='carl_tokens_1b_inner'>
						<div className='circle_container '>
							<div className='small_circle circle_container1'></div><span>Purchased Tokens</span>
						</div>
						<p>683,948,283 CARL</p>
						<div>
							<div className='circle_container '>
								<div className='small_circle circle_container2'></div><span>Referral Tokens</span>
							</div>
							<p>948,283 CARL</p>
						</div>
						<div>
							<div className='circle_container '>
								<div className='small_circle circle_container3'></div><span>Bonus Tokens</span>
							</div>
							<p>8,283 CARL</p>
						</div>
						</div>
						<div>
							<img src='/imagesCarlossy/FigPieBrown.png'/>
						</div>
					</div>
				</div>
				<div className='carl_tokens_2'>
					<div className='carl_tokens_2_a'>
						<p style={{fontWeight:'600',marginBottom:'5px'}}>Recieving Wallet</p>
						<p>Enter Your Wallet Address</p>
						<div className='input_containertokens'>
							<img src='/imagesCarlossy/walletimg.png'/>
							<input type="text" />
							<img src='/imagesCarlossy/copytextt.png'/>
						</div>
						<button>Update</button>
					</div>
					<div className='carl_tokens_2_b'>
						<p className='total_contr'
						style={{fontWeight:'600'}}
						>Total Contributed</p>
						<p className='carl_tokens_text_usd'>121,383,483.92 USD</p>
						<div className='carl_tokens_2_b_1'>
						<p className='total_contr'>Your contribution in</p>
						<div className='currencies'>
						<div className='values_currency'>
							<p>$12k</p>
							<p style={{fontSize:'0.6rem'}}>USD</p>
						</div>
						<div className='values_currency'>
							<p>4.2</p>
							<p style={{fontSize:'0.6rem'}}>ETH</p>
						</div>
						<div className='values_currency'>
							<p>0.034</p>
							<p style={{fontSize:'0.6rem'}}>BTC</p>
						</div>
						</div>
						
					</div>
					</div>	
				</div>
				</div>
				
				
			</div>
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
	</div>
  )
}

export default ReferralsPage