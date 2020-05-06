import React, { useEffect } from "react"
import styled from "styled-components"
import Background from "../img/Back.jpg"
import ProjectCard from "../components/Shared/ProjectCard"
import { Link } from "react-router-dom"
import scroll from "../img/scrollIcon.png"

import * as myStyles from "../components/Shared/Styles"

const Font = styled.div`
	${myStyles.baseFont};
	overflow-y: hidden;
	overflow-x: hidden;
`

const Back = styled.img`
	width: 100%;
	margin-top: -490px;
	filter: brightness(90%);
	z-index: -1;
	position: relative;
`

const Introduction = styled.div`
	text-align: center;
	margin: 0;
	font-size: 32px;
	font-weight: 900;
	letter-spacing: 5px;
	text-shadow: 6px 6px 10px rgba(0, 0, 0, 0.3);

	& .build {
		position: relative;
		right: 16vw;
		top: 20vh;
		color: ${myStyles.colorLightBlue};
		filter: brightness(110%);
	}

	& .invest {
		position: relative;
		left: 14vw;
		top: 22vh;
	}
`

const Divider = styled.div`
	display: grid;
	grid-template-rows: auto auto;

	background-color: ${myStyles.colorDarkBlue};
	width: 100%;
	height: auto;
	margin-top: -105px;
	text-align: center;
	padding: 45px;

	border-top: 10px solid ${myStyles.colorLightBlue};

	font-weight: 800;
	font-size: 3rem;
`

const MainInfo = styled.div`
	background-color: ${myStyles.colorLight};
	width: 100%;
	height: auto;

	padding: 50px 170px 50px 170px;

	font-weight: 300;
	color: ${myStyles.colorDark};
	font-size: 25px;

	line-height: 40px;
`

const Card = styled.div`
	display: grid;
	grid-template-columns: 35% 65%;

	${myStyles.secondaryFont};

	width: auto;
	height: auto;
	margin: 0 170px 0 170px;
	background-color: ${myStyles.colorDarkBlue};
	border-radius: 5px;
`

const CardInfo = styled.div`
	margin: 50px 100px 50px 100px;
	padding-left: 20px;
	border-left: 6px solid ${myStyles.colorLightBlue};
`

const ProjectGrid = styled.div`
	display: grid;
	max-width: 80%;
	grid-template-columns: 33% 33% 33%;
	grid-gap: 20px;
	height: 400px;
	margin: 75px auto 100px auto;
`

const Projects = styled.div`
	border-top: 10px solid ${myStyles.colorLightBlue};
	display: grid;

	margin: 50px 0 50px 0;
	width: 100%;
	height: inherit;
	background-color: ${myStyles.colorDarkBlue};

	padding-top: 30px;
	text-align: center;

	font-weight: 800;
	font-size: 3rem;
`

const Accounts = styled.div`
	height: 250px;
	width: 100%;
	text-align: center;
	font-size: 22px;

	& h1 {
		color: ${myStyles.colorDarkBlue};
		font-weight: 400;
	}

	& .grid {
		display: grid;
		grid-template-columns: auto 35vw 35vw auto;
		grid-template-areas: ". lend borrow .";
		grid-gap: 40px;
		margin: 140px auto 40px auto;
	}
`

const Button = styled.button`
	background-color: ${props => (props.lender ? myStyles.colorDarkGreen : myStyles.colorDarkBlue)};
	border: 0px hidden;
	border-radius: 5px;

	font-size: 18px;
	font-weight: 700;
	text-decoration: none;
	color: ${myStyles.colorLight};

	padding: 16px 25px 16px 25px;
	margin: auto;
	position: relative;
	top: -100px;

	&:hover {
		cursor: pointer;
		background-color: ${props =>
			props.lender ? myStyles.colorLightGreen : myStyles.colorLightBlue};
	}

	& .grid {
		display: grid;
		grid-template-columns: auto auto;
		margin: auto;
		grid-gap: 0;
	}

	& .desc {
		margin: auto auto auto 30px;
		text-align: left;
		font-weight: 300;
		padding-left: 15px;
		border-left: 4px solid;
	}
`

