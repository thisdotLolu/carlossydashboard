import { useContext } from "react"
import Button from "../../components/Button"
import Card, { CardBody, CardGroup, CardTitle } from "../../components/Card"
import Chip from "../../components/Chip"
import Countdown from "../../components/Countdown"
import { Loadable, Loader } from "../../components/Loader"
import Page from "../../components/Page"
import PriceChart from "../../components/PriceChart"
import TransactionList from "../../components/TransactionList"
import { AuthContext } from "../../context/AuthContext"
import { PriceContext } from "../../context/PriceContext"
import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { Component } from "../../types/Util"
import { capitalize, formatLargeNumber, formatNumber, getTimeString, roundToDP } from "../../util"
import "./DashboardPage.css"

const DashboardPage: Component = () => {
	const { currentProject, currProjectRequest } = useContext(ProjectContext)
	const { activeStage, activeStageRequest, presaleEnded, getActiveStage } = useContext(StageContext)
	const { user, userRequest } = useContext(AuthContext)
	const { finalPrice, getFinalPrice } = useContext(PriceContext)

	const loading = currProjectRequest.fetching || activeStageRequest.fetching || userRequest.fetching

	const tokenPrice = presaleEnded ? finalPrice : (activeStage?.token_price || 0)

	return (
		<Page title="Dashboard" path="/" userRestricted>
			
			<div className="dashboard-page gap-6 <md:gap-2 <sm:!p-4">
				<Loader loading={loading}>	
					<div className="flex flex-[2] flex-col flex-gap-y-6">
						<div className="welcomeTextContainer">
						<p className="welcomeText">Welcome back, {user?.first_name}</p>
						{/* <div></div> */}
						{/* <p>{user?.first_name} Lives <img src='/imagesCarlossy/downarrow.png'/></p> */}
						</div>
						
						<div>
						<div className="dashboard-top-section">
						<div className="tickerandtoken">
						<div className="tickerCarlossy">
						<p>Ticker</p>
						<div>
							<img src="/imagesCarlossy/CarlossyFace.png"/>
							<h1>$CARL</h1>
						</div>
						<p>Carlossy Caterpillar</p>
						</div>
						<div 
						className="tokenPrice">
						<p>Token Price</p>
						<div>
							<h3>$0.00152</h3><p>+125%</p>
						</div>
						<p>USD/ CARL</p>
						</div>
						</div>
						<div>
							<div className="dashboard-card token_balance"
							>
								<div className="card-header small">
									Token Balance
								</div>
								<Loadable component="span" className="value large">${formatLargeNumber((user?.tokens?.total || 0) * tokenPrice, 1000, 0, 2)}</Loadable>
								<Loadable component="span" className="value small">{formatLargeNumber(user?.tokens?.total || 0)} $CARL</Loadable>
								<Button
								style={{fontSize:'1rem',marginTop:"20px"}}
								>
									Buy more $CARL
								</Button>
							</div>
						</div>
						<div>
							<div className="dashboard-card flex-1 token_stage">
								{/* <p>Presale Stage</p>
								<div className="card-header small">
									{presaleEnded ? "Final Price" : (activeStage?.name || "Stage")} <div className="running">Running</div>
								</div>
								<Loadable component="span" className="value large">{currentProject?.symbol} ${formatNumber(tokenPrice)}</Loadable>
								<div><div></div> Solid Tokens</div>
								<p>400,000 $CARL</p>
								{!presaleEnded && (
									<Loadable component="span" className="value small">Remaining Tokens{formatLargeNumber(activeStage?.total_tokens || 0)} Tokens</Loadable>
									<Loadable component="span" className="value small"> <div></div> Remaining Tokens
									<div>6,600,000 $CARL</div>
									</Loadable>
								)} */}
								<div>
									<p>Presale Stage</p>
								<div className="running">
								<h2>Stage 2</h2><div>Running</div>									
								</div>
								<p><div></div> Sold Tokens</p>
								<h3>400,000  $CARL</h3>
								<p> <div style={{backgroundColor:'#C6D470'}}></div> Remaining Tokens</p>
								<h3>6,600,000 $CARL</h3>
								</div>
								<div>
									<img src='/imagesCarlossy/FigPie.png'/>
								</div>
							</div>
						</div>
						</div>
							
							
						</div>	
						{(activeStage?.type === "dynamic" || loading) && !presaleEnded && <PriceChart />}
					</div>
				</Loader>
				
			</div>
			<div className="dashboardBottom_carlossy">
				<p className="supports">We support a wide range of crypto</p>
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
			
		</Page>
	)
}

export default DashboardPage