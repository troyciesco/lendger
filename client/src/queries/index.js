import { gql } from "apollo-boost"

export const IS_LOGGED_IN_QUERY = gql`
	query {
		isLoggedIn @client
	}
`

export const ME_QUERY = gql`
	query {
		me {
			id
			username
			email
			isUnderwriter
			projectSet {
				id
				address1
				city
				state
				country
				description
				fundingGoal
				createdAt
				loans {
					id
					loanAmt
				}
			}
			loanSet {
				id
				loanAmt
				project {
					id
					address1
					city
					state
					country
					description
					loans {
						id
						loanAmt
					}
				}
			}
		}
	}
`

export const GET_ALL_PROJECTS_QUERY = gql`
	query getAllProjectsQuery {
		projects {
			title
			status
			id
			address1
			address2
			city
			state
			country
			zipcode
			fundingGoal
			# fundingDate
			borrowRate
			borrowTerm
			originationFee
			applicationFee
			loanTotal
			description
			createdAt
			createdBy {
				id
				username
			}
			loans {
				id
				loanAmt
			}
		}
	}
`

export const GET_PROJECTS_QUERY = gql`
	query getProjectsQuery(
		$order: String
		$loanTotalLow: Int = 0
		$loanTotalHigh: Int = 100000000
		$city: String = ""
	) {
		projects(
			status: "APPROVED"
			order: $order
			loanTotalLow: $loanTotalLow
			loanTotalHigh: $loanTotalHigh
			city: $city
		) {
			title
			status
			id
			address1
			address2
			city
			state
			country
			zipcode
			fundingGoal
			# fundingDate
			borrowRate
			borrowTerm
			originationFee
			applicationFee
			loanTotal
			description
			createdAt
			createdBy {
				id
				username
			}
			loans {
				id
				loanAmt
				user {
					id
				}
			}
			inquirySet {
				id
				question
				answer
				isAnswered
			}
		}
	}
`
