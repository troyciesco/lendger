import React from "react"
import {
	StyledContainer,
	StyledTitle,
	StyledPreview,
	StyledMain,
	StyledProgress,
	PreviewCard,
	PreviewCardTop,
	PreviewCardBottom,
	ProjectCountry,
	ProjectLocation,
	ProjectDescription,
	ProjectGoal,
} from "./Styles"

const BorrowContent = () => {
	return (
		<StyledContainer>
			<StyledTitle>
				<h1>Create a Project</h1>
			</StyledTitle>
			<StyledPreview>
				<PreviewCard>
					<h3>Preview</h3>
					<PreviewCardTop />
					<PreviewCardBottom />
				</PreviewCard>
			</StyledPreview>
			<StyledMain>
				<ProjectCountry>
					<h2>What country is your project located in?</h2>
				</ProjectCountry>
				<ProjectLocation>
					<h2>What type of project is it and what is the address?</h2>
				</ProjectLocation>
				<ProjectDescription>
					<h2>Tell us about your project.</h2>
				</ProjectDescription>
				<ProjectGoal>
					<h2>What is your funding goal?</h2>
				</ProjectGoal>
			</StyledMain>
			<StyledProgress>
				<h1>1</h1>
				<h1>2</h1>
				<h1>3</h1>
				<h1>4</h1>
				<h1>5</h1>
			</StyledProgress>
		</StyledContainer>
	)
}

export { BorrowContent }
