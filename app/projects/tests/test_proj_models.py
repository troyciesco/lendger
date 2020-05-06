from django.test import TestCase
from projects.models import Project, Loan, Image, Inquiry
from users.models import CustomUser


class ModelTests(TestCase):

    def test_project_model(self):
        """Test creation of project with project model with required fields is successful"""
        address = '2014 Forest Hills Drive'
        Fville = 'Fayetteville'
        NC = 'North Carolina'
        project = Project(address1=address, city=Fville, state=NC)

        self.assertEqual(address, project.address1)
        self.assertEqual(Fville, project.city)
        self.assertEqual(NC, project.state)

    def test_loan_model(self):
        """Test creation of loan with loan model with required fields is successful"""
        # project creation
        project = Project(address1='2014 Forest Hills Drive',
                          city='Fayetteville', state='North Carolina')
        # user creation
        user = CustomUser.objects.create_user(
            username='jcole',
            password='2014',
            email='cole@gmail.com'
        )
        # loan creation
        money = '15000'
        loan = Loan(user=user, project=project, loan_amt=money)

        self.assertEqual(user, loan.user)
        self.assertEqual(project, loan.project)
        self.assertEqual(money, loan.loan_amt)

    def test_image_model(self):
        """Test creation of image with image model with required fields is successful"""
        photoid = '483947'
        photourl = 'https://www.imageurl.com'
        image = Image(photo_id=photoid, url=photourl)

        self.assertEqual(photoid, image.photo_id)
        self.assertEqual(photourl, image.url)

    def test_inquiry_model(self):
        """Test creation of inquiry with inquiry model with required fields is successful"""
        # project creation
        project = Project(address1='2014 Forest Hills Drive',
                          city='Fayetteville', state='North Carolina')
        # user creation
        user = CustomUser.objects.create_user(
            username='jcole',
            password='2014',
            email='cole@gmail.com'
        )
        question = 'Hello?'
        answer = 'Yes.'
        inquiry = Inquiry(question=question, answer=answer,
                          project=project, created_by=user)

        self.assertEqual(question, inquiry.question)
        self.assertEqual(answer, inquiry.answer)
        self.assertEqual(project, inquiry.project)
        self.assertEqual(user, inquiry.created_by)
        self.assertEqual(False, inquiry.is_answered)
