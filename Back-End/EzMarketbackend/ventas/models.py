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
    descripcion_casa = models.CharField(max_length=10000, blank=True)

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
    cantidadTotal = models.IntegerField(blank=True, null=True) #columna agregada
    fecha_pedido = models.DateTimeField(auto_now_add=True) #columna agregada
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) #columna agregada
    estadoPedido = models.CharField(max_length=20, choices=[('Preparando', 'Preparando'), ('Enviado', 'Enviado'), ('Entregado', 'Entregado'), 
                                                            ('Cancelado', 'Cancelado')], default='Preparando') #columna agregada
    

    def __str__(self):
        return f'Pedido #{self.id} - {self.usuario_id.username}'
    
    def calcular_total(self):
        total = sum([detalle.subtotal for detalle in self.detalles.all()])
        self.total = total

    #def save(self, *args, **kwargs):
    #    self.calcular_total()
    #    super(Pedido, self).save(*args, **kwargs)

#para manejar cada producto en el pedido
class PedidoDetalle(models.Model):
    pedido = models.ForeignKey(Pedido, related_name='detalles', on_delete=models.CASCADE)
    producto = models.ForeignKey(Productos, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, blank=True) 

    def __str__(self):
        return f'{self.cantidad} x {self.producto.nombre} en Pedido #{self.pedido.id}'
    
    def calcular_subtotal(self):
        self.subtotal = self.producto.precio * self.cantidad

    def save(self, *args, **kwargs):
        self.calcular_subtotal()
        super().save(*args, **kwargs)
        self.pedido.calcular_total()