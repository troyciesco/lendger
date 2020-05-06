from django.contrib import admin


# Register your models here.
from .models import Project, Loan, Inquiry


class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'address1', 'city', 'state', 'zipcode',
                    'status', 'funding_goal', 'funding_date')
    list_display_links = ('id', 'address1')
    list_editable = ('status', 'funding_date')


class LoanAdmin(admin.ModelAdmin):
    list_display = ('id', 'loan_amt', 'project', 'user')
    list_display_links = ('id', 'loan_amt')


class QandAAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'answer',
                    'project', 'created_at', 'created_by')
    list_display_links = ('question',)
    list_editable = ('answer',)


admin.site.register(Project, ProjectAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(Inquiry, QandAAdmin)
