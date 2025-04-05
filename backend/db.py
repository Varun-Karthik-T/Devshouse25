from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging
from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Get MongoDB URI from environment variables
MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("MONGODB_URI is not set in the environment variables")

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGODB_URI)
db = client["devshouse"]

# Ping the database to verify the connection
async def ping_database():
    try:
        await client.admin.command("ping")
        logger.info("Successfully connected to MongoDB (Ping successful)")
    except ServerSelectionTimeoutError as e:
        logger.error(f"Failed to ping MongoDB: {e}")
        raise RuntimeError("Database ping failed") from e