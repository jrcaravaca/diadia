from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Aula, Alumno, Registro, Mensaje, PerfilProfesor, PerfilFamiliar, PersonaAutorizada

class PersonaAutorizadaSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = PersonaAutorizada
        fields = ['id', 'nombre_completo', 'dni', 'foto_dni']

class AlumnoSerializer(serializers.ModelSerializer): 
    autorizados = PersonaAutorizadaSerializer(many=True, read_only=True)

    class Meta:
        model = Alumno
        fields = ['id', 'nombre', 'aula', 'familiares', 'autorizados']

class RegistroSerializer(serializers.ModelSerializer): 
    nombre_alumno = serializers.CharField(source='alumno.nombre', read_only=True)

    class Meta: 
        model = Registro
        fields = ['id', 'alumno', 'nombre_alumno', 'tipo', 'descripción', 'foto', 'fecha_hora']
        