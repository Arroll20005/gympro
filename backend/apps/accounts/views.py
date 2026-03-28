# ============================================================
# VIEWSET PARA LA APP "accounts"
# ============================================================
#
# Responsabilidad:
# Gestionar usuarios del sistema.
#
# Operaciones REST automáticas heredadas de ModelViewSet:
#
# GET     /users/        -> listar usuarios
# GET     /users/{id}/   -> detalle de usuario
# POST    /users/        -> crear usuario
# PUT     /users/{id}/   -> actualizar usuario
# PATCH   /users/{id}/   -> actualización parcial
# DELETE  /users/{id}/   -> eliminar usuario
#
# Patrón aplicado:
# ✔ ModelViewSet (Template Method Pattern)
# ✔ Strategy Pattern (selección dinámica de serializer)
# ✔ Role-Based Access Control (RBAC)
#
# ============================================================

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from .models import CustomUser
from .serializers import UserListSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):

    # --------------------------------------------------------
    # QUERYSET BASE
    # --------------------------------------------------------
    # Solo trabajamos con usuarios activos.
    #
    # Esto evita:
    # - mostrar usuarios eliminados lógicamente
    # - problemas con cuentas desactivadas
    #
    queryset = CustomUser.objects.filter(is_active=True)


    # --------------------------------------------------------
    # PERMISOS
    # --------------------------------------------------------
    # Solo usuarios autenticados pueden acceder
    # a endpoints de usuarios.
    #
    permission_classes = [IsAuthenticated]


    # ========================================================
    # SERIALIZER DINÁMICO
    # ========================================================
    #
    # Tenemos dos serializers:
    #
    # 1️⃣ UserListSerializer
    #     → usado para listar usuarios
    #     → más ligero
    #
    # 2️⃣ UserSerializer
    #     → usado para crear, actualizar y ver detalle
    #
    # Patrón aplicado:
    # ✔ Strategy Pattern
    #
    def get_serializer_class(self):

        # Si estamos en endpoint de lista
        if self.action == 'list':
            return UserListSerializer

        # Para create, retrieve, update, etc.
        return UserSerializer


    # ========================================================
    # QUERYSET PERSONALIZADO
    # ========================================================
    #
    # Controla qué usuarios puede ver cada rol.
    #
    # Flujo:
    # 1. Obtiene usuario autenticado
    # 2. Aplica filtros por query params
    # 3. Aplica restricciones según rol
    #
    def get_queryset(self):

        user = self.request.user

        # Base queryset
        queryset = CustomUser.objects.filter(is_active=True)

        # ----------------------------------------------------
        # FILTRO POR ROLE (QUERY PARAM)
        #
        # Permite:
        # /users/?role=ENTRENADOR
        #
        # Esto filtra usuarios según su rol.
        #
        role = self.request.query_params.get('role')

        if role:
            queryset = queryset.filter(role=role)


        # ----------------------------------------------------
        # RESTRICCIÓN PARA CLIENTES
        #
        # Si el usuario autenticado es CLIENTE,
        # solo puede ver su propio perfil.
        #
        # Esto evita que clientes vean otros usuarios.
        #
        if user.role == 'CLIENTE':
            queryset = queryset.filter(id=user.id)

        # Ordenamos resultados por ID para consistencia
        return queryset.order_by('id')


    # ========================================================
    # ENDPOINT PERSONALIZADO: /users/me/
    # ========================================================
    #
    # Permite que el frontend obtenga fácilmente
    # los datos del usuario autenticado.
    #
    # Ejemplo:
    #
    # GET /users/me/
    #
    # Muy usado para:
    # - mostrar perfil
    # - verificar sesión
    # - cargar datos del usuario al iniciar la app
    #
    # Patrón aplicado:
    # ✔ Custom Endpoint Pattern
    #
    @action(
        detail=False,
        methods=['get'],
        permission_classes=[IsAuthenticated]
    )
    def me(self, request):

        """
        Endpoint para obtener los datos
        del usuario autenticado.
        """

        # request.user ya contiene el usuario autenticado
        # gracias al sistema de autenticación de DRF.
        serializer = UserSerializer(request.user)

        return Response(serializer.data)