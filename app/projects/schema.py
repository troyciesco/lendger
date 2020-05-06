import graphene
from graphene_django import DjangoObjectType
from graphql import GraphQLError
from django.db.models import Q
from .models import Project, Loan, Image, Inquiry
from users.models import CustomUser
from users.schema import UserType


class ProjectType(DjangoObjectType):
    class Meta:
        model = Project


class LoanType(DjangoObjectType):
    class Meta:
        model = Loan


class ImageType(DjangoObjectType):
    class Meta:
        model = Image


class QandAType(DjangoObjectType):
    class Meta:
        model = Inquiry


class Query(graphene.ObjectType):
    projects = graphene.List(ProjectType, status=graphene.String(
    ), city=graphene.String(), state=graphene.String(), country=graphene.String(), project_type=graphene.String(), borrow_term=graphene.Int(), borrow_rate=graphene.Int(), loan_total=graphene.Int(), loan_total_low=graphene.Int(), loan_total_high=graphene.Int(), order=graphene.String())
    loans = graphene.List(LoanType)
    images = graphene.List(ImageType)
    QandAs = graphene.List(QandAType)

    def resolve_projects(self, info, status=None, city="", state="", country="", project_type="", borrow_term="", borrow_rate="", loan_total="", loan_total_low=0, loan_total_high=100000000, order="?"):
        if status:
            # filter = (
            #     Q(status__icontains=status)
            #     Q(city__icontains=city)
            # )
            # lots of match types, exact, iexact, gt, startswith, contains, icontains)
            # return Track.objects.filter(title__icontains=search)
            return Project.objects.filter(status__icontains=status, city__icontains=city, state__icontains=state, country__icontains=country, project_type__icontains=project_type, borrow_term__icontains=borrow_term, borrow_rate__icontains=borrow_rate, loan_total__range=(loan_total_low, loan_total_high)).order_by(order)

        return Project.objects.all()

    def resolve_loans(self, info):
        return Loan.objects.all()

    def resolve_images(self, info):
        return Image.objects.all()

    def resolve_QandAs(self, info):
        return Inquiry.objects.all()


class CreateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:

        address1 = graphene.String(required=True)
        address2 = graphene.String()
        title = graphene.String()
        project_type = graphene.String()
        city = graphene.String(required=True)
        state = graphene.String(required=True)
        country = graphene.String(required=True)
        zipcode = graphene.String()
        funding_goal = graphene.Int()
        borrow_rate = graphene.Int()
        borrow_term = graphene.Int()
        origination_fee = graphene.Int()
        application_fee = graphene.Int()
        status = graphene.String()
        loan_total = graphene.Int()
        description = graphene.String()
        ARV = graphene.Int()

    def mutate(self, info, address1, city, state, country, zipcode, **kwargs):
        user = info.context.user or None
        if user.is_anonymous:
            raise GraphQLError('Log in to add a project.')

        project = Project(address1=address1, address2=kwargs.get('address2', ""), title=kwargs.get('title', ""),
                          project_type=kwargs.get('project_type', ""), city=city, state=state, country=country, zipcode=zipcode,
                          funding_goal=kwargs.get('funding_goal', ""), borrow_rate=kwargs.get('borrow_rate', ""),
                          borrow_term=kwargs.get('borrow_term', ""), origination_fee=kwargs.get('origination_fee', ""),
                          application_fee=kwargs.get('application_fee', ""), loan_total=kwargs.get('loan_total', ""),
                          description=kwargs.get('description', ""), ARV=kwargs.get('ARV', 0), created_by=user)
        project.save()
        return CreateProject(project=project)


class UpdateProject(graphene.Mutation):
    project = graphene.Field(ProjectType)

    class Arguments:
        project_id = graphene.Int(required=True)
        # user_id = graphene.Int(required=True)
        title = graphene.String()
        address1 = graphene.String()
        address2 = graphene.String()
        project_type = graphene.String()
        city = graphene.String()
        state = graphene.String()
        country = graphene.String()
        zipcode = graphene.String()
        funding_goal = graphene.Int()
        description = graphene.String()
        status = graphene.String()
        grade = graphene.String()

    def mutate(self, info, project_id, **kwargs):
        usercurr = info.context.user
        user_id = usercurr.id
        user = CustomUser.objects.get(id=user_id)
        project = Project.objects.get(id=project_id)

        if project.created_by != user and not user.is_underwriter:
            raise Exception('Not permitted to update this project')

        if project.created_by == user:
            project.address1 = kwargs.get('address1', project.address1)
            project.address2 = kwargs.get('address2', project.address2)
            project.project_type = kwargs.get(
                'project_type', project.project_type)
            project.title = kwargs.get('title', project.title)
            project.city = kwargs.get('city', project.city)
            project.state = kwargs.get('state', project.state)
            project.country = kwargs.get('country', project.country)
            project.zipcode = kwargs.get('zipcode', project.zipcode)
            project.description = kwargs.get(
                'description', project.description)
            project.funding_goal = kwargs.get(
                'funding_goal', project.funding_goal)
        else:
            project.address1 = project.address1
            project.address2 = project.address2
            project.project_type = project.project_type
            project.title = project.title
            project.city = project.city
            project.state = project.state
            project.country = project.country
            project.zipcode = project.zipcode
            project.description = project.description
            project.funding_goal = project.funding_goal

        if user.is_underwriter:
            project.status = kwargs.get('status', project.status)
            project.grade = kwargs.get('grade', project.grade)
        else:
            project.status = project.status

        project.save()

        return UpdateProject(project=project)


