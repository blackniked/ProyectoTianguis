from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework import serializers
from rest_framework import viewsets
#from .models import Producto


#Modelo para el usuario
class Usuario(AbstractUser):
    id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.EmailField(max_length=100)
    telefono = models.CharField(max_length=50)
    direccion = models.CharField(max_length=200)
    fecha_nacimiento = models.DateField()
    es_vendedor = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
    
#Modelo para los productos
class Productos(models.Model):
    id_producto = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    es_vendedor = models.ForeignKey(Usuario, on_delete=models.CASCADE) #columna ya agregada 20/03/25
    Peso = models.DecimalField(max_digits=10, decimal_places=3) #Columna ya agregada 20/03/25
    pieza = models.IntegerField() #Columna ya agregada 20/03/25

    def __str__(self):
        return self.nombre
    
#Modelo para los pedidos
class Pedido(models.Model):
    id = models.AutoField(primary_key=True)#pendiente analizar bien esto
    usuario_id = models.ForeignKey(Usuario, on_delete=models.CASCADE) #Columna ya agregada 20/03/25
    producto_id = models.ForeignKey(Productos, on_delete=models.CASCADE)#Columna ya agregada 20/03/25
    cantidad = models.IntegerField() #columna ya agregada 20/03/25 y triggers creados
    cantidadTotal = models.IntegerField(blank=True, null=True) #Agregar columna cantidad_total
    fecha_pedido = models.DateTimeField(auto_now_add=True) #Revisar que exista algo similar
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) #Revisar que exista algo similar
    estadoPedido = models.CharField(max_length=20, choices=[('Preparando', 'Preparando'), ('Enviado', 'Enviado'), ('Entregado', 'Entregado'), 
                                                            ('Cancelado', 'Cancelado')], default='Preparando') #Agregar columna estado_pedido
    

    def __str__(self):
        return self.cliente.username + ' - ' + self.producto.nombre
    
def calcular_total(self):
    self.total = self.producto_id.precio * self.cantidad
    self.cantidadTotal = self.cantidad
    self.save()

def save(self, *args, **kwargs):
    self.calcular_total()
    super(Pedido, self).save(*args, **kwargs)