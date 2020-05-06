import React from "react"
import styled from "styled-components"
import { Link } from "react-router-dom"
import logo from "../img/Lendger.png"

import * as myStyles from "./Shared/Styles"

const StyledFooter = styled.footer`
	border-top: 10px solid ${myStyles.colorLightBlue};

	width: 100%;
	padding: 25px;
	background-color: ${myStyles.colorDarkBG};
	display: flex;
	justify-content: center;

	padding-bottom: 80px;

	.link {
		text-decoration: none;
		color: ${myStyles.colorLight};
	}

	.item {
		padding: 25px;
		color: ${myStyles.colorLight};
	}
`
const FooterHeader = styled.div`
    ${myStyles.baseFont}
    border-bottom: 4px dotted ${myStyles.colorLightBlue};
    padding-bottom: 5px;
    font-size: 1.1rem;
    padding-right: 30px;
`

const FooterInfo = styled.div`
	${myStyles.baseFont}
	margin-top: 15px;
	color: ${myStyles.colorLight};
	font-size: 0.8rem;
	padding-right: 30px;
`

const Info = styled.div`
	width: 100%;
	display: grid;
	grid-template-columns: auto auto auto auto;
	justify-items: right;
	text-align: left;
	align-items: center;
`

const Footer = () => {
	return (
		<StyledFooter>
			<Info>
				<div>
					<FooterHeader>ABOUT</FooterHeader>
					<FooterInfo>
						<Link to="/faq" className="link">
							FAQ
						</Link>
					</FooterInfo>
					<FooterInfo>
						<Link to="/careers" className="link">
							Careers
						</Link>
					</FooterInfo>
					<FooterInfo></FooterInfo>
				</div>
				<div>
					<FooterHeader>LEGAL</FooterHeader>
					<FooterInfo>
						<Link to="/terms" className="link">
							Terms &amp; Conditions
						</Link>
					</FooterInfo>
					<FooterInfo>
						<Link to="/privacy" className="link">
							Privacy Policy
						</Link>
					</FooterInfo>
					<FooterInfo></FooterInfo>
				</div>
				<div>
					<FooterHeader>CONTACT</FooterHeader>
					<FooterInfo>
						PHONE <span style={{ color: "#5298BF", fontStyle: "italic" }}>ll</span> 123.456.7890
					</FooterInfo>
					<FooterInfo>
						TELEGRAM <span style={{ color: "#5298BF", fontStyle: "italic" }}>ll</span> Lendger
					</FooterInfo>
					<FooterInfo>
						EMAIL <span style={{ color: "#5298BF", fontStyle: "italic" }}>ll</span> info@lendger.io
					</FooterInfo>
				</div>
				<img style={{ width: "400px", justifyItems: "right" }} alt="Lendger Logo" src={logo} />
			</Info>
		</StyledFooter>
	)
}

export default Footer
