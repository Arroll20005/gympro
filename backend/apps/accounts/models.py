from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):
    class Roles(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        ENTRENADOR = 'ENTRENADOR', 'Entrenador'
        CLIENTE = 'CLIENTE', 'Cliente'

    role = models.CharField(max_length=15, choices=Roles.choices, default=Roles.CLIENTE, verbose_name='Rol')
    telefono = models.CharField(max_length=15, blank=True, null=True, verbose_name='Teléfono')
    fecha_de_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro')

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"