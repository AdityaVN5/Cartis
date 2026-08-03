import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from workspace root or backend dir
env_path = Path(__file__).resolve().parent.parent / ".env"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

raw_key = os.getenv("NVIDIA_API_KEY") or os.getenv("OPENAI_API_KEY") or ""
NVIDIA_API_KEY = raw_key.strip(" \"'")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1").strip(" \"'")
MODEL_NAME = os.getenv("MODEL_NAME", "nvidia/nemotron-3-ultra-550b-a55b").strip(" \"'")

DATASET_DIR = os.getenv("DATASET_DIR", str(Path(__file__).resolve().parent.parent / "dataset"))
PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
