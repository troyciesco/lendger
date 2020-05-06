from django.db import models


class EventBlock(models.Model):
    current_block = models.IntegerField()
    event_name = models.CharField(max_length=50, blank=False)
    past_block = models.IntegerField()


class LnatSum(models.Model):
    lnat_held = models.CharField(max_length=50, blank=False)
    day_number = models.IntegerField()
    user_address = models.CharField(max_length=50, blank=False)
