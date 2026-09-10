from rest_framework import viewsets
from .models import Alumno, Registro
from .serializers import AlumnoSerializer, RegistroSerializer

class AlumnoViewSet(viewsets.ModelViewSet): 
    queryset = Alumno.objects.all()
    serializer_class = AlumnoSerializer

class RegistroViewSet(viewsets.ModelViewSet): 
    queryset = Registro.objects.all().order_by('-fecha.hora')
    serializer_class = RegistroSerializer

