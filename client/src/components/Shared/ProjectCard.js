import React, { useState } from "react"
import styled from "styled-components"
import house from "../../img/house.jpg"
import US from "../../img/US.jpg"
import { useSpring, animated } from "react-spring"
import { Link } from "react-router-dom"

import CircularProgress from "@material-ui/core/CircularProgress"

import * as myStyles from "./Styles"
import { getRandomInt } from "../../utils/getRandomInt"

const ProjectCard = styled(animated.div)`
	${myStyles.baseFont};

	margin: auto;
	width: 325px;
	height: inherit;
	background-color: ${myStyles.colorLight};
	border-radius: 4px;
	box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);

	&:hover {
		box-shadow: 0px 30px 40px -10px rgba(0, 0, 0, 0.4);
	}
`

const ProjectImg = styled.img`
	width: inherit;
	position: relative;
	margin-top: -67px;
	height: 216px;

	border-radius: 4px;
`

const Flag = styled.img`
	width: 100px;
	position: relative;
	top: 12px;
	left: 100px;
	border: 4px solid ${myStyles.colorLight};
	border-radius: 5px;
	z-index: 2;
`

const ProgressBar = styled.div`
	width: 90px;
	height: 90px;
	border-radius: 45px;
	background-color: ${myStyles.colorLight};
	margin: auto;
	position: relative;
	top: -50px;
`

const ProjectTitle = styled.div`
	color: ${myStyles.colorDark};
	text-transform: uppercase;
	font-size: 20px;
`

const ProjectDescription = styled.div`
	color: ${myStyles.colorDark};
	font-size: 14px;
`

const Button = styled(Link)`
	border-radius: 5px;
	border: 2px solid ${myStyles.colorLight};

	font-size: 18px;
	font-weight: 700;
	text-decoration: none;
	color: ${myStyles.colorLight};

	margin: auto;
	padding: 10px 30px 10px 30px;

	&:hover {
		background-color: ${props => (props.lend ? myStyles.colorDarkGreen : myStyles.colorDarkBlue)};
	}
`

const flipMain = {
	width: "325px",
	height: "inherit",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	justifyContent: "center",
}

const FlippedCard = styled(animated.div)`
	position: absolute;
	width: 325px;
	height: inherit;
	background-color: ${myStyles.colorDarkGreen};
	will-change: transform opacity;
	border-radius: 5px;
	overflow: hidden;
`

const CircularProgressStyle = styled(CircularProgress)`
	position: absolute;
	top: 5px;
	left: 5px;
`

const Percent = styled.div`
	color: ${myStyles.colorDark};
	position: relative;
	font-size: 20px;
	top: 30px;
	padding-left: 4px;
`

const ProjectInfo = styled.div`
	margin-top: -47px;
	display: grid;
	grid-template-rows: 1fr 5fr 1fr;
`
const ProjectEndDate = styled.div`
	text-align: right;
	font-size: 12px;
	padding: 10px 20px 0 0;
	color: ${props => (props.days < 7 ? myStyles.colorRed : myStyles.colorDarkGreen)};
`

function flagToUse(country) {
	if (country === "US") return "../../img/US.jpg"

	switch (country) {
		case "US":
			return "../../img/US.jpg"
		case "IRE":
			return "../../img/IRE.jpg"
		case "UK":
			return "../../img/UK.jpg"
		case "CAN":
			return "../../img/CAN.jpg"
		default:
			return null
	}
}

export default function({ percentage, title, desc, end, country }) {
	var percent = percentage
	const [props, set] = useSpring(() => ({ s: 1, config: { mass: 5, tension: 350, friction: 40 } }))
	const [flipped, setFlipped] = useState(false)
	const { transform, opacity } = useSpring({
		config: { mass: 6, tension: 500, friction: 80 },
		opacity: flipped ? 1 : 0,
		transform: `perspective(1400px) rotateY(${flipped ? 180 : 0}deg)`,
		from: {
			opacity: flipped ? 1 : 0,
			transform: `perspective(1400px) rotateY(0deg)`,
		},
	})

	return (
		<animated.div
			onMouseOver={() => set({ s: 1.08 })}
			onMouseLeave={() => set({ s: 1 })}
			style={{
				transform: props.s.interpolate(s => `perspective(600px) scale(${s})`),
				transition: "box-shadow 0.5s",
				willChange: "transform",
				height: "450px",
			}}
		>
			<div style={flipMain} onClick={() => setFlipped(state => !state)}>
				<FlippedCard
					style={{
						opacity: opacity.interpolate(o => 1 - o),
						transform,
					}}
				>
					<ProjectCard>
						<Flag src={flagToUse(country)}></Flag>
						<ProjectImg
							src={`https://lendger-homes.s3.amazonaws.com/${getRandomInt()}.jpg`}
						></ProjectImg>
						<ProgressBar>
							<CircularProgressStyle
								style={{ color: "lightgray" }}
								size={80}
								thickness={4}
								variant="static"
								value={100}
							/>
							<CircularProgressStyle
								style={{ color: "#58CE73", borderRadius: "2px" }}
								size={80}
								thickness={4}
								variant="static"
								value={percentage}
							/>
							<Percent>{percentage}%</Percent>
						</ProgressBar>

						<ProjectInfo>
							<ProjectTitle>{title}</ProjectTitle>
							<ProjectDescription>{desc}</ProjectDescription>
							<ProjectEndDate days={end}>Ends in {end} Days</ProjectEndDate>
						</ProjectInfo>
					</ProjectCard>
				</FlippedCard>
				<FlippedCard
					style={{
						opacity,
						transform: transform.interpolate(t => `${t} rotateY(180deg)`),
					}}
				>
					<div
						style={{
							position: "absolute",
							backgroundColor: "#424242",
							width: "inherit",
							height: "inherit",
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateRows: "auto auto",
								height: "inherit",
								padding: "80px 30px 80px 30px",
							}}
						>
							<Button lend="lend" to={flipped ? "./account" : "#"}>
								LEND
							</Button>
							<Button to={flipped ? "./account" : "#"}>VIEW</Button>
						</div>
					</div>
				</FlippedCard>
			</div>
		</animated.div>
	)
}
