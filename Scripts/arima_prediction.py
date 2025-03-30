import pandas as pd
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt

#simulacion de datos de venta
np.random.seed(42)
dates = pd.date_range(start='2025-01-01', periods=100, freq='D')
ventas = np.random.poisson(lam=20, size=100)
df = pd.DataFrame({'Fecha': dates, 'Ventas': ventas})
df.set_index('Fecha', inplace=True)

#visualizacion de datos
plt.figure(figsize=(10, 5))
plt.plot(df, label='Ventas diarias')
plt.title('Ventas simuladas')
plt.legend()
plt.show()

#aplicacion del modelo ARIMA
modelo = ARIMA(df['Ventas'], order=(5, 1, 2))
resultado = modelo.fit()

#prediccion
predicciones = resultado.predict(start=80, end=110, dynamic=False)

#visualizacion de predicciones
plt.figure(figsize=(10, 5))
plt.plot(df, label='Ventas diarias')
plt.plot(predicciones, label='Predicciones ARIMA', color='red')
plt.title('Predicciones de ventas con ARIMA')
plt.legend()
plt.show()

print(resultado.summary())