from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Pedido, Productos, PedidoDetalle, Usuario
from .permissions import IsduenoOrAdmin
from rest_framework.permissions import IsAuthenticated
from .serializers import SerializadorProducto, UsuarioSerializer, SerializadorPedido, PedidoDetalleSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token

# Create your views here.
@api_view(['GET'])
def vistaSegura(request):
    return Response({"message": "This is a secure view"})
#Vista
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Productos.objects.all()
    serializer_class = SerializadorProducto

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all() 
    serializer_class = SerializadorPedido
    permission_classes = [IsAuthenticated] 

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha_pedido')
    serializer_class = SerializadorPedido
    permission_classes = [IsAuthenticated, IsduenoOrAdmin]
    def get_permissions(self):
        if self.request.method in ['POST', 'PUT', 'DELETE']:
            self.permission_classes = [IsAuthenticated, IsduenoOrAdmin]
        return super().get_permissions()

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pedido.objects.all()
        return Pedido.objects.filter(usuario_id=self.request.user)
    
class RegistroView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class PedidoDetalleViewSet(viewsets.ModelViewSet):
    queryset = PedidoDetalle.objects.all()
    serializer_class = PedidoDetalleSerializer
    permission_classes = [IsAuthenticated, IsduenoOrAdmin]

