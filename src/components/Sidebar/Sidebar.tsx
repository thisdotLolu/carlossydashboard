import type { Component, ComponentType } from "../../types/Util"
import Card, { CardBody, CardTitle } from "../Card"
import "./Sidebar.css"

import DashboardIcon from "../../svg/icons/dashboard-outline.svg"
import AccountIcon from "../../svg/icons/account-circle-outline.svg"
import SettingsIcon from "../../svg/icons/settings-outline.svg"
import LogoutIcon from "../../svg/icons/logout.svg"
import Button from "../Button"
import { Link, NavLink, useLocation } from "react-router-dom"
import { getURL, routeMatchesExact, useGetCurrentProject } from "../../util"
import { AuthContext } from "../../context/AuthContext"
import React, { useContext } from "react"

import TransactionsIcon from "../../../public/imagescarlossy/transactionsdavid.svg"
import ReferralsIcon from "../../../public/imagescarlossy/myToken.svg"
// import HomeIcon from "../../svg/icons/dashboard.svg"
import BuyIcon from '../../../public/imagescarlossy/shopping-basket.svg'
import Profile from '../../../public/imagescarlossy/profiledavid.svg'
import Dashboard from '../../../public/imagescarlossy/dashboard.svg'
import PromotionsIcon from "../../svg/icons/offer.svg"
// import Logo from '/imagescarlossy/Logo.svg'


import { ProjectContext } from "../../context/ProjectContext"
import { StageContext } from "../../context/StageContext"
import { PromotionContext } from "../../context/PromotionContext"
import { PromotionImageResponse } from "../../types/Api"

interface Args {
	presaleEnded: boolean,
	promotionsFetching: boolean,
	promotionImages: PromotionImageResponse
}

const navList: {
	label: string,
	path: string,
	icon: ComponentType,
	disabled?: (args: Args) => boolean,
	visible?: (args: Args) => boolean
}[] = [
	{label: "Dashboard", path: "/", icon:Dashboard },
	{label: "Buy Token", path: "/buy", icon: BuyIcon},
	{label: "Transaction", path: "/transactions", icon: TransactionsIcon},
	{label: "Profile", path: "/account", icon: Profile, disabled: ({ presaleEnded }) => presaleEnded},
	{label: "My Token", path: "/referrals", icon: ReferralsIcon},
	{label: "Promotions", path: "/promotions", icon: PromotionsIcon, visible: ({ promotionsFetching, promotionImages }) => !promotionsFetching && Object.entries(promotionImages).length > 0},
]

const bottomList = [
	{label: "Logout", onClick: ({ logout }: {logout: () => void;}) => {
		logout()
	}, icon: LogoutIcon},
]

const Sidebar: Component = () => {
	const { currentProject } = useContext(ProjectContext)
	const { presaleEnded } = useContext(StageContext)
	const { getPromotionImagesRequest, promotionImages } = useContext(PromotionContext)
	const authContext = useContext(AuthContext)

	const location = useLocation()

	return (
		<Card className="sidebar">
			<CardTitle center>				
				<img 
				style={{marginTop:'-20px',marginBottom:'-20px'}}
				src='/imagesCarlossy/Logo.png'/>
			</CardTitle>
			<CardBody>
				<div className="nav-list list +md:flex-gap-y-2">
					{navList.map((navItem, i) => {
						const matches = () => routeMatchesExact(navItem.path, location.pathname)
						const path = navItem.path.replace("%MAIN_URL%", getURL(currentProject?.main_site_url || ""))
						const args: Args = { presaleEnded, promotionImages, promotionsFetching: getPromotionImagesRequest.fetching }
						if (navItem.visible !== undefined && !navItem.visible(args)) return <React.Fragment key={navItem.label}></React.Fragment>
						return (
							<Button
								key={navItem.label}
								component={path.startsWith("http") ? "a" : NavLink}
								{...(path.startsWith("http") ? {href: path} : {to: path})}
								target={path.startsWith("http") ? "_blank" : undefined}
								textColor={matches() ? "default" : "secondary"}
								color={matches() ? "primary" : "transparent"}
								className="!justify-start"
								icon={navItem.icon}
								disabled={navItem.disabled !== undefined && navItem.disabled(args)}
							>
								{navItem.label}
							</Button>
						)
					})}
				</div>
				<div className="separator">
					<div className="divider" />
				</div>
				<div className="home-contact-carlossy">
				<div>
					<img src="/imagesCarlossy/HomeIcon.png" alt="home"  />
					<a href="">Home Page</a>
				</div>
				</div>
				<div className="bottom-list list +md:flex-gap-y-2">
					{bottomList.map((navItem, i) => (
						<Button
							key={navItem.label}
							color="transparent"
							className="!justify-start"
							icon={navItem.icon}
							onClick={() => navItem.onClick?.({ logout: authContext.logout })}
						>
							{navItem.label}
						</Button>
					))}
				</div>
			</CardBody>
		</Card>
	)
}

export default Sidebar