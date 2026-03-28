from urllib import request
from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.utils import timezone
from .serializers import Reservation as ReservationSerializer, ReservationCreateSerializer
from .models import Reservation

# Create your views here.
class ReservationViewSet(viewsets.ModelViewSet):
    permission_classes= [IsAuthenticated]
    queryset= Reservation.objects.all()
    def get_serializer_class(self):
        if self.action == 'create':
            return ReservationCreateSerializer
        return ReservationSerializer

    def get_queryset(self):
        user= self.request.user
        queryset= Reservation.objects.all()

        if user.role == 'CLIENTE':
            queryset= queryset.filter(cliente=user)
        elif user.role == 'ADMIN':
            queryset= queryset.filter(clase__entrenador=user)
        estado =self.request.query_params.get('estado', None)

        if estado:
            queryset= queryset.filter(estado=estado)
        return queryset

    def perform_create(self, serializer):
        serializer.save(cliente= self.request.user) #doubt

    @action(detail=True, methods=['post'])
    def cancelar(self, request, pk=None):

        reserva= self.get_object()
        #solo se puede cancelar si es usuario cliente en la clase o admin
        if reserva.cliente != request.user and not request.user.is_staff:
            return Response({'detail': 'No tiene permiso para cancelar esta reserva'}, status= status.HTTP_403_FORBIDDEN)
        
        if reserva.clase.horario < timezone.now():
            return Response({'detail': 'No se puede cancelar una reserva pasada'}, status= status.HTTP_400_BAD_REQUEST
                        )
        if reserva.estado == 'CANCELADA':
            return Response({'detail': 'La reserva ya está cancelada'}, status= status.HTTP_400_BAD_REQUEST)
        
        reserva.estado = Reservation.status.CANCELADA
        reserva.save()

        serializer = Reservation(reserva)
        return Response(serializer.data) #dudas 
    @action(detail=False, methods=['get'])
    

    def mis_proximas(self, request):
        user = self.request.user
        if user.role == 'CLIENTE':

            reserva= self.get_queryset().filter(cliente= request.user, estado= 'CONFIRMADA' ,clase__horario__gte= timezone.now()) 

        elif user.role == 'ENTRENADOR':
            reservas= Reservation.objects.all()
           # reservas = Reservation.objects.filter(
           # clase__entrenador=user,
           # estado='CONFIRMADA',
           # clase__horario__gte=timezone.now()
        #)

        else:
            reservas = Reservation.objects.none()

        serializer = ReservationSerializer(reservas, many=True)
        return Response(serializer.data)