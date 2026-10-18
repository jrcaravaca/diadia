from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import (
    Aula, Alumno, Registro, Mensaje, 
    PerfilFamiliar, PerfilProfesor, PersonaAutorizada
)

# Inlines para ver los perfiles directamente dentro de la ficha de Usuario
class PerfilProfesorInline(admin.StackedInline):
    model = PerfilProfesor
    can_delete = False
    verbose_name_plural = 'Perfil de Profesor'

class PerfilFamiliarInline(admin.StackedInline):
    model = PerfilFamiliar
    can_delete = False
    verbose_name_plural = 'Perfil de Familiar'

# Personalización del Admin de Usuarios
class UserAdmin(BaseUserAdmin):
    inlines = [PerfilProfesorInline, PerfilFamiliarInline]
    # filter_horizontal activa el selector visual cómodo de dos columnas para los Grupos/Roles
    filter_horizontal = ('groups', 'user_permissions')

# Inlines y Admin para Alumno 
class PersonaAutorizadaInline(admin.StackedInline): 
    model = PersonaAutorizada
    extra = 1 # Muestra un formulario en blanco por defecto
    max_num = 4 # Límite visual a 4 formularios como máximo

class AlumnoAdmin(admin.ModelAdmin): 
    inlines = [PersonaAutorizadaInline]
    filter_horizontal = ('familiares', )

# Re-registramos el modelo User con nuestras mejoras
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Registro de los modelos de la aplicación
admin.site.register(Aula)
admin.site.register(Alumno, AlumnoAdmin)
admin.site.register(Registro)
admin.site.register(Mensaje)
admin.site.register(PerfilFamiliar)
admin.site.register(PerfilProfesor)
admin.site.register(PersonaAutorizada)