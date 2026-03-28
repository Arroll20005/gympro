# Roles del sistema
# Entrenador:

Descripción: Usuario encargado de impartir clases.

Permisos:

Ver sus clases asignadas
Ver usuarios inscritos en cada clase
Crear nuevas clases
Editar sus propias clases
Eliminar sus propias clases

Restricciones:

Solo puede gestionar clases que le pertenecen
# Administrador (Admin)

Descripción: Usuario con control total del sistema.

Permisos:

Registrar nuevos usuarios
Asignar roles (entrenador o cliente)
Ver todas las clases del sistema
Crear clases
Editar cualquier clase
Eliminar cualquier clase
Asignar un entrenador a una clase

Diferencia clave con Entrenador:

El admin puede gestionar TODAS las clases
El admin puede asignar el entrenador a una clase

# Cliente

Descripción: Usuario que consume los servicios del gimnasio.

Permisos:

Ver clases disponibles
Reservar una clase
Ver sus clases reservadas
Cancelar reservas

Restricciones:


# Reglas de negocio
Un usuario solo puede tener un rol
Un cliente puede reservar múltiples clases
Un cliente no puede reservar la misma clase dos veces
Un entrenador solo puede modificar sus clases
Un admin puede modificar cualquier clase
Una clase debe tener un entrenador asignado
Un cliente puede cancelar una reserva en cualquier momento
🚀 Casos de uso clave
# admin
Crear usuario
Asignar rol
Crear clase y asignar entrenador
Editar o eliminar cualquier clase
# Entrenador
Crear clase
Ver inscritos
Editar o eliminar sus clases
# Cliente
Ver clases disponibles
Reservar clase
Cancelar reserva