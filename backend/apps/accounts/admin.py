from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'fecha_de_registro', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Información del Gimnasio', {'fields': ('role', 'telefono', 'fecha_de_registro')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Información del Gimnasio', {'fields': ('role', 'telefono')}),
    )
    
    readonly_fields = ('fecha_de_registro',)