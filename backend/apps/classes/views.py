# ============================================================
# VIEWSET PARA LA APP "classes"
# ============================================================
#
# ¿Qué es un ViewSet?
#
# En Django Rest Framework, un ViewSet es un controlador
# que ya trae implementadas automáticamente las operaciones CRUD:
#
#   GET     /classes/        -> list()
#   GET     /classes/1/      -> retrieve()
#   POST    /classes/        -> create()
#   PUT     /classes/1/      -> update()
#   PATCH   /classes/1/      -> partial_update()
#   DELETE  /classes/1/      -> destroy()
#
# Patrón aplicado:
# ✔ ModelViewSet = Template Method Pattern
#   (Hereda comportamiento base y permite personalizar partes)
#
# ============================================================

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from rest_framework import filters

from .models import Class
from .serializers import ClassSerializer, ClassListSerializer
from .permission import IsAdminOrTrainer


class ClassViewSet(viewsets.ModelViewSet):

    # --------------------------------------------------------
    # QUERYSET BASE
    # --------------------------------------------------------
    # Define el conjunto de datos inicial.
    # Luego puede modificarse dinámicamente en get_queryset().
    #
    queryset = Class.objects.all()


    # --------------------------------------------------------
    # FILTROS AUTOMÁTICOS
    # --------------------------------------------------------
    #
    # Esto permite usar en la URL cosas como:
    #
    #   /classes/?entrenador=3
    #   /classes/?search=box
    #   /classes/?ordering=horario
    #
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]

    # Campos permitidos para filtro exacto
    filterset_fields = ['entrenador', 'activa']

    # Campos donde se puede buscar texto
    search_fields = ['nombre', 'descripcion']

    # Campos por los que se puede ordenar
    ordering_fields = ['horario']


    # ========================================================
    # SELECCIÓN DINÁMICA DE SERIALIZER
    # ========================================================
    #
    # Patrón aplicado:
    # ✔ Strategy Pattern
    #
    # Elegimos qué serializer usar dependiendo
    # de la acción que se esté ejecutando.
    #
    def get_serializer_class(self):

        # Si estamos listando muchas clases
        if self.action == 'list':
            return ClassListSerializer

        # Para detalle, creación, edición
        return ClassSerializer


    # ========================================================
    # PERMISOS DINÁMICOS
    # ========================================================
    #
    # Aquí definimos quién puede hacer qué.
    #
    # Patrón aplicado:
    # ✔ Policy Pattern (reglas de acceso)
    #
    def get_permissions(self):

        # Solo admin puede crear, editar o borrar
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminOrTrainer()]   # ❗ ERROR EN TU CÓDIGO: estaba mal escrito

        # Cualquier usuario autenticado puede ver
        return [IsAuthenticated()]


    # ========================================================
    # QUERYSET PERSONALIZADO SEGÚN EL ROL
    # ========================================================
    #
    # Aquí estás aplicando lógica de negocio:
    # lo que cada tipo de usuario puede ver.
    #
    def get_queryset(self):
        print(f"DEBUG: get_queryset called. User: {self.request.user}, Authenticated: {self.request.user.is_authenticated}")
        if self.request.user.is_authenticated:
            print(f"DEBUG: User role: {getattr(self.request.user, 'role', 'NO ROLE ATTRIBUTE')}")
            print(f"DEBUG: User is_staff: {self.request.user.is_staff}")

        queryset = Class.objects.all()
        user = self.request.user

        # ----------------------------------------------------
        # Si es CLIENTE:
        # - Solo puede ver clases activas
        # - Solo futuras (no pasadas)
        # ----------------------------------------------------
        if user.role == 'CLIENTE':
            print("DEBUG: Filtering for CLIENTE role")
            queryset = queryset.filter(
                activa=True,
                horario__gte=timezone.now()
            )

        # ----------------------------------------------------
        # Si es ENTRENADOR:
        # - Solo puede ver sus propias clases
        # ----------------------------------------------------
        if user.role == 'ENTRENADOR':
            print("DEBUG: Filtering for ENTRENADOR role")
            queryset = queryset.filter(entrenador=user)

        print(f"DEBUG: Returning queryset with {queryset.count()} items")
        return queryset
    def perform_create(self, serializer):
        print("DEBUG: perform_create called. User:", self.request.user)
        user= self.request.user
        if user.is_staff:
            serializer.save()
        elif user.role == 'ENTRENADOR':

            serializer.save(entrenador= user)
        else:
            raise PermissionError("No tienes permiso nene")

    # ========================================================
    # ENDPOINT PERSONALIZADO: /classes/disponibles/
    # ========================================================
    #
    # detail=False significa:
    # No trabaja con un ID específico.
    #
    # URL resultante:
    # GET /classes/disponibles/
    #
    # Patrón aplicado:
    # ✔ Extension Pattern (extensión del CRUD base)
    #
    @action(detail=False, methods=['get'])
    def disponibles(self, request):

        # Partimos del queryset ya filtrado por rol
        clases = self.get_queryset().filter(
            activa=True,
            horario__gte=timezone.now()
        )

        # Filtramos en memoria usando propiedad tiene_cupo
        #
        # ⚠ Esto puede ser costoso si hay muchas clases.
        # Idealmente debería hacerse en base de datos.
        #
        clases_con_cupo = [
            clase for clase in clases if clase.tiene_cupo
        ]

        serializer = self.get_serializer(
            clases_con_cupo,
            many=True
        )

        return Response(serializer.data)


    # ========================================================
    # ENDPOINT PERSONALIZADO:
    # /classes/{id}/reservas/
    # ========================================================
    #
    # detail=True significa:
    # Necesita un ID específico.
    #
    # POST /classes/5/reservas/
    #
    # Aunque aquí lo estás usando como GET lógico.
    #
    @action(detail=True, methods=['post'])
    def reservas(self, request, pk=None):

        # Obtiene la clase específica
        clase = self.get_object()

        # Accede a relación inversa:
        # clase.reservas → todas las reservas asociadas
        #
        reservas = clase.reservas.filter(
            estado='CONFIRMADA'
        )

        # Import interno para evitar import circular
        from apps.reservations.serializers import ReservationSerializer

        serializer = ReservationSerializer(
            reservas,
            many=True
        )

        return Response(serializer.data)