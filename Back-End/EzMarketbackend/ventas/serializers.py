from rest_framework import serializers
from .models import Usuario, Producto, VentaPedido, Pedido
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated


#Serializacion
class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Para que la contraseña no se muestre en las respuestas

    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre', 'apellido', 'correo', 'telefono', 'direccion', 
            'fecha_nacimiento', 'es_vendedor', 'password'
        ]

    def create(self, validated_data):
        # Encripta la contraseña antes de guardar el usuario
        user = Usuario.objects.create_user(
            correo=validated_data['correo'],
            password=validated_data['password'],
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],
            telefono=validated_data.get('telefono'),
            direccion=validated_data.get('direccion'),
            fecha_nacimiento=validated_data.get('fecha_nacimiento'),
            es_vendedor=validated_data.get('es_vendedor', False)
        )
        return user
    


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id_producto', 'nombre', 'descripcion', 'precio', 'stock', 
            'peso', 'piezas', 'usuario'
        ]


class VentaPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VentaPedido
        fields = ['id', 'pedido', 'producto', 'cantidad', 'total']

class PedidoSerializer(serializers.ModelSerializer):
    productos = VentaPedidoSerializer(many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ['id_pedido', 'usuario', 'fecha_pedido', 'estado_pedido', 'productos']