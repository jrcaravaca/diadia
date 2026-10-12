from django.contrib.auth import base_user
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Aula, Alumno, Registro, Mensaje, PerfilProfesor, PerfilFamiliar, PersonaAutorizada

class PersonaAutorizadaSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = PersonaAutorizada
        fields = ['id', 'alumno', 'nombre_completo', 'dni', 'foto_dni']

    def validate(self, data): 
        alumno = data.get('alumno')

        if alumno and alumno.autorizados.count() >= 4:
            raise serializers.ValidationError("detail","El sistema solo admite añadir 4 personas autorizadas")
        return data

    def get_foto_dni(self, obj):
        request = self.context.get('request')
        if obj.foto_dni and  hasattr(obj.foto_dni, 'url'):
            if request is not None:
                return request.build_absolute_uri(obj.foto_dni.url)
            return obj.foto_dni.url
        return None

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


