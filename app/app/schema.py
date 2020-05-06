import graphene
import graphql_jwt
import projects.schema
import users.schema
import contractcalls.schema


class Query(projects.schema.Query, users.schema.Query, contractcalls.schema.Query, graphene.ObjectType):
    pass


class Mutation(users.schema.Mutation, projects.schema.Mutation, contractcalls.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
