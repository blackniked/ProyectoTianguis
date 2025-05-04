import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from decouple import config
import psycopg2

def obtener_datos():
    try:
        conexion = psycopg2.connect(
            host=config('DB_HOST'),
            port=config('DB_PORT', default='5432'),
            database=config('DB_NAME'),
            user=config('DB_USER'),
            password=config('DB_PASSWORD')
        )
        consulta = """
            SELECT fecha_pedido::date AS fecha, producto_id, SUM(cantidadTotal) as total
            FROM ventas_pedido
            GROUP BY fecha, producto_id
            ORDER BY fecha;
        """
        df = pd.read_sql_query(consulta, conexion)
        conexion.close()
        return df
    except Exception as e:
        print(f"Error al obtener datos: {e}")
        return None

def predecir_por_producto(df):
    df['fecha'] = pd.to_datetime(df['fecha'])
    productos = df['producto_id'].unique()
    predicciones = {}
    historicos = {}

    for prod_id in productos:
        datos = df[df['producto_id'] == prod_id].copy()
        datos = datos.groupby('fecha')['total'].sum().asfreq('D', fill_value=0)

        if len(datos) < 10:
            continue  # para evitar series muy cortas

        try:
            modelo = ARIMA(datos, order=(2, 1, 2))
            resultado = modelo.fit()
            futura_pred = resultado.forecast(steps=7).sum()
            predicciones[prod_id] = futura_pred
            historicos[prod_id] = {
                "reales": datos,
                "predicciones": resultado.forecast(steps=7)
            }
        except:
            continue

    if not predicciones:
        print("No se pudieron generar predicciones validas.")
        return None

    # calcular el producto con mayor demanda estimada
    prod_max = max(predicciones, key=predicciones.get)
    return prod_max, historicos[prod_max]

def graficar_resultado(datos_producto, prod_id):
    reales = datos_producto['reales']
    pred = datos_producto['predicciones']

    plt.figure(figsize=(12,6))
    reales.plot(label='Historico')
    pred.plot(label='Prediccion (7 días)', linestyle='--')
    plt.title(f"Prediccion ARIMA para Producto ID: {prod_id}")
    plt.xlabel('Fecha')
    plt.ylabel('Cantidad Vendida')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

def main():
    df = obtener_datos()
    if df is not None:
        prod_max, datos_producto = predecir_por_producto(df)
        if prod_max:
            print(f"El producto con mayor demanda estimada en la proxima semana es: Producto ID {prod_max}")
            graficar_resultado(datos_producto, prod_max)

if __name__ == '__main__':
    main()
