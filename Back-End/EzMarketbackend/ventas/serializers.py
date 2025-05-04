from rest_framework import serializers
from .models import Productos, Pedido, PedidoDetalle, Usuario
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

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
        validated_data['password'] = make_password(validated_data['password'])
        return Usuario.objects.create(**validated_data)
    
class PedidoDetalleSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.ReadOnlyField(source='producto.nombre')

    class Meta:
        model = PedidoDetalle
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'subtotal']


class PedidoSerializer(serializers.ModelSerializer):
    detalles = PedidoDetalleSerializer(many=True)
    usuario_nombre = serializers.ReadOnlyField(source='usuario_id.username')

    class Meta:
        model = Pedido
        fields = ['id', 'usuario_id', 'usuario_nombre', 'fecha_pedido', 'total', 'estadoPedido', 'detalles']

    def create(self, validated_data):
        detalles_data = validated_data.pop('detalles', [])
        pedido = Pedido.objects.create(**validated_data)
        for detalle_data in detalles_data:
            PedidoDetalle.objects.create(pedido=pedido, **detalle_data)
        pedido.calcular_total()
        return pedido

    def update(self, instance, validated_data):
        detalles_data = validated_data.pop('detalles', [])

    # Actualizar campos básicos
        instance.estadoPedido = validated_data.get('estadoPedido', instance.estadoPedido)
        instance.save()

    # Si hay detalles nuevos, reemplazar los existentes
        if detalles_data:
            instance.detalles.all().delete()
            for detalle_data in detalles_data:
                PedidoDetalle.objects.create(pedido=instance, **detalle_data)

        # Solo calcular el total si se han modificado los detalles
            instance.calcular_total()
            instance.save()

        return instance