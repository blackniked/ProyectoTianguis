from decouple import config
import pandas as pd
import psycopg2

def obtener_datos_postgresql():
    # Conexión a la base de datos PostgreSQL
    try:
        conn = psycopg2.connect(
            host=config('DB_HOST'),
            database=config('DB_NAME'),
            port=config('DB_PORT', default='5432'),
            user=config('DB_USER'),
            password=config('DB_PASSWORD')
        )
        print("Conexión exitosa a la base de datos PostgreSQL")
    
        # Consulta SQL para obtener los datos
        query = "SELECT * FROM usuarios;"
    
        # Leer los datos en un DataFrame de pandas
        df = pd.read_sql_query(query, conn)
        print("Datos obtenidos correctamente")
        return df
    
    except Exception as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None
    finally:
        if conn:
            conn.close()
            print("Conexión cerrada")

datos = obtener_datos_postgresql()
if datos is not None:
    print(datos.head()) 