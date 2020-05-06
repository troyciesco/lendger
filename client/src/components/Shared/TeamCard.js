import React, { useState } from "react"
import styled from "styled-components"
import { useSpring, animated } from "react-spring"

import Icon from "@mdi/react"
import { mdiLinkedinBox, mdiEmail } from "@mdi/js"
import * as myStyles from "./Styles"

const Name = styled.div`
	width: inherit;
	height: 60px;
	padding: 10px;
	position: relative;
	margin: auto;
`

const flipMain = {
	height: "310px",
	display: "flex",
	alignItems: "center",
	cursor: "pointer",
	justifyContent: "center",
}

const Card = styled(animated.div)`
	text-align: center;
	width: 260px;
	margin: auto;
	height: 310px;

	background-color: ${myStyles.colorLightBlue};
	box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.2);
	border-radius: 6px;
`

const FlippedCard = styled(animated.div)`
	position: absolute;
	width: 250px;
	height: inherit;
	background-color: #eeeeee;
	will-change: transform, opacity;
	border-radius: 5px;
	box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.2);
`

export default function({ source, name, pos, email, disable, linked }) {
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
				gridArea: `${pos}`,
				willChange: "transform",
				height: "inherit",
			}}
		>
			<div style={flipMain} onClick={() => setFlipped(state => !state)}>
				<FlippedCard
					style={{
						opacity: opacity.interpolate(o => 1 - o),
						transform,
					}}
				>
					<Card>
						<img
							alt="Employee"
							style={{ width: "inherit", borderRadius: "5px 5px 0 0" }}
							src={source}
						/>
						<Name>{name}</Name>
					</Card>
				</FlippedCard>
				<FlippedCard
					className="flipped"
					style={{
						opacity,
						transform: transform.interpolate(t => `${t} rotateY(180deg)`),
					}}
				>
					<div style={{ width: "inherit", height: "inherit" }}>
						<div
							style={{
								display: "grid",
								gridTemplateRows: "auto auto",
								margin: "80px",
								justifyContent: "center",
								gridGap: "60px",
							}}
						>
							<a href={flipped ? null : disable ? null : linked}>
								<Icon path={mdiLinkedinBox} size={2} color={disable ? "lightgray" : "black"} />
							</a>
							<a href={flipped ? null : email}>
								<Icon path={mdiEmail} size={2} />
							</a>
						</div>
					</div>
				</FlippedCard>
			</div>
		</animated.div>
	)
}
