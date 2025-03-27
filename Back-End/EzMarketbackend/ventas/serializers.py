from rest_framework import serializers
from .models import Productos, Pedido
from django.contrib.auth.models import User

#Serializacion
class SerializadorProducto(serializers.ModelSerializer):
    class Meta:
        model = Productos
        fields = '__all__'

class SerializadorPedido(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'Nombre', 'Apellido','correo', 'telefono', 'direccion', 'fecha_nacimiento']
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user