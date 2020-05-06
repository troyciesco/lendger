from django.db import models
from django.contrib.auth import get_user_model
from datetime import timezone, datetime, timedelta
from users.models import CustomUser

# Create your models here.


class Project(models.Model):
    def return_date_time():
        now = datetime.now()
        return now + timedelta(45)
    address1 = models.TextField()
    address2 = models.TextField(blank=True)
    title = models.CharField(max_length=50, blank=True)
    project_type = models.TextField(blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50)
    zipcode = models.CharField(max_length=50, blank=True)
    funding_goal = models.PositiveIntegerField()
    borrow_rate = models.PositiveIntegerField()
    borrow_term = models.PositiveIntegerField()
    origination_fee = models.PositiveIntegerField()
    application_fee = models.PositiveIntegerField()
    loan_total = models.PositiveIntegerField()
    STATUS_CHOICES = [
        ('Approved', 'Approved'),  # Second value is what admin chooses
        ('Pending', 'Pending'),
        ('Denied', 'Denied')
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='Pending')
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser, null=True, on_delete=models.CASCADE)
    funding_date = models.DateField(default=return_date_time)
    grade = models.CharField(max_length=50)
    ARV = models.PositiveIntegerField()

    def __str__(self):
        return self.address1


class Loan(models.Model):
    user = models.ForeignKey(
        get_user_model(), null=True, on_delete=models.CASCADE)
    project = models.ForeignKey(
        'projects.Project', related_name='loans', on_delete=models.CASCADE)
    loan_amt = models.PositiveIntegerField()

    # def __str__(self):
    #     return str(self.loan_amt) #needs to be string or else error occurs


class Image(models.Model):
    photo_id = models.CharField(max_length=50)
    url = models.URLField(max_length=200)


class Inquiry(models.Model):
    class Meta:
        verbose_name_plural = "Inquiries"
    question = models.TextField()
    answer = models.TextField()
    project = models.ForeignKey(Project, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        CustomUser, null=True, on_delete=models.CASCADE)
    is_answered = models.BooleanField(default=False)


# class Tier(models.Model):
#     project_id = models.IntegerField()
