// import React from "react"
// import ProjectsList from "../ProjectsList"
// import { GET_PROJECTS_QUERY } from "../../queries"
// import { MockedProvider } from "react-apollo/test-utils"
// import { TestRenderer as renderer } from "react-test-renderer"

// const mocks = [
// 	{
// 		request: {
// 			query: GET_PROJECTS_QUERY,
// 			search: "A",
// 		},
// 		result: {
// 			data: {
// 				project: { id: "1", address1: "123 Main St" },
// 			},
// 		},
// 	},
// ]

// it("renders a grid of projects", () => {
// 	let match = "hi"
// 	renderer.create(
// 		<MockedProvider mocks={mocks} addTypename={false}>
// 			<ProjectsList projects={projects} match={match} />
// 		</MockedProvider>,
// 	)
// })

it("adds correctly", () => {
	expect(1 + 1).toEqual(2)
})
