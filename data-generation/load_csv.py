import pandas as pd
from sqlalchemy import create_engine
import os
from dotenv import load_dotenv
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_USER_SECRET = os.getenv("DB_USER_SECRET")
DB_PASSWORD_SECRET = os.getenv("DB_PASSWORD_SECRET")
DB_NAME_SECRET = os.getenv("DB_NAME_SECRET")
PGADMIN_EMAIL = os.getenv("PGADMIN_EMAIL")
PGADMIN_PASSWORD = os.getenv("PGADMIN_PASSWORD")

engine = create_engine(
    f"postgresql+psycopg2://{DB_USER_SECRET}:{DB_PASSWORD_SECRET}@{DB_HOST}:{DB_PORT}/{DB_NAME_SECRET}"
)

files = {
    "checkin": "data-files/checkin_data.csv",
    "baggage": "data-files/baggage_data.csv",
    "baggagescan": "data-files/baggage_scan_data.csv",
   }

for table_name, file_path in files.items():

    df = pd.read_csv(file_path)

    df.to_sql(
        table_name,
        engine,
        if_exists="append",
        index=False
    )

    print(f"Loaded {len(df)} rows into {table_name}")

engine.dispose()