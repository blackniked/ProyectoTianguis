from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Usuario, Producto, VentaPedido, Pedido
from .permissions import IsduenoOrAdmin
from rest_framework.permissions import IsAuthenticated
from .serializers import UsuarioSerializer, ProductoSerializer, VentaPedidoSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404
from django.db import transaction
from PIL import Image, ImageDraw, ImageFont
import os
from django.urls import reverse
from django.http import FileResponse, Http404, JsonResponse
from .arima_prediction import obtener_datos, predecir_por_producto


# Create your views here.
class RegistroUsuarioView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]  

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]  

    def create(self, request, *args, **kwargs):
        data = request.data

        # Verificar si el producto ya existe por su nombre
        try:
            producto = Producto.objects.get(nombre=data['nombre'])

            # Incrementar el stock del producto existente
            producto.stock += int(data['stock'])
            producto.save()

            return Response({
                "message": "El producto ya existia. Se incremento el stock.",
                "producto": ProductoSerializer(producto).data
            }, status=status.HTTP_200_OK)

        except Producto.DoesNotExist:
            # Si no existe, crear un nuevo producto
            return super().create(request, *args, **kwargs)

def generar_ticket(pedido_id, productos):
    # Crear una imagen en blanco
    ancho = 400
    alto = 200 + len(productos) * 30  # Ajustar el alto según la cantidad de productos
    imagen = Image.new('RGB', (ancho, alto), color='white')

    # Crear un objeto para dibujar en la imagen
    draw = ImageDraw.Draw(imagen)

    # Configurar la fuente (usa una fuente predeterminada del sistema)
    try:
        font = ImageFont.truetype("arial.ttf", size=16)
    except IOError:
        font = ImageFont.load_default()

    # Escribir el encabezado del ticket
    draw.text((10, 10), f"Ticket de Pedido #{pedido_id}", fill="black", font=font)

    # Escribir los productos en el ticket
    y_offset = 50
    total_pedido = 0  # Inicializar el total del pedido
    for producto in productos:
        texto = f"ID: {producto['id']} - Nombre: {producto['nombre']} - Total: ${producto['total']:.2f}"
        draw.text((10, y_offset), texto, fill="black", font=font)
        y_offset += 30
        total_pedido += producto['total']  # Sumar el total del producto al total del pedido

    # Escribir el total del pedido al final del ticket
    draw.text((10, y_offset + 20), f"Total del Pedido: ${total_pedido:.2f}", fill="black", font=font)

    # Guardar la imagen en un archivo
    nombre_archivo = f"ticket_pedido_{pedido_id}.png"
    ruta_archivo = os.path.join("tickets", nombre_archivo)

    # Crear la carpeta "tickets" si no existe
    os.makedirs("tickets", exist_ok=True)

    imagen.save(ruta_archivo)
    return ruta_archivo

class VentaPedidoViewSet(viewsets.ModelViewSet):
        queryset = VentaPedido.objects.all()
        serializer_class = VentaPedidoSerializer
        permission_classes = [IsAuthenticated]

        def create(self, request, *args, **kwargs):
            data = request.data  # Datos enviados desde el frontend
            usuario = request.user

            if not usuario.is_authenticated:
                return Response({"detail": "User not found", "code": "user_not_found"}, status=400)

            # Verificar si se envió una lista de productos
            if not isinstance(data, list):
                return Response({"error": "Se espera una lista de productos."}, status=status.HTTP_400_BAD_REQUEST)

            with transaction.atomic():  # Garantizar que todas las operaciones sean atómicas
                # Crear el pedido principal
                pedido = Pedido.objects.create(usuario_id=usuario)

                ventas = []  # Lista para almacenar las ventas creadas
                productos_ticket = []  # Lista para los datos del ticket
                for item in data:
                    try:
                        # Obtener el producto
                        producto = Producto.objects.get(id_producto=item['producto_id'])

                        # Verificar si hay suficiente stock
                        if producto.stock < item['cantidad']:
                            raise ValueError(f"No hay suficiente stock disponible para el producto {producto.nombre}.")

                        # Reducir el stock del producto
                        producto.stock -= item['cantidad']
                        producto.save()

                        # Calcular el total del producto
                        total_producto = producto.precio * item['cantidad']

                        # Crear la venta asociada al pedido
                        venta = VentaPedido.objects.create(
                            pedido=pedido,
                            producto=producto,
                            cantidad=item['cantidad'],
                            total=total_producto
                        )
                        ventas.append({
                            "producto": producto.nombre,
                            "cantidad": venta.cantidad,
                            "total": total_producto
                        })

                        # Agregar datos del producto al ticket
                        productos_ticket.append({
                            "id": producto.id_producto,
                            "nombre": producto.nombre,
                            "total": total_producto
                        })

                    except Producto.DoesNotExist:
                        return Response({"error": f"El producto con ID {item['producto_id']} no existe."}, status=status.HTTP_400_BAD_REQUEST)
                    except ValueError as e:
                        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

                # Generar el ticket
                ruta_ticket = generar_ticket(pedido.id_pedido, productos_ticket)

                # Crear la URL para descargar el ticket
                ticket_url = request.build_absolute_uri(reverse('descargar_ticket', args=[pedido.id_pedido]))

                # Serializar el pedido y los productos asociados
                pedido_data = {
                    "id_pedido": pedido.id_pedido,
                    "usuario": usuario.id,
                    "fecha_pedido": pedido.fecha_pedido,
                    "estado_pedido": pedido.estado_pedido,
                    "productos": ventas,
                    "ticket_url": ticket_url  # URL para descargar el ticket
                }

            return Response(pedido_data, status=status.HTTP_201_CREATED)
    
