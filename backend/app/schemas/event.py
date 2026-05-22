from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    date: datetime
    price: float
    capacity: int
    image_url: Optional[str] = None
    is_recurring: bool = False

class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: str
    date: datetime
    price: float
    capacity: int
    image_url: Optional[str]
    average_rating: float
    organizer_id: int
    created_at: datetime
    is_recurring: bool = False

    class Config:
        from_attributes = True