from django.contrib import admin


# Register your models here.
from .models import CustomUser


class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'email', 'is_underwriter')
    list_display_links = ('username',)
    list_editable = ('is_underwriter',)


admin.site.register(CustomUser, UserAdmin)
