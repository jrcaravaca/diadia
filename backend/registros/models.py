from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError

class PerfilProfesor(models.Model): 
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil_profesor")
    telefono = models.CharField(max_length=20, blank=True)
    turno = models.CharField(max_length=50, blank=True, help_text="Ej: Mañana, Tarde")

    def __str__(self): 
        return f"Perfil Profesor - {self.usuario.username}"

class PerfilFamiliar(models.Model): 
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name="perfil_familiar")
    telefono = models.CharField(max_length=20)
    direccion = models.CharField(max_length=200, blank=True)
    dni = models.CharField(max_length=15, blank=True)

    def __str__(self): 
        return f"Perfil Familiar - {self.usuario.username}"
class Aula(models.Model): 
    nombre = models.CharField(max_length=50)
    profesor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='aulas_asignadas')

    def __str__(self): 
        return self.nombre

class Alumno(models.Model): 
    nombre = models.CharField(max_length=100)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='alumnos')
    familiares = models.ManyToManyField(User, related_name="hijos", blank=True)
    

    def __str__(self): 
        return self.nombre

class Registro(models.Model): 
    TIPO_CHOICES= [
        ('COMIDA', 'Comida'),
        ('SIESTA', 'Siesta'), 
        ('BAÑO', 'Baño'), 
        ('FOTO', 'Foto'), 
        ('INFO', 'Información General')
    ]
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name='registros')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    descripcion = models.TextField(blank=True)
    foto = models.ImageField(upload_to='fotos_diarias/', blank=True, null=True)
    fecha_hora = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return f"{self.alumno.nombre} - {self.tipo} ({self.fecha_hora.strftime('%H:%M')})"

class Mensaje(models.Model): 
    asunto = models.CharField(max_length=150)
    remitente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mensajes_enviados')
    destinatario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mensajes_recibidos')
    fecha_envio = models.DateTimeField(auto_now_add=True)
    leido = models.BooleanField(default=False )


class PersonaAutorizada(models.Model): 
    alumno = models.ForeignKey(Alumno, on_delete=models.CASCADE, related_name="autorizados")
    nombre_completo = models.CharField(max_length=150)
    dni = models.CharField(max_length=15)
    foto_dni = models.ImageField(upload_to='dnis_autorizados/', blank=True, null=True)

    def clean(self): 
        # Lógica de validación: Limita el máximo de autorizados a 4
        if self.alumno.autorizados.count() >= 4 and not self.pk: 
            raise ValidationError("El sistema solo admite añadir 4 autorizados")

    def __str__(self): 
        return f"{self.nombre_completo} (Autorizado para {self.alumno.nombre})"
    