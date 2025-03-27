from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import viewsets
from .models import Pedido, Productos
from .permissions import IsduenoOrAdmin
from rest_framework.permissions import IsAuthenticated
from .serializers import SerializadorProducto, UsuarioSerializer, SerializadorPedido
from rest_framework.views import APIView
from rest_framework import status

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
    queryset = Pedido.objects.all()
    serializer_class = SerializadorPedido
    permission_classes = [IsAuthenticated,IsduenoOrAdmin]

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