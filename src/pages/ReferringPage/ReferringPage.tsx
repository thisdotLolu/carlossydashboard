import React from 'react'
import { Link } from 'react-router-dom'
import '../../components/ReferralsPage/ReferralsPage.css'
import './ReferringPage.css'
const ReferringPage = () => {
  return (
    <div>
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
				<div className='referring-info'>
                    <div className='referring-info-inner'>
                        <div className='referring_one'>
                            <h3>Earn With Referrals</h3>
                            <p className='invit_ur_frens'>Invite your friends and family and receive free tokens. 
                                The referral link may be used during a token contribution to receive 10% free tokens. 
                                Imagine giving your unique referral link to your crypto-friend and he or she contributes tokens using your link, the bonus will be sent to your account automatically. The strategy is simple: the more links you send to your colleagues, 
                                family and friends - the more tokens both you may earn!
                            </p>
                            <h3 >Referrer: 10%   &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;   Referred: 10%</h3>
                            <div className='divider_referral'></div>
                            <h3>Your Referral link</h3>

                            <div className='input_area'>
                                <img src='/imagesCarlossy/linkicon.png'/>
                                <input type="text" 
                                value='https://purchase.carlossy...'
                                />
                                <img src="/imagesCarlossy/copytxt.png"/>
                            </div>
                            <p>Use above link to refer your friend and get referral bonus.</p>
                        </div>
                        <div className='divider_vetical'></div>
                        <div className='referrals_person'>
                            <div className='tableHead'>
                                <p>Username</p>
                                <div></div>
                                <p>EarnedTokens</p>
                                <div></div>
                                <p>Reg. Date</p>
                            </div>
                            <div className='tbody'>
                                <p>max.tays@gm...</p>
                                <p>+12,737.09</p>
                                <p className='date'>10 Jul. 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                                <p>jayden176@gm...</p>
                                <p>+5343.93</p>
                                <p className='date'>8 May 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                                <p>lisa23@gmail...</p>
                                <p>+283.37 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p className='date'>12 Apr. 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                              <p>hackson32@y....</p>  
                              <p>+2,747.09 &nbsp;&nbsp;&nbsp;&nbsp;</p>
                              <p className='date'>9 Oct. 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                                <p>link61.ota@g...</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+457&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p className='date'>15 Dec. 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                                <p>fazy192@hot...</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+367.02&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p className='date'>7 Jan. 2022</p>
                            </div>
                            <hr />
                            <div className='tbody'>
                                <p>sayh75.j3@gm...</p>
                                <p>+893.23&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p className='date'>16 Feb. 2022</p>
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
    </div>
  )
}

export default ReferringPage