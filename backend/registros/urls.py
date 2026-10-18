from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlumnoViewSet, RegistroViewSet, AulaViewSet, PerfilFamiliarViewSet, PersonaAutorizadaViewSet, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView



router = DefaultRouter()

router.register(r'alumnos', AlumnoViewSet, basename='alumno')
router.register(r'registros', RegistroViewSet, basename='registro')
router.register(r'aulas', AulaViewSet, basename='aula')
router.register(r'familiares', PerfilFamiliarViewSet, basename='perfilfamiliar')
router.register(r'autorizados', PersonaAutorizadaViewSet, basename='personaautorizada')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]

