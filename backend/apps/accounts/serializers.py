# ============================================================
# SERIALIZERS PARA LA APP "accounts"
# ============================================================
#
# Responsabilidad:
# Convertir el modelo CustomUser en JSON
# y manejar correctamente la creación y actualización,
# especialmente el manejo seguro de contraseñas.
#
# Patrón aplicado:
# ✔ Data Transfer Object (DTO)
# ✔ Transformer Pattern
#
# Punto crítico:
# Las contraseñas NUNCA deben guardarse en texto plano.
# Django usa hashing interno mediante set_password().
#
# ============================================================

from rest_framework import serializers
from .models import CustomUser
from django.utils.crypto import get_random_string
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password


# ============================================================
# SERIALIZER PRINCIPAL (DETALLE Y CREACIÓN DE USUARIO)
# ============================================================

class UserSerializer(serializers.ModelSerializer):

    # --------------------------------------------------------
    # password
    # --------------------------------------------------------
    # write_only=True significa:
    # - El frontend puede enviarla.
    # - PERO nunca se devuelve en el JSON de respuesta.
    #
    # required=False permite:
    # - Crear usuarios sin obligar contraseña aquí
    #   (aunque depende de tu lógica de negocio).
    #
    password = serializers.CharField(
        write_only=True,
        required=False
    )

    # --------------------------------------------------------
    # role_display
    # --------------------------------------------------------
    # Si en tu modelo tienes algo como:
    #
    # ROLE_CHOICES = (
    #     ('CLIENTE', 'Cliente'),
    #     ('ENTRENADOR', 'Entrenador'),
    # )
    #
    # Django genera automáticamente:
    # get_role_display()
    #
    # Esto devuelve la versión legible del rol.
    #
    role_display = serializers.CharField(
        source='get_role_display',
        read_only=True
    )

    class Meta:

        model = CustomUser

        # Lista explícita de campos que se exponen vía API
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'role_display',
            'telefono',
            'fecha_de_registro',
            'password'
        ]

        # Estos campos no pueden modificarse manualmente
        read_only_fields = [
            'id',
            'fecha_de_registro'
        ]


    # ========================================================
    # CREATE PERSONALIZADO
    # ========================================================
    #
    # ¿Por qué sobrescribimos create()?
    #
    # Porque si no lo hacemos,
    # la contraseña se guardaría como texto plano.
    #
    # set_password() aplica:
    # - Hash seguro
    # - Salting automático
    # - Algoritmo configurado en Django
    #
    # Patrón aplicado:
    # ✔ Factory customization
    #
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        plain_password = password
        
        if not password:
            print("No se proporcionó contraseña, generando una aleatoria.")
            password = get_random_string(length=10)
            
            plain_password = password
        validated_data['password'] = make_password(password)
        user = super().create(validated_data)
        if password:
             subject = 'Bienvenido a GymPro - Tus credenciales de acceso'
             message = f'''
              Hola {user.first_name or user.username},
              Tu cuenta ha sido creada exitosamente en GymPro.
             Tus credenciales de acceso son:
             Usuario: {user.username}
             Contraseña: {plain_password}
             Rol: {user.get_role_display()}
             Inicia sesión en: http://localhost:3000/login
             Por razones de seguridad, te recomendamos cambiar tu contraseña después de tu primer inicio de sesión.
             Saludos,
              El equipo de GymPro
             '''
             send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
        return user 
    


    # ========================================================
    # UPDATE PERSONALIZADO
    # ========================================================
    #
    # Permite actualizar usuario
    # y manejar correctamente cambio de contraseña.
    #
    def update(self, instance, validated_data):
        print("en actualizarrrrrrrrrrrrrr")
        print("VALIDATED DATA EN UPDATE:", validated_data)  # Debugging
        # Extraemos password si existe
        password = validated_data.pop('password', None)

        # Actualizamos todos los demás campos dinámicamente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Si se envía nueva contraseña
        if password:
            instance.set_password(password)  # 🔐 hashing seguro

        instance.save()

        return instance


# ============================================================
# SERIALIZER LIGERO (LISTADO DE USUARIOS)
# ============================================================
#
# Usado típicamente en:
# GET /users/
#
# No permite modificaciones.
#
# Patrón aplicado:
# ✔ View-Specific Serializer
#
# ============================================================

class UserListSerializer(serializers.ModelSerializer):

    role_display = serializers.CharField(
        source='get_role_display',
        read_only=True
    )

    class Meta:

        model = CustomUser

        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'telefono',
            'fecha_de_registro',
            'role_display',
        ]

        # Todos los campos son solo lectura
        # Este serializer es SOLO para listar.
        read_only_fields = fields