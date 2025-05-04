import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
from decouple import config
import psycopg2
from sqlalchemy import create_engine

# Obtener los datos desde PostgreSQL
def obtener_datos():
    try:
        db_url = f"postgresql://{config('DB_USER')}:{config('DB_PASSWORD')}@{config('DB_HOST')}:{config('DB_PORT')}/{config('DB_NAME')}"
        engine = create_engine(db_url) 
        
        consulta = """
            SELECT 
                vp.fecha_pedido::date AS fecha,
                p.id_producto AS producto_id,
                p.nombre AS producto_nombre,
                SUM(vp."cantidadTotal") AS total
            FROM ventas_pedido vp
            JOIN productos p ON vp.producto_id_id = p.id_producto
            GROUP BY fecha, p.id_producto, p.nombre
            ORDER BY fecha;
        """
        df = pd.read_sql_query(consulta, con=engine)
        return df
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return None

# Prueba Dickey-Fuller para ver si la serie es estacionaria
def prueba_dickey_fuller(serie):
    resultado = adfuller(serie)
    if resultado[1] > 0.05:
        print("Serie no estacionaria (se usara diferenciacion)")
    else:
        print("Serie estacionaria")

# Predicción por cada producto y texto explicativo para mas claridad
def predecir_por_producto(df):
    productos = df['producto_nombre'].unique()
    predicciones = {}

    for nombre in productos:
        datos = df[df['producto_nombre'] == nombre].copy()
        datos['fecha'] = pd.to_datetime(datos['fecha'])
        datos.set_index('fecha', inplace=True)
        datos = datos.asfreq('D').fillna(0)

        if len(datos) < 10:
            continue  # para evitar productos con pocos datos

        prueba_dickey_fuller(datos['total'])

        try:
            modelo = ARIMA(datos['total'], order=(5, 1, 2))
            resultado = modelo.fit()
            forecast = resultado.forecast(steps=7).sum()
            predicciones[nombre] = forecast
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

    modelo = ARIMA(datos['total'], order=(5, 1, 2))
    resultado = modelo.fit()

    predicciones = resultado.forecast(steps=7)
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
