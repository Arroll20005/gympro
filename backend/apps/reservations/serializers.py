from .models import Reservation as ReservationModel
from rest_framework import serializers
from apps.classes.serializers import ClassListSerializer
from apps.accounts.serializers import UserListSerializer
from django.db import IntegrityError

class Reservation(serializers.ModelSerializer):
    cliente_name= serializers.CharField(source='cliente.get_full_name', read_only=True)
    cliente_details= UserListSerializer(source='cliente', read_only=True)
    clase_details= ClassListSerializer(source='clase', read_only=True)
    estado_display= serializers.CharField(source='get_estado_display', read_only=True)
    class Meta:

        model = ReservationModel
        fields = [
            'id',
            'cliente',
            'cliente_name',
            'cliente_details',
            'clase',
            'clase_details',
            'estado',
            'estado_display',
            'nota',
            'fecha_reserva'
        ]
        read_only_fields = ['id', 'fecha_reserva']
    def validate(self, data):

        clase= data.get('clase')
        if not self.instance:
            if not clase.tiene_cupo:
                raise serializers.ValidationError({
                'clase': f'La clase "{clase.nombre}" ya está llena. Capacidad máxima: {clase.capacidad_maxima}'
            })
        return data
        
class ReservationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para crear reservas
    """
    class Meta:
        model = ReservationModel
        fields = [ 'clase', 'nota']
    
    def validate(self, data):
        clase = data.get('clase')
        user= self.context['request'].user
        if ReservationModel.objects.filter(cliente= user, clase= clase).exists():
            raise serializers.ValidationError({
                'clase': 'Ya tienes una reserva para esta clase.'
            })
        
        if not clase.tiene_cupo:
            raise serializers.ValidationError({
                'clase': f'La clase "{clase.nombre}" ya está llena.'
            })
       
        
        return data