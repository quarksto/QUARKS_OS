from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from src.prisma import prisma
from src.utils.security import verify_password, create_access_token, get_password_hash
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class RegisterRequest(BaseModel):
    email: str
    password: str
    name: str

@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    # Find user
    user = await prisma.user.find_unique(where={"email": request.email})
    
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    if not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # Generate Token
    access_token = create_access_token(
        data={"sub": user.email, "id": user.id, "role": user.role}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }
    }

from prisma.enums import Role

@router.post("/register")
async def register(request: RegisterRequest):
    # Check if exists
    existing = await prisma.user.find_unique(where={"email": request.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    hashed = get_password_hash(request.password)
    
    user = await prisma.user.create(
        data={
            "email": request.email,
            "password": hashed,
            "name": request.name,
            "role": Role.INTEGRADOR
        }
    )
    
    return {"id": user.id, "email": user.email, "message": "User created successfully"}

# Dependency (Mock for now, full implementation later)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Verify token logic here or in middleware
    return {"username": "mock_user"}
