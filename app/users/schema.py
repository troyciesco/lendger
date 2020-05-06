import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from .models import CustomUser


class UserType(DjangoObjectType):
    class Meta:
        model = CustomUser


class Query(graphene.ObjectType):
    user = graphene.List(UserType)
    me = graphene.Field(UserType)

    def resolve_user(self, info):
        return CustomUser.objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in')
        return user


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        password = graphene.String(required=True)
        username = graphene.String(required=True)
        email = graphene.String(required=True)
        wallet_address = graphene.String()
        is_underwriter = graphene.Boolean()

    def mutate(self, info, password, username, email, **kwargs):
        user = CustomUser(username=username.lower(), email=email, wallet_address=kwargs.get(
            'wallet_address', ""), is_underwriter=kwargs.get('is_underwriter', False))
        user.set_password(password)
        user.save()
        return CreateUser(user=user)


class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        user_id = graphene.Int(required=True)
        password = graphene.String()
        username = graphene.String()
        email = graphene.String()
        wallet_address = graphene.String()
        is_underwriter = graphene.Boolean()

    def mutate(self, info, user_id, **kwargs):
        user = CustomUser.objects.get(id=user_id)
        usercurrent = info.context.user

        if usercurrent != user:
            raise Exception('Not permitted to update this user')

        user.set_password(kwargs.get('password', user.password))
        user.username = kwargs.get('username', user.username).lower()
        user.email = kwargs.get('email', user.email)
        user.wallet_address = kwargs.get('wallet_address', user.wallet_address)
        user.is_underwriter = kwargs.get('is_underwriter', user.is_underwriter)
        user.save()

        return UpdateUser(user=user)


class DeleteUser(graphene.Mutation):
    user_id = graphene.Int()

    class Arguments:
        user_id = graphene.Int(required=True)

    def mutate(self, info, user_id):
        user = CustomUser.objects.get(id=user_id)
        usercurrent = info.context.user

        if usercurrent != user:
            raise Exception('Not permitted to delete this user')

        user.delete()

        return DeleteUser(user_id=user_id)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeleteUser.Field()
