import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from .models import EventBlock, LnatSum


class EventBlockType(DjangoObjectType):
    class Meta:
        model = EventBlock


class LnatSumType(DjangoObjectType):
    class Meta:
        model = LnatSum


class Query(graphene.ObjectType):
    EventBlock = graphene.List(EventBlockType, search=graphene.String())
    LnatSum = graphene.List(LnatSumType, search=graphene.String())

    def resolve_EventBlock(self, info, search=None):
        if search:
            filter = (
                Q(event_name__icontains=search)
            )
            return EventBlock.objects.filter(filter)
        return EventBlock.objects.all()

    def resolve_LnatSum(self, info, search=None):
        if search:
            filter = (
                Q(user_address__icontains=search)
            )
            # lots of match types, exact, iexact, gt, startswith, contains, icontains)
            # return Track.objects.filter(title__icontains=search)
            return LnatSum.objects.filter(filter)
        return LnatSum.objects.all()


class NewLnatCount(graphene.Mutation):
    Lnat = graphene.Field(LnatSumType)

    class Arguments:
        lnat_held = graphene.String(required=True)
        user_address = graphene.String(required=True)
        day_number = graphene.Int(required=True)

    def mutate(self, info, lnat_held, user_address, day_number):
        Lnat = LnatSum(lnat_held=lnat_held, day_number=day_number, user_address=user_address)

        Lnat.save()
        return NewLnatCount(Lnat=Lnat)


class UpdateLnatCount(graphene.Mutation):
    Lnat = graphene.Field(LnatSumType)

    class Arguments:
        lnat_held = graphene.String(required=True)
        day_number = graphene.Int(required=True)
        user_address = graphene.String(required=True)

    def mutate(self, info, user_address, lnat_held, day_number):
        Lnat = LnatSum.objects.get(user_address=user_address)
        Lnat.lnat_held = lnat_held
        Lnat.day_number = day_number

        Lnat.save()
        return UpdateLnatCount(Lnat=Lnat)


class DeleteLnatCount(graphene.Mutation):
    Lnat = graphene.Field(LnatSumType)

    class Arguments:
        user_address = graphene.String(required=True)

    def mutate(self, info, user_address):
        Lnat = LnatSum.objects.get(user_address=user_address)

        Lnat.delete()

        return DeleteLnatCount(Lnat=Lnat)


class NewEventBlock(graphene.Mutation):
    eventblock = graphene.Field(EventBlockType)

    class Arguments:
        event_name = graphene.String(required=True)
        past_block = graphene.Int(required=True)
        current_block = graphene.Int(required=True)

    def mutate(self, info, current_block, event_name, past_block):
        eventblock = EventBlock(
            current_block=current_block, event_name=event_name, past_block=past_block)
        eventblock.save()

        return NewEventBlock(eventblock=eventblock)


class UpdateEventBlock(graphene.Mutation):
    eventblock = graphene.Field(EventBlockType)

    class Arguments:
        event_name = graphene.String(required=True)
        past_block = graphene.Int(required=True)
        current_block = graphene.Int(required=True)

    def mutate(self, info, event_name, past_block, current_block):
        eventblock = EventBlock.objects.get(event_name=event_name)
        eventblock.past_block = past_block
        eventblock.current_block = current_block

        eventblock.save()
        return UpdateEventBlock(eventblock=eventblock)


class DeleteEventBlock(graphene.Mutation):
    eventblock = graphene.Field(EventBlockType)

    class Arguments:
        event_name = graphene.String(required=True)

    def mutate(self, info, event_name):
        eventblock = EventBlock.objects.get(event_name=event_name)

        eventblock.delete()

        return DeleteEventBlock(eventblock=eventblock)


class Mutation(graphene.ObjectType):
    new_event_block = NewEventBlock.Field()
    update_event_block = UpdateEventBlock.Field()
    delete_event_block = DeleteEventBlock.Field()
    new_lnat_count = NewLnatCount.Field()
    update_lnat_count = UpdateLnatCount.Field()
    delete_lnat_count = DeleteLnatCount.Field()
