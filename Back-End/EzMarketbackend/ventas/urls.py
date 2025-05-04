from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import vistaSegura, PedidoViewSet, ProductoViewSet, RegistroView, PedidoDetalleViewSet

# Configurar rutas con ViewSets
# Cada vez que haga un nuevo viewset debo de agregarlo aqui
router = DefaultRouter()
router.register(r'productos', ProductoViewSet)
router.register(r'pedidos', PedidoViewSet)
router.register(r'pedido-detalle', PedidoDetalleViewSet)
#router.register(r'usuarios', RegistroView, basename='usuarios')

# Definir URLs
urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('vista-segura/', vistaSegura, name='vista_segura'),
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

