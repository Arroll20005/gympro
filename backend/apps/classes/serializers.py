# ============================================================
# SERIALIZERS PARA LA APP "classes"
# ============================================================
#
# ¿Qué es un serializer en Django Rest Framework?
#
# Es el encargado de convertir:
#   - Objetos de base de datos (Modelos Django)
# EN
#   - JSON (para enviarlo al frontend)
#
# Y también hace el proceso inverso:
#   - JSON recibido del frontend
# EN
#   - Objeto válido para guardar en la base de datos
#
# Piensa en el serializer como:
# 👉 Un traductor entre Django (backend) y React (frontend)
#
# Patrón aplicado:
# ✔ Data Transfer Object (DTO)
# ✔ Transformer Pattern
#
# ============================================================

from apps.classes.models import Class
from rest_framework import serializers


# ============================================================
# SERIALIZER COMPLETO (DETALLE DE UNA CLASE)
# ============================================================

class ClassSerializer(serializers.ModelSerializer):

    # --------------------------------------------------------
    # entrenador_name
    # --------------------------------------------------------
    # ¿Qué hace?
    # En vez de enviar solo el ID del entrenador (ej: 3),
    # enviamos su nombre completo usando el método get_full_name().
    #
    # source='entrenador.get_full_name'
    # significa:
    #   - Primero accede al campo ForeignKey "entrenador"
    #   - Luego llama al método get_full_name() del modelo User
    #
    # read_only=True
    # significa:
    #   - Este campo solo se envía al frontend.
    #   - El frontend NO puede modificarlo.
    #
    # Resultado en JSON:
    # {
    #   "entrenador": 3,
    #   "entrenador_name": "Carlos Pérez"
    # }
    #
    # Esto mejora UX en React porque evita hacer otra petición.
    #
    entrenador_name = serializers.CharField(
        source='entrenador.get_full_name',
        read_only=True
    )


    # --------------------------------------------------------
    # reservas_actuales
    # --------------------------------------------------------
    # Campo personalizado que NO está necesariamente
    # como columna directa en la base de datos.
    #
    # Normalmente este valor viene de:
    # - Una propiedad en el modelo
    # - Un annotate() en la vista
    # - O un método @property en Class
    #
    # Se marca como read_only porque:
    # - Es calculado
    # - El usuario no puede enviarlo manualmente
    #
    reservas_actuales = serializers.IntegerField(read_only=True)


    # --------------------------------------------------------
    # tiene_cupo
    # --------------------------------------------------------
    # Booleano que indica si todavía hay espacio disponible.
    #
    # Probablemente su lógica es algo como:
    #   reservas_actuales < capacidad_maxima
    #
    # Este campo permite al frontend:
    # - Deshabilitar botón de "Reservar"
    # - Mostrar mensaje "Clase llena"
    #
    tiene_cupo = serializers.BooleanField(read_only=True)


    # --------------------------------------------------------
    # Meta class
    # --------------------------------------------------------
    # Aquí definimos cómo se comporta el serializer
    #
    class Meta:
        model = Class  # Modelo que estamos serializando

        # Lista explícita de campos que queremos exponer.
        # Esto es buena práctica por seguridad.
        fields = [
            'id',
            'nombre',
            'descripcion',
            'entrenador',         # ForeignKey (solo ID)
            'entrenador_name',    # Campo derivado (nombre real)
            'horario',
            'duracion',
            'capacidad_maxima',
            'reservas_actuales',
            'tiene_cupo',
            'activa',
            'fecha_de_creacion'
        ]

        # Campos que no pueden modificarse desde el frontend
        read_only_fields = [
            'id',
            'fecha_de_creacion'
        ]
    def get_fields(self):
        fields = super().get_fields()

        request = self.context.get('request')

        if request and not request.user.is_staff:
            # entrenador no puede modificar entrenador
            fields['entrenador'].read_only = True

        return fields


# ============================================================
# SERIALIZER LIGERO (PARA LISTAR CLASES)
# ============================================================
#
# ¿Por qué crear otro serializer?
#
# Porque cuando listamos muchas clases:
#   GET /api/classes/
#
# No necesitamos TODA la información.
#
# Beneficios:
# ✔ Más rápido
# ✔ Menos datos enviados
# ✔ Mejor rendimiento
#
# Patrón aplicado:
# ✔ View-Specific Serializer
# ✔ Optimización por contexto
#
# ============================================================

class ClassListSerializer(serializers.ModelSerializer):

    """
    Serializer ligero para listar clases.
    Solo incluye la información necesaria para vistas tipo:
    - Catálogo
    - Lista principal
    - Cards en React
    """

    # Igual que antes: mostrar nombre del entrenador
    entrenador_name = serializers.CharField(
        source='entrenador.get_full_name',
        read_only=True
    )

    # Campos calculados
    reservas_actuales = serializers.IntegerField(read_only=True)
    tiene_cupo = serializers.BooleanField(read_only=True)

    class Meta:
        model = Class

        # Observa que aquí NO incluimos:
        # - descripcion
        # - activa
        # - fecha_de_creacion
        #
        # Porque no son necesarias para una lista rápida.
        #
        fields = [
            'id',
            'nombre',
            'entrenador_name',
            'horario',
            'duracion',
            'capacidad_maxima',
            'reservas_actuales',
            'tiene_cupo'
        ]