import { gql } from "apollo-boost"

export const LOGIN_MUTATION = gql`
	mutation($username: String!, $password: String!) {
		tokenAuth(username: $username, password: $password) {
			token
		}
	}
`

export const REGISTER_MUTATION = gql`
	mutation($username: String!, $email: String!, $password: String!) {
		createUser(username: $username, email: $email, password: $password) {
			user {
				username
				email
			}
		}
	}
`

export const CREATE_LOAN_MUTATION = gql`
	mutation($projectId: Int!, $loanAmt: Int!) {
		createLoan(projectId: $projectId, loanAmt: $loanAmt) {
			project {
				id
				loans {
					loanAmt
				}
			}
		}
	}
`

export const CREATE_QUESTION_MUTATION = gql`
	mutation($projectId: Int!, $question: String!) {
		createQandA(projectId: $projectId, question: $question) {
			qanda {
				id
				createdBy {
					id
				}
				project {
					id
				}
			}
		}
	}
`

export const UPDATE_PROJECT_STATUS_MUTATION = gql`
	mutation($projectId: Int!, $status: String!) {
		updateProject(projectId: $projectId, status: $status) {
			project {
				id
				title
				status
			}
		}
	}
`

export const CREATE_PROJECT_MUTATION = gql`
	mutation(
		$title: String
		$projectType: String!
		$address1: String!
		$address2: String
		$city: String!
		$state: String!
		$country: String!
		$zipcode: String!
		$fundingGoal: Int!
		$borrowRate: Int!
		$borrowTerm: Int!
		$originationFee: Int!
		$applicationFee: Int!
		$loanTotal: Int!
		$description: String
	) {
		createProject(
			title: $title
			projectType: $projectType
			address1: $address1
			address2: $address2
			city: $city
			state: $state
			country: $country
			zipcode: $zipcode
			fundingGoal: $fundingGoal
			borrowRate: $borrowRate
			borrowTerm: $borrowTerm
			originationFee: $originationFee
			applicationFee: $applicationFee
			loanTotal: $loanTotal
			description: $description
		) {
			project {
				id
				title
				projectType
				address1
				address2
				city
				state
				country
				zipcode
				fundingGoal
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
			}
		}
	}
`
