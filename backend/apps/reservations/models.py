from django.db import models
from apps.accounts.models import CustomUser
from apps.classes.models import Class
# Create your models here.
class Reservation(models.Model):

    class Status(models.TextChoices):
        CONFIRMADA= 'CONFIRMADA', 'Confirmada'
        CANCELADA= 'CANCELADA', 'Cancelada'
        EN_ESPERA= 'EN_ESPERA', 'En Lista de Espera'

    cliente= models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name= 'reservas',
                                limit_choices_to= {'role': 'CLIENTE'}, verbose_name= 'Cliente'
                                )
    clase= models.ForeignKey(Class, on_delete= models.CASCADE, related_name= 'reservas', verbose_name= 'Clase')
    estado= models.CharField(max_length=20, choices= Status.choices, default =Status.EN_ESPERA, verbose_name= 'Estado')
    nota= models.TextField(
        blank=True, null=True, verbose_name= 'Nota')
    fecha_reserva = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Reserva")

    class Meta:
        verbose_name = 'Reserva'
        verbose_name_plural = 'Reservas'
        ordering = ['-fecha_reserva']
        unique_together = ('cliente', 'clase') # Un cliente no puede reservar la misma clase más de una vez
    def __str__(self):
        return f"Reserva de {self.cliente.username} para la clase {self.clase.nombre} - Estado: {self.estado}"

