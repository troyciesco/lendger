import styled from "styled-components"

export const StyledContainer = styled.div`
	display: grid;
	grid-template-columns: 20% 1fr 15%;
	grid-template-rows: 150px auto;
	grid-template-areas:
		"title title title"
		"preview main progress";
`

export const StyledTitle = styled.div`
	grid-area: title;
	height: 100%;
	width: 100%;
	text-align: center;
	text-transform: uppercase;
	color: #424242;
	font-family: "Montserrat";
	font-size: 35px;
	font-weight: 700;
	line-height: 43px;
`

export const StyledPreview = styled.div`
	grid-area: preview;
	height: 420px;
	width: 95%;
	background: blue;
	border-radius: 0 5px 5px 0;
	background-color: #f4f4f4;
	display: flex;
	justify-content: flex-end;
`

export const PreviewCard = styled.div`
	width: 300px;
	margin: 10px 10px 10px 40px;
	position: relative;

	& h3 {
		position: absolute;
		top: calc(50% - 35px);
		left: -45px;
		writing-mode: vertical-lr;
		transform: rotate(-180deg);
		text-transform: uppercase;
		font-family: Montserrat;
		font-size: 15px;
		font-weight: 700;
		line-height: 18px;
	}
`

export const PreviewCardTop = styled.div`
	background-color: #006c93;
	height: 170px;
	border-radius: 5px 5px 0px 0px;
`

export const PreviewCardBottom = styled.div`
	background-color: #ffffff;
	height: 220px;
	border-radius: 0px 0px 5px 5px;
`

export const StyledMain = styled.div`
	grid-area: main;
	height: 700px;
	width: 100%;
	background: #f4f4f4;
	border-radius: 5px;
	padding: 20px;
`

export const ProjectCountry = styled.div`
	background-color: #ffffff;
`

export const ProjectLocation = styled.div`
	background-color: #ffffff;
`

export const ProjectDescription = styled.div`
	background-color: #ffffff;
`
export const ProjectGoal = styled.div`
	background-color: #ffffff;
`

export const StyledProgress = styled.div`
	grid-area: progress;
	height: 500px;
	width: 100%;
	background: green;
	text-align: center;
`
