from django.contrib import admin
from .models import Aula, Alumno, Registro, Mensaje, PerfilFamiliar, PerfilProfesor, PersonaAutorizada

class PersonaAutorizadaInline(admin.StackedInline): 
    model = PersonaAutorizada
    extra = 1 # Muestra un formulario en blanco por defecto
    max_num = 4 # Limite visual a 4 formularios como máximo

class AlumnoAdmin(admin.ModelAdmin): 
    inlines = [PersonaAutorizadaInline]
    filter_horizontal = ('familiares', )

admin.site.register(Aula)
admin.site.register(Alumno, AlumnoAdmin)
admin.site.register(Registro)
admin.site.register(Mensaje)
admin.site.register(PerfilFamiliar)
admin.site.register(PerfilProfesor)
admin.site.register(PersonaAutorizada)