from django.contrib.auth import base_user
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
        fields = ['id', 'alumno', 'nombre_alumno', 'tipo', 'descripcion', 'foto', 'fecha_hora']
        

class AulaSerializer(serializers.ModelSerializer): 

    class Meta: 
        model = Aula
        fields = ['id', 'nombre', 'profesor']


class PerfilFamiliarSerializer(serializers.ModelSerializer): 
    username = serializers.CharField(source='usuario.username', read_only=True)
    email = serializers.CharField(source='usuario.email', read_only=True)

    class Meta:
        model = PerfilFamiliar
        fields = ['id', 'username', 'email', 'dni', 'telefono']