class DeleteProject(graphene.Mutation):
    project_id = graphene.Int()

    class Arguments:
        project_id = graphene.Int(required=True)

    def mutate(self, info, project_id):
        user = info.context.user
        project = Project.objects.get(id=project_id)

        if project.created_by != user:
            raise Exception('Not permitted to delete this project.')

        project.delete()

        return DeleteProject(project_id=project_id)


class CreateLoan(graphene.Mutation):
    user = graphene.Field(UserType)
    project = graphene.Field(ProjectType)
    loan = graphene.Field(LoanType)

    class Arguments:
        project_id = graphene.Int(required=True)
        loan_amt = graphene.Int(required=True)

    def mutate(self, info, project_id, loan_amt):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Log in to loan.')

        # if project.created_by is user
        #     raise Exception("You can't fund your own project.")

        project = Project.objects.get(id=project_id)
        if not project:
            raise Exception('Cannot find project with given project id')

        loan = Loan(project=project, loan_amt=loan_amt, user=user)
        loan.save()
        return CreateLoan(loan=loan)

        # Loan.objects.create(
        #     user=user,
        #     project=project,
        #     loan_amt=loan_amt
        # )

        # return CreateLoan(user=user, project=project, loan_amt=loan_amt)


class CreateQandA(graphene.Mutation):  # intended for users only (asking questions)
    qanda = graphene.Field(QandAType)
    user = graphene.Field(UserType)
    project = graphene.Field(ProjectType)

    class Arguments:
        project_id = graphene.Int(required=True)
        question = graphene.String(required=True)

    def mutate(self, info, project_id, question):
        user = info.context.user or None
        project = Project.objects.get(id=project_id)

        """Should eventually add rule where one user is not allowed to post more than one
        question for the same listing, would eventually implement reply chain"""

        if user.is_anonymous:
            raise GraphQLError('Log in to add a question.')

        qanda = Inquiry(question=question, project=project, created_by=user)
        qanda.save()
        return CreateQandA(user=user, project=project, qanda=qanda)


# intended for users only (editing questions allowed only if they're unanswered)
class UpdateQ(graphene.Mutation):
    qanda = graphene.Field(QandAType)
    user = graphene.Field(UserType)

    class Arguments:
        question_id = graphene.Int(required=True)
        question = graphene.String()

    def mutate(self, info, question_id, question):
        user = info.context.user
        qanda = Inquiry.objects.get(id=question_id)

        if qanda.created_by != user:
            raise Exception('Not permitted to Update this project')

        if qanda.is_answered == True:
            raise Exception(
                'Question is already answered and cannot be edited further')

        qanda.question = question

        qanda.save()
        return UpdateQ(user=user, qanda=qanda)


# intended for admins / owners of projects pertaining to questions only
class UpdateA(graphene.Mutation):
    user = graphene.Field(UserType)
    qanda = graphene.Field(QandAType)

    class Arguments:
        question_id = graphene.Int(required=True)
        project_id = graphene.Int(required=True)
        answer = graphene.String()

    def mutate(self, info, question_id, project_id, answer):
        user = info.context.user
        project = Project.objects.get(id=project_id)
        qanda = Inquiry.objects.get(id=question_id)

        if not user.is_staff and user != project.created_by:
            raise Exception(
                'Only admins and project owners can answer questions')

        qanda.is_answered = True
        qanda.answer = answer

        qanda.save()
        return UpdateA(user=user, qanda=qanda)


class DeleteQandA(graphene.Mutation):
    user = graphene.Field(UserType)
    question_id = graphene.Int()

    class Arguments:
        question_id = graphene.Int(required=True)

    def mutate(self, info, question_id):
        user = info.context.user
        qanda = Inquiry.objects.get(id=question_id)

        if qanda.created_by != user and user.is_staff == False:
            raise Exception('Not permitted to delete this question.')

        if qanda.is_answered == True:
            raise Exception(
                "Not permitted to delete a questions that's already been answered")

        qanda.delete()

        return DeleteQandA(question_id=question_id)


class Mutation(graphene.ObjectType):
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    create_loan = CreateLoan.Field()
    create_qand_a = CreateQandA.Field()
    update_q = UpdateQ.Field()
    update_a = UpdateA.Field()
    delete_qand_a = DeleteQandA.Field()
