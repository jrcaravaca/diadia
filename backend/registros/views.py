from rest_framework import viewsets
from .models import Alumno, Registro, Aula, PerfilFamiliar, PersonaAutorizada
from .serializers import AlumnoSerializer, RegistroSerializer, AulaSerializer, PerfilFamiliarSerializer, PersonaAutorizadaSerializer
from django.utils import timezone

class AlumnoViewSet(viewsets.ModelViewSet): 
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

    def get_queryset(self): 
        queryset = Alumno.objects.all()
        aula_id = self.request.query_params.get('aula')

        if aula_id is not None: 
            queryset = queryset.filter(aula_id=aula_id)

        return queryset

class RegistroViewSet(viewsets.ModelViewSet): 
    queryset = Registro.objects.all().order_by('-fecha_hora')
    serializer_class = RegistroSerializer

    def get_queryset(self): 
        queryset = Registro.objects.all().order_by('-fecha_hora')
        alumno_id = self.request.query_params.get('alumno')

        if alumno_id is not None: 
            hoy = timezone.now().date()
            queryset = queryset.filter(
                alumno_id=alumno_id,
                fecha_hora__date =hoy                
                )

        return queryset

class AulaViewSet(viewsets.ModelViewSet): 
    queryset = Aula.objects.all()
    serializer_class = AulaSerializer


class PerfilFamiliarViewSet(viewsets.ModelViewSet): 
    queryset = PerfilFamiliar.objects.all()
    serializer_class = PerfilFamiliarSerializer

class PersonaAutorizadaViewSet(viewsets.ModelViewSet): 
    queryset = PersonaAutorizada.objects.all()
    serializer_class = PersonaAutorizadaSerializer

