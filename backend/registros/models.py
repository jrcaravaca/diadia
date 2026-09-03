from django.db import models
from django.contrib.auth.models import User

class Aula(models.Model): 
    nombre = models.CharField(max_length=50)
    profesor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='aulas_asignadas')

    def __str__(self): 
        return self.nombre

class Alumno(models.Model): 
    nombre = models.CharField(max_length=100)
    aula = models.ForeignKey(Aula, on_delete=models.CASCADE, related_name='alumnos')
    familiar = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='hijos')

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
