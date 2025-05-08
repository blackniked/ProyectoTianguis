from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from .views import UsuarioViewSet, ProductoViewSet, VentaPedidoViewSet, RegistroUsuarioView, CarritoView, CheckoutView, descargar_ticket, ejecutar_prediccion

# Configurar rutas con ViewSets
# Cada vez que haga un nuevo viewset debo de agregarlo aqui
router = DefaultRouter()
#router.register(r'productos', ProductoCreateView, basename='productos')
router.register(r'usuarios', UsuarioViewSet, basename='usuarios')
router.register(r'productos', ProductoViewSet, basename='productos')
router.register(r'ventas-pedido', VentaPedidoViewSet, basename='ventas-pedido')
#router.register(r'registro', RegistroView, basename='registro')  
#router.register(r'login', LoginView, basename='login')
#router.register(r'usuarios', RegistroView, basename='usuarios')

# Definir URLs
urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    #path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('carrito/', CarritoView.as_view(), name='carrito'),
    path('carrito/<int:pk>/', CarritoView.as_view(), name='carrito_detalle'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('descargar-ticket/<int:pedido_id>/', descargar_ticket, name='descargar_ticket'),
    path('api/prediccion/', ejecutar_prediccion, name='ejecutar_prediccion'),
    #path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('vista-segura/', vistaSegura, name='vista_segura'),
    #path('registro/', RegistroView.as_view(), name='registro'),
    #path('login/', LoginView.as_view(), name='login'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('login/', LoginView.as_view(), name='login'),
    #path('productos/crear/', ProductoCreateViewSet.as_view(), name='producto_crear'), # Esta línea es para incluir las rutas de productos   
    #path('productos/', ProductoCreateViewSet.as_view(), name='producto_create'),
]

