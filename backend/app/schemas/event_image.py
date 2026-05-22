from pydantic import BaseModel

class EventImageResponse(BaseModel):
    id: int
    event_id: int
    url: str
    is_primary: bool

    class Config:
        from_attributes = True