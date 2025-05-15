import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
from decouple import config
import psycopg2
from sqlalchemy import create_engine
from pmdarima import auto_arima
from datetime import datetime, timedelta

# Obtener los datos desde PostgreSQL
def obtener_datos():
    try:
        db_url = f"postgresql://{config('DB_USER')}:{config('DB_PASSWORD')}@{config('DB_HOST')}:{config('DB_PORT')}/{config('DB_NAME')}"
        engine = create_engine(db_url) 
        
        consulta = """
             SELECT 
    ped.fecha_pedido::date AS fecha,
    prod.id_producto AS producto_id,
    prod.nombre AS producto_nombre,
    SUM(vp.cantidad) AS total,
    COUNT(*) AS cantidad_ventas
FROM ventas_pedido vp
JOIN productos prod ON vp.producto_id = prod.id_producto
JOIN pedidos ped ON vp.pedido_id = ped.id_pedido
GROUP BY fecha, prod.id_producto, prod.nombre
ORDER BY fecha;
        """
        df = pd.read_sql_query(consulta, con=engine)
        print("Datos obtenidos desde la base de datos:")
        print(df)  # Muestra las primeras filas del DataFrame
        return df
    except Exception as e:
        print(f"Error al obtener datos de la base de datos: {e}")
        return None

# Prueba Dickey-Fuller para ver si la serie es estacionaria
def prueba_dickey_fuller(serie):
    resultado = adfuller(serie)
    if resultado[1] > 0.05:
        print("Serie no estacionaria (se usara diferenciacion)")
        return False
    else:
        print("Serie estacionaria")
        return True

# Predicción por cada producto y texto explicativo para mas claridad
def predecir_por_producto(df):
    productos = df['producto_nombre'].unique()
    predicciones = {}

    for nombre in productos:
        datos = df[df['producto_nombre'] == nombre].copy()
        datos['fecha'] = pd.to_datetime(datos['fecha'])
        datos.set_index('fecha', inplace=True)
        datos = datos.asfreq('D').fillna(0)

        if len(datos) < 3:
            print(f"Producto {nombre} tiene pocos datos para predecir.")
            continue  # Evitar productos con pocos datos

        if datos['total'].nunique() == 1:
            print(f"Producto {nombre} tiene datos constantes, no se puede modelar.")
            continue  # Evitar errores con datos sin variación

        if not prueba_dickey_fuller(datos['total']):
            datos['total'] = datos['total'].diff().dropna()


        try:
            modelo = auto_arima(datos['total'], seasonal=False, stepwise=True, suppress_warnings=True)
            #resultado = modelo.fit(datos['total'])
            forecast = modelo.predict(n_periods=7)
            predicciones[nombre] = forecast.sum()
        except Exception as e:
            print(f"Error al predecir {nombre}: {e}")

    if not predicciones:
        print("No se pudo hacer prediccion con ningun producto.")
        return

    prod_max = max(predicciones, key=predicciones.get)
    print(f"El producto con mayor demanda estimada en la proxima semana es: {prod_max}")
    mostrar_grafica(df, prod_max)

#grafica para el producto con mayor prediccion
def mostrar_grafica(df, nombre_producto):
    datos = df[df['producto_nombre'] == nombre_producto].copy()
    datos['fecha'] = pd.to_datetime(datos['fecha'])
    datos.set_index('fecha', inplace=True)
    datos = datos.asfreq('D').fillna(0)

    modelo = auto_arima(datos['total'], seasonal=False, stepwise=True, suppress_warnings=True)
    predicciones = modelo.predict(n_periods=7)
    fechas_futuras = pd.date_range(start=datos.index[-1] + pd.Timedelta(days=1), periods=7)

    plt.figure(figsize=(12, 6))
    plt.plot(datos['total'], label='Ventas historicas')
    plt.plot(fechas_futuras, predicciones, label='Prediccion proxima semana', linestyle='--')
    plt.title(f"Prediccion ARIMA para: {nombre_producto}")
    plt.xlabel("Fecha")
    plt.ylabel("Ventas")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    fecha_actual = datetime.now().strftime("%d-%m-%Y")
    plt.savefig(f"prediccion_{nombre_producto}_{fecha_actual}.png")
    plt.show()

#Ejecución principal
def main():
    df = obtener_datos()
    if df is not None:
        predecir_por_producto(df)
    else:
        print("No se pudo obtener informacion de ventas.")

if __name__ == '__main__':
    main()
