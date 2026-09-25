from rest_framework import viewsets
from .models import Alumno, Registro
from .serializers import AlumnoSerializer, RegistroSerializer

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

