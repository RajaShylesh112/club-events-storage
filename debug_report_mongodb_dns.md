# 🔍 Debug Report: MongoDB Atlas DNS Resolution Timeout

## 1. **Context**
- **Environment**: Python FastAPI backend application (Windows 11)
- **Framework**: FastAPI with MongoDB Atlas integration
- **Database**: MongoDB Atlas cluster (`cluster0.byvaq2y.mongodb.net`)
- **Issue**: DNS resolution timeout when trying to connect to MongoDB Atlas

## 2. **Expected vs Actual**
- **Expected**: DNS resolution of MongoDB Atlas cluster hostname succeeds within timeout period
- **Actual**: DNS resolution times out after 20 seconds with multiple DNS server failures

## 3. **Steps to Reproduce**
1. Start FastAPI server with `python -m uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload`
2. Make API call to `/auth/password-login` endpoint
3. DNS resolution fails during MongoDB client initialization

## 4. **Logs / Error Output**
```
dns.resolver.LifetimeTimeout: The resolution lifetime expired after 20.012 seconds: Server Do53:10.1.95.200@53 answered The DNS operation timed out.; Server Do53:10.1.10.253@53 answered The DNS operation timed out.; Server Do53:10.1.10.254@53 answered The DNS operation timed out.; Server Do53:10.1.94.200@53 answered The DNS operation timed out.; Server Do53:10.1.95.200@53 answered The DNS operation timed out.; Server Do53:10.1.10.253@53 answered The DNS operation timed out.; Server Do53:10.1.10.254@53 answered The DNS operation timed out.; Server Do53:10.1.94.200@53 answered The DNS operation timed out.; Server Do53:10.1.95.200@53 answered The DNS operation timed out.; Server Do53:10.1.10.253@53 answered The DNS operation timed out.
```

## 5. **Hypothesis / Notes**
- **Root Cause**: DNS resolution failure for MongoDB Atlas SRV records
- **Error Type**: `dns.resolver.LifetimeTimeout` - DNS query timeout
- **Network Issue**: All local DNS servers (10.1.x.x) are timing out
- **Connection String**: `mongodb+srv://admin_raja:sC4UxKYdp1p2rBoz@cluster0.byvaq2y.mongodb.net/club-events-storage`

### **Analysis of Current Configuration:**
Looking at the `backend/src/config/` directory structure:

**✅ Database Configuration (`db.py`):**
- Uses environment variable `DB_URI` for connection string
- Falls back to `DB_NAME=file-system` if not specified
- Properly loads environment variables with `load_dotenv()`
- Now includes optional DNS override via `DNS_NAMESERVERS` and custom MongoClient timeouts

**✅ JWT Configuration (`jwt_config.py`):**
- Uses `JWT_SECRET` from environment variables
- Has proper token creation and verification functions
- Includes backward compatibility functions

**⚠️ Storage Configuration (`storage.py`):**
- Contains placeholder values that need to be configured
- Not currently affecting the DNS issue

### **Possible Causes:**
1. **Network/DNS Issues**: Local network DNS servers are not responding
2. **Firewall/Security**: Windows firewall or antivirus blocking DNS queries
3. **MongoDB Atlas Status**: Cluster may be paused or experiencing issues
4. **VPN/Proxy**: Network configuration interfering with DNS resolution
5. **IPv6 Issues**: DNS resolution problems with IPv6 connectivity

### **Immediate Solutions:**

**Option 1: Force public DNS for SRV lookups and increase timeouts (recommended)**
Update `backend/.env` with:
```
# Use public DNS resolvers for SRV
DNS_NAMESERVERS=8.8.8.8,1.1.1.1
DNS_TIMEOUT=5
DNS_LIFETIME=15

# Increase MongoClient timeouts (ms)
MONGO_SERVER_SELECTION_TIMEOUT_MS=30000
MONGO_CONNECT_TIMEOUT_MS=30000
```
Restart the backend and test.

**Option 2: Use Direct Connection String (Bypass SRV)**
Update `backend/.env`:
```
DB_URI=mongodb://cluster0-shard-00-00.byvaq2y.mongodb.net:27017,cluster0-shard-00-01.byvaq2y.mongodb.net:27017,cluster0-shard-00-02.byvaq2y.mongodb.net:27017/club-events-storage?ssl=true&replicaSet=atlas-xxxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```
(Note: replace hosts/replicaSet with actual values from Atlas “Connect > Drivers > SRV-less string”.)

**Option 3: Use Local MongoDB for Development**
```
DB_URI=mongodb://localhost:27017/club-events-storage
```

**Option 4: Check MongoDB Atlas Cluster Status**
- Log into MongoDB Atlas dashboard
- Verify cluster is not paused
- Check if IP address is whitelisted
- Verify credentials are correct

## 6. **Verification Steps**
1. Set the env variables from Option 1
2. Restart backend: `python -m uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload`
3. Hit `/auth/password-login` and watch logs for successful server selection

## 7. **If Issues Persist**
- Share the traceback after these changes
- Try Option 2 (SRV-less) to fully bypass DNS SRV lookups
- Confirm no VPN/Proxy is intercepting UDP/53