from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlumnoViewSet, RegistroViewSet, AulaViewSet

router = DefaultRouter()

router.register(r'alumnos', AlumnoViewSet)
router.register(r'registros', RegistroViewSet)
router.register(r'aulas', AulaViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]

