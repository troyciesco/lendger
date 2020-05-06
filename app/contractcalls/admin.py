from django.contrib import admin
from .models import EventBlock, LnatSum


class EventAdmin(admin.ModelAdmin):
    list_display = ('id',)


class DailyLNATSumAdmin(admin.ModelAdmin):
    list_display = ('id',)


admin.site.register(EventBlock, EventAdmin)
admin.site.register(LnatSum, DailyLNATSumAdmin)
