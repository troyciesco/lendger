import React, { useEffect } from "react"
//import { Typography } from '@material-ui/core'
//import { UserContext } from '../App'
import about from "../img/background1.jpg"
import styled from "styled-components"
import wei from "../img/wei.jpg"
import troy from "../img/troy.jpg"
import kaitlon from "../img/kaitlon.jpg"
import dylan from "../img/dylan.jpg"
import roadmap from "../img/Roadmap.png"

import "../components/Shared/scroll.css"

import Cards from "../components/Shared/TeamCard"
import * as myStyles from "../components/Shared/Styles"

const Font = styled.div`
	${myStyles.baseFont}
	overflow: hidden;
`

const Team = styled.div`
	margin: 20px 160px 50px 160px;
	height: auto;

	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr;
	grid-template-areas: "a b b b" "e f g h";
	grid-gap: 40px;

	background-color: ${myStyles.colorLight};

	& .title {
		text-align: center;
		grid-area: t;
		color: #5298bf;
		margin: auto;
		font-weight: 300;
		letter-spacing: 12px;
		border-bottom: 4px dotted ${myStyles.colorDarkBlue};
		padding-right: 10px;
	}
`

const TeamTitle = {
	gridArea: "b",
	color: myStyles.colorDarkBlue,
	margin: "80px 20px auto auto",
	letterSpacing: "15px",
	textAlign: "right",
	fontSize: "60px",
	paddingLeft: "40px",
	borderBottom: "40px solid #5298BF",
	borderLeft: "20px solid #FAFAFA",
}

const Header = styled.h1`
	font-size: 80px;
	text-align: center;
	margin: -180px auto 30px auto;
	position: relative;
	z-index: -1;
	letter-spacing: 10px;
	text-shadow: 10px 15px 10px rgba(0, 0, 0, 0.5);
	box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5), inset 5px 5px 10px rgba(0, 0, 0, 0.5);
	border: 10px solid ${myStyles.colorLight};
	width: 50%;
`

const Information = styled.div`
	color: ${myStyles.colorDark};
	background-color: ${myStyles.colorLight};
	display: grid;
	grid-template-columns: 3fr 10px 3fr;
	margin: 40px 170px 40px 170px;

	& p {
		${myStyles.secondaryFont};
	}

	& h1 {
		border-bottom: 6px dotted ${myStyles.colorDarkBlue};
	}
`
const RoadmapContainer = styled.div`
	background-color: ${myStyles.colorDarkBlue};
	overflow-x: scroll;
`

const Roadmap = styled.img`
	width: 2500px;
`

const Divider = styled.div`
	width: 100%;
	height: 60px;
	background-color: ${myStyles.colorDarkBlue};

	& h1 {
		text-align: center;
		position: relative;
		padding: 20px;
		font-size: 40px;
	}
`

const About = () => {
	//const currentUser = useContext(UserContext)
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	return (
		<Font>
			<img
				alt="Background"
				src={about}
				style={{ width: "100%", marginTop: "-300px", position: "relative", zIndex: -1 }}
			></img>
			<Header>ABOUT US</Header>
			<Divider />
			<Information>
				<div style={{ marginRight: "50px" }}>
					<h1 style={{ marginRight: "170px" }}>OUR MISSION</h1>
					<p>
						At its core, Lendger International Ltd. is a real estate crowdlending platform. We
						create a new world for lenders and borrowers with potential access to global real
						estate-backed crowdfunded loans, and the opportunity for investors to add diversity to
						their existing financial portfolios.
					</p>
				</div>
				<div
					style={{ backgroundColor: "#427AA1", filter: "opacity(80%)", borderRadius: "5px" }}
				></div>
				<div style={{ textAlign: "right", marginLeft: "50px" }}>
					<h1 style={{ marginLeft: "170px" }}>OUR TECHNOLOGY</h1>
					<p>
						Lendger implements real-world uses for blockchain, and the real estate industry provides
						the perfect setting. Users of our crowdlending platform will be able to diversify their
						financial portfolio, while benefiting from the ease, security and speed of
						cryptocurrency-based transactions. Blockchain technology enables us to provide borrowers
						broader access to investors at lower cost, and create a more effective way for lenders
						to participate in the real estate market. We are able to achieve this through
						implementing smart contracts and our Lendger Access Token.
					</p>
				</div>
			</Information>
			<Divider>
				<h1>Roadmap</h1>
			</Divider>

			<RoadmapContainer className="scroll">
				<Roadmap src={roadmap} />
			</RoadmapContainer>

			<h1 className="title">THE TEAM</h1>
			<Team>
				<Cards
					pos={"a"}
					email="mailto:info@lendger.io"
					source={wei}
					name={"WEI WU"}
					linked=""
					disable
				/>
				<div style={TeamTitle}>MEET THE TEAM</div>
				<Cards
					pos={"e"}
					email="mailto:troy@lendger.io"
					source={troy}
					name={"TROY CIESCO"}
					linked="https://www.linkedin.com/in/troyciesco"
				/>
				<Cards
					pos={"f"}
					email="mailto:kaitlon@lendger.io"
					source={kaitlon}
					name={"KAITLON BOISSONNEAULT"}
					linked="https://www.linkedin.com/in/kaitlonboissonneault/"
				/>
				<Cards
					pos={"g"}
					email="mailto:dylan@lendger.io"
					source={dylan}
					name={"DYLAN RAMSAY"}
					linked="https://www.linkedin.com/in/dylan-ramsay-99424b16a/"
				/>
				<Cards
					pos={"h"}
					email="mailto:peter@lendger.io"
					source={null}
					name={"PETER GODWIN"}
					disable
					linked=""
				/>
			</Team>
		</Font>
	)
}

export default About
