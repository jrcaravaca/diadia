from rest_framework import viewsets
from .models import Alumno, Registro, Aula, PerfilFamiliar, PersonaAutorizada
from .serializers import AlumnoSerializer, RegistroSerializer, AulaSerializer, PerfilFamiliarSerializer, PersonaAutorizadaSerializer, CustomTokenObtainPairSerializer
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .permissions import EsDirectorOSoloLectura, EsDirectorOProfesorParaEscritura

class AlumnoViewSet(viewsets.ModelViewSet): 
    serializer_class = AlumnoSerializer
    permission_classes = [EsDirectorOSoloLectura]

    def get_queryset(self): 
        usuario = self.request.user
        if not usuario.is_authenticated:
            return Alumno.objects.none()
        
        # Filtro por Rol
        if usuario.is_superuser or usuario.groups.filter(name='director').exists():
            queryset = Alumno.objects.all()
        elif usuario.groups.filter(name='profesor').exists(): 
            queryset = Alumno.objects.filter(aula__profesor__usuario=usuario)
        elif usuario.groups.filter(name='familiar').exists(): 
            queryset = Alumno.objects.filter(familiares__usuario=usuario)
        else:
            return Alumno.objects.none()
        
        #Filtro por aula
        aula_id = self.request.query_params.get('aula')
        if aula_id is not None: 
            queryset = queryset.filter(aula_id=aula_id)

        return queryset.distinct()


class RegistroViewSet(viewsets.ModelViewSet): 
    serializer_class = RegistroSerializer
    permission_classes = [EsDirectorOProfesorParaEscritura]

    def get_queryset(self): 
        usuario = self.request.user
        if not usuario.is_authenticated:
            return Registro.objects.none()
        
        # Filtro por Rol
        if usuario.is_superuser or usuario.groups.filter(name='director').exists():
            queryset = Registro.objects.all()
        elif usuario.groups.filter(name='profesor').exists(): 
            queryset = Registro.objects.filter(aula__profesor__usuario=usuario)
        elif usuario.groups.filter(name='familiar').exists(): 
            queryset = Registro.objects.filter(familiares__usuario=usuario)
        else:
            return Registro.objects.none()

        alumno_id = self.request.query_params.get('alumno')
        if alumno_id is not None:
            hoy = timezone.now().date()
            queryset = queryset.filter(
                alumno_id=alumno_id,
                fecha_hora__date=hoy
            )

        return queryset.order_by('-fecha_hora').distinct()


class AulaViewSet(viewsets.ModelViewSet): 
    serializer_class = AulaSerializer
    permission_classes = [EsDirectorOSoloLectura]

    def get_queryset(self): 
        usuario = self.request.user
        if not usuario.is_authenticated:
            return Aula.objects.none()
        
        # Filtro por Rol
        if usuario.is_superuser or usuario.groups.filter(name__iexact='director').exists():
            queryset = Aula.objects.all()
        elif usuario.groups.filter(name__iexact='profesor').exists(): 
            queryset = Aula.objects.filter(profesor__usuario=usuario).distinct()
        elif usuario.groups.filter(name__iexact='familiar').exists(): 
            queryset = Aula.objects.filter(alumnos__familiares__usuario=usuario).distinct()
        else:
            return Aula.objects.none()
        
        return queryset.distinct()

        
class PerfilFamiliarViewSet(viewsets.ModelViewSet): 
    serializer_class = PerfilFamiliarSerializer

    def get_queryset(self): 
        usuario = self.request.user
        if not usuario.is_authenticated:
            return PerfilFamiliar.objects.none()
        
        # Filtro por Rol
        if usuario.is_superuser or usuario.groups.filter(name='director').exists():
            queryset = PerfilFamiliar.objects.all()
        elif usuario.groups.filter(name='profesor').exists(): 
            queryset = PerfilFamiliar.objects.filter(aula__profesor__usuario=usuario)
        elif usuario.groups.filter(name='familiar').exists(): 
            queryset = PerfilFamiliar.objects.filter(familiares__usuario=usuario)
        else:
            return PerfilFamiliar.objects.none()

        return queryset.distinct()


class PersonaAutorizadaViewSet(viewsets.ModelViewSet): 
    serializer_class = PersonaAutorizadaSerializer

    def get_queryset(self): 
        usuario = self.request.user
        if not usuario.is_authenticated:
            return PersonaAutorizada.objects.none()
        
        # Filtro por Rol
        if usuario.is_superuser or usuario.groups.filter(name='director').exists():
            queryset = PersonaAutorizada.objects.all()
        elif usuario.groups.filter(name='profesor').exists(): 
            queryset = PersonaAutorizada.objects.filter(aula__profesor__usuario=usuario)
        elif usuario.groups.filter(name='familiar').exists(): 
            queryset = PersonaAutorizada.objects.filter(familiares__usuario=usuario)
        else:
            return PersonaAutorizada.objects.none()
        
        return queryset.distinct()
        
        
class CustomTokenObtainPairView(TokenObtainPairView): 
    serializer_class = CustomTokenObtainPairSerializer


