from django.contrib import admin
from .models import Class

# Register your models here.
@admin.register(Class)

class ClassAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'entrenador', 'horario', 'duracion', 'capacidad_maxima', 'activa'
                    #CODIGO COMENTADO PARA EVITAR ERRORES POR PROPIEDADES NO IMPLEMENTADAS
                   # , 'reservas_actuales', 'tiene_cupo'
                    )
    list_filter = ('activa', 'entrenador')
    search_fields = ('nombre', 'descripcion')
    date_hierarchy = 'horario' # Permite filtrar por fecha en la parte superior


#CODIGO COMENTADO PARA EVITAR ERRORES POR PROPIEDADES NO IMPLEMENTADAS
    def reservas_actuales(self, obj):
        return obj.reservas_actuales
    reservas_actuales.short_description = 'Reservas'