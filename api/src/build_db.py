import os

from dotenv import load_dotenv
from sqlalchemy import (
    Boolean,
    Column,
    Enum,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    create_engine,
)
from sqlalchemy.orm import declarative_base

load_dotenv()

DB_HOST = os.getenv("host")
DB_PORT = os.getenv("port")
DB_USER = os.getenv("user")
DB_PASS = os.getenv("pass")
DB_NAME = os.getenv("dbname")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

db = create_engine(DATABASE_URL)
Base = declarative_base()


class Users(Base):
    __tablename__ = "Users"
    id = Column("id", Integer, primary_key=True, autoincrement=True)
    name = Column("name", String)
    email = Column("email", String, nullable=False, unique=True, index=True)
    weight = Column("weight", Numeric(5, 2))
    height = Column("height", Numeric(5, 2))
    workout_intensity = Column("workout_intensity", Integer)
    password = Column("password", String)

    def __init__(self, id, name, email, weight, height, workout_intensity, password):
        self.id = id
        self.name = name
        self.email = email
        self.weight = weight
        self.height = height
        self.workout_intensity = workout_intensity
        self.password = password


Base.metadata.create_all(bind=db)