const Home = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	})
	return (
		<div style={{ overflowX: "hidden" }}>
			<Font>
				<img
					alt="Scroll Icon"
					src={scroll}
					style={{
						position: "relative",
						margin: "auto",
						width: "100px",
						display: "block",
						top: "75vh",
					}}
				/>

				<Introduction>
					<h1 className="build">BUILD LOCALLY</h1>
					<h1 className="invest">INVEST GLOBALLY</h1>
				</Introduction>
				<Back alt="Background" src={Background} />

				<Divider>
					OUR MISSION
					<span
						style={{
							borderTop: "5px solid #5298BF",
							width: "300px",
							height: "20px",
							justifySelf: "center",
						}}
					></span>
				</Divider>
				<MainInfo>
					<span style={{ fontWeight: "700", fontSize: "35px", color: "#5298BF" }}>
						Our vision is simple:{" "}
					</span>
					create a new-aged real estate loan model using blockchain that will bring lenders and
					borrowers together on a global scale via our platform. We plan to revolutionize the real
					estate market by streamlining loan processes, automating time-consuming tasks, and cutting
					costs by using blockchain technology.
				</MainInfo>
				<div
					style={{
						color: "#5298bf",
						fontSize: "4rem",
						fontWeight: "800",
						textAlign: "center",
						paddingBottom: "40px",
					}}
				>
					" WHY LENDGER? "
				</div>
				<Card>
					<div></div>
					<div>
						<CardInfo>
							Users of our crowdlending platform will be able to diversify their financial
							portfolio, while benefiting from the ease, security and speed of cryptocurrency-based
							transactions.
						</CardInfo>
						<CardInfo>
							Blockchain technology enables us to provide borrowers broader access to investors at
							lower cost, and create a more effective way for lenders to participate in the real
							estate market.{" "}
						</CardInfo>
					</div>
				</Card>

				<Projects>
					<div style={{ display: "grid", marginBottom: "-20px" }}>
						CURRENT PROJECTS
						<span
							style={{
								borderTop: "5px solid #5298BF",
								width: "480px",
								height: "10px",
								justifySelf: "center",
							}}
						></span>
					</div>
					<ProjectGrid>
						<ProjectCard
							percentage={20}
							title="123 Main Street"
							desc="Nice house, bad neighborhood"
							end={3}
							country={"US"}
						/>
						<ProjectCard
							percentage={50}
							title="321 Somewhere Road"
							desc="Excepteur fugiat ipsum qui quis eu duis labore cupidatat cupidatat adipisicing culpa."
							end={14}
							country="UK"
						/>
						<ProjectCard
							percentage={90}
							title="000 Here Place"
							desc="Amet nulla enim id irure."
							end={1}
							country="US"
						/>
					</ProjectGrid>
				</Projects>

				<Accounts>
					<h1>EXPLORE MORE BY CREATING AN ACCOUNT</h1>
					<div className="grid">
						<Button lender style={{ gridArea: "lend" }}>
							<Link style={{ textDecoration: "none", color: "inherit" }} to="./account">
								<div className="grid">
									<div style={{ margin: "auto", fontSize: "30px" }}>LENDER</div>
									<div className="desc">
										A chance to lend and help the community while receiving healthy returns on
										investments
									</div>
								</div>
							</Link>
						</Button>
						<Button style={{ gridArea: "borrow" }}>
							<Link style={{ textDecoration: "none", color: "inherit" }} to="./account">
								<div className="grid">
									<div style={{ margin: "auto", fontSize: "30px" }}>BORROWER</div>
									<div className="desc">
										An oppurtunity to fund numerous projects with ease and confidence
									</div>
								</div>
							</Link>
						</Button>
					</div>
				</Accounts>
			</Font>
		</div>
	)
}

export default Home
