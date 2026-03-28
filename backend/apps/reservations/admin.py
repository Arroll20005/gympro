from django.contrib import admin


from .models import Reservation

# Register your models here.

@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = (
        'cliente',
        'clase',
        'estado',
        'fecha_reserva'
    )
    list_filter = ('estado', 'fecha_reserva', 'clase')
    search_fields = ('cliente__username', 'clase__nombre', 'notas')
    readonly_fields = ('fecha_reserva',)
    def get_queryset(self, request):

        query= super().get_queryset(request)
        return query.select_related('cliente', 'clase')
    
