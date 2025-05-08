from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework import serializers
from rest_framework import viewsets
#from .models import Producto
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager




#Modelo para el usuario

class UsuarioManager(BaseUserManager):
    def create_user(self, correo, password=None, **extra_fields):
        if not correo:
            raise ValueError("El correo es obligatorio")
        correo = self.normalize_email(correo)
        usuario = self.model(correo=correo, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, correo, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        return self.create_user(correo, password, **extra_fields)

class Usuario(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    password = models.CharField(max_length=255)
    telefono = models.CharField(max_length=15, blank=True, null=True)
    es_vendedor = models.BooleanField(default=False)
    direccion = models.TextField(blank=True, null=True)
    correo = models.EmailField(max_length=100, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)

    #is_active = models.BooleanField(default=True)
    #is_staff = models.BooleanField(default=False)
    #is_superuser = models.BooleanField(default=False)

    last_login = None

    USERNAME_FIELD = 'correo'
    REQUIRED_FIELDS = ['nombre', 'apellido']

    objects = UsuarioManager()

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return f'{self.nombre} {self.apellido}'
    
class Producto(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    peso = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    piezas = models.IntegerField(blank=True, null=True)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Relación con la tabla usuarios

    class Meta:
        db_table = 'productos'

    def __str__(self):
        return self.nombre
    

class Pedido(models.Model):
    id_pedido = models.AutoField(primary_key=True)
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE)  # Usuario que realiza el pedido
    fecha_pedido = models.DateTimeField(auto_now_add=True)
    estado_pedido = models.CharField(
        max_length=20,
        choices=[
            ('Preparando', 'Preparando'),
            ('Enviado', 'Enviado'),
            ('Entregado', 'Entregado'),
            ('Cancelado', 'Cancelado')
        ],
        default='Preparando'
    )

    class Meta:
        db_table = 'pedidos'

    def __str__(self):
        return f'Pedido #{self.id_pedido} - Usuario: {self.usuario.nombre}'
    
class VentaPedido(models.Model):
    id = models.AutoField(primary_key=True)
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='productos', default=1)  # Relación con el pedido principal
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)  # Relación con la tabla productos
    cantidad = models.IntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'ventas_pedido'

    def __str__(self):
        return f'Producto: {self.producto.nombre} - Pedido #{self.pedido.id_pedido}'
    
