from django.db import models
from django.core.validators import MinValueValidator #para validar valores mínimos
from apps.accounts.models import CustomUser

# Create your models here.
class Class(models.Model):
    """
    Clase/Actividad del gimnasio (Yoga, CrossFit, etc.)
    """
    nombre = models.CharField(max_length=100, verbose_name='nombre de la clase')
    descripcion= models.TextField(verbose_name='descripcion de la clase')
    entrenador =models.ForeignKey(CustomUser, on_delete= models.PROTECT, related_name="clases_asignadas", limit_choices_to={'role': 'ENTRENADOR'}, verbose_name= 'Entrenador')
    horario= models.DateTimeField(verbose_name='horario de la clase')
    duracion= models.IntegerField(default=60, validators=[MinValueValidator(1)], verbose_name='duracion en minutos')
    capacidad_maxima= models.IntegerField(default=20, validators=[MinValueValidator(1)], verbose_name= 'capacidad maxima de la clase')
    activa= models.BooleanField(default=True, verbose_name= 'activa', help_text="Si está disponible para reservar")
    fecha_de_creacion= models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name= 'Clase'
        verbose_name_plural= 'Clases'
    def __str__(self):
        return f"{self.nombre} - {self.horario.strftime('%d/%m/%Y %H:%M')}"
    

    @property
    def reservas_actuales(self):
        """
        Retorna cuántas reservas tiene esta clase
     """
        return self.reservas.filter(estado='CONFIRMADA').count()
    
    @property
    def tiene_cupo(self):
        return self.reservas_actuales < self.capacidad_maxima
    