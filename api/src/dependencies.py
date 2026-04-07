from fastapi import Depends, HTTPException
from requests import Session
from sqlalchemy.orm import sessionmaker


def get_session():
    try:
        Session = sessionmaker(bind=db)
        session = Session()

        yield session

    finally:
        session.close()