def descargar_ticket(request, pedido_id):
    # Ruta del archivo del ticket
    nombre_archivo = f"ticket_pedido_{pedido_id}.png"
    ruta_archivo = os.path.join("tickets", nombre_archivo)

    # Verificar si el archivo existe
    if not os.path.exists(ruta_archivo):
        raise Http404("El ticket no existe.")

    # Servir el archivo como una descarga
    response = FileResponse(open(ruta_archivo, 'rb'), content_type='image/png')
    response['Content-Disposition'] = f'attachment; filename="{nombre_archivo}"'
    return response

class CarritoView(APIView):
    def post(self, request):
        """
        Agregar un producto al carrito.
        """
        data = request.data
        producto = get_object_or_404(Producto, id_producto=data.get('producto_id'))
        usuario = request.user  # Usuario autenticado

        # Crear o actualizar un pedido en ventas_pedido
        pedido, created = VentaPedido.objects.get_or_create(
            producto=producto,
            usuario=usuario,
            estado_pedido='Preparando',  # Estado inicial del pedido
            defaults={
                'cantidad': data.get('cantidad', 1),
                'cantidad_total': data.get('cantidad', 1),
                'total': producto.precio * data.get('cantidad', 1),
            }
        )

        if not created:
            # Si el pedido ya existe, actualiza la cantidad y el total
            pedido.cantidad += data.get('cantidad', 1)
            pedido.cantidad_total = pedido.cantidad
            pedido.total = producto.precio * pedido.cantidad
            pedido.save()

        serializer = VentaPedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request):
        """
        Obtener todos los productos en el carrito del usuario autenticado.
        """
        usuario = request.user
        pedidos = VentaPedido.objects.filter(usuario=usuario, estado_pedido='Preparando')
        serializer = VentaPedidoSerializer(pedidos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        """
        Eliminar un producto del carrito.
        """
        pedido = get_object_or_404(VentaPedido, id=pk, usuario=request.user, estado_pedido='Preparando')
        pedido.delete()
        return Response({"detail": "Producto eliminado del carrito."}, status=status.HTTP_204_NO_CONTENT)
    
class CheckoutView(APIView):
    def post(self, request):
        """
        Finalizar el pedido (checkout).
        """
        usuario = request.user
        pedidos = VentaPedido.objects.filter(usuario=usuario, estado_pedido='Preparando')

        if not pedidos.exists():
            return Response({"detail": "El carrito está vacío."}, status=status.HTTP_400_BAD_REQUEST)

        # Actualizar el estado de los pedidos
        pedidos.update(estado_pedido='Enviado')

        return Response({"detail": "Pedido finalizado con exito."}, status=status.HTTP_200_OK)
    
def ejecutar_prediccion(request):
    # Obtener los datos desde la base de datos
    df = obtener_datos()
    if df is not None:
        # Ejecutar la predicción
        try:
            predecir_por_producto(df)
            return JsonResponse({"message": "Predicción ejecutada correctamente. Revisa las gráficas generadas."}, status=200)
        except Exception as e:
            return JsonResponse({"error": f"Error al ejecutar la predicción: {str(e)}"}, status=500)
    else:
        return JsonResponse({"error": "No se pudo obtener información de ventas."}, status=500)