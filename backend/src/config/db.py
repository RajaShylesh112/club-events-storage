from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Optional: use dnspython to override DNS resolvers for SRV lookups
try:
    import dns.resolver  # type: ignore
except Exception:  # pragma: no cover
    dns = None  # dnspython is provided by pymongo[srv], but keep this safe

import logging
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

_DNS_CONFIGURED = False

def _configure_dns_resolver_if_needed() -> None:
    """
    Optionally override dnspython nameservers/timeouts to avoid local DNS issues
    when resolving mongodb+srv records.

    Env vars:
      - DNS_NAMESERVERS: comma-separated list (e.g. "8.8.8.8,1.1.1.1")
      - DNS_TIMEOUT: per-query timeout seconds (default 5)
      - DNS_LIFETIME: overall resolution lifetime seconds (default 15)
    """
    global _DNS_CONFIGURED
    if _DNS_CONFIGURED:
        return

    if not dns or not hasattr(dns, "resolver"):
        return

    nameservers = os.getenv("DNS_NAMESERVERS", "").strip()
    if not nameservers:
        # If not explicitly configured, do nothing. User can enable by setting env.
        return

    resolver = dns.resolver.Resolver(configure=False)
    resolver.nameservers = [ns.strip() for ns in nameservers.split(",") if ns.strip()]
    try:
        timeout = float(os.getenv("DNS_TIMEOUT", "5"))
    except ValueError:
        timeout = 5.0
    try:
        lifetime = float(os.getenv("DNS_LIFETIME", "15"))
    except ValueError:
        lifetime = 15.0
    resolver.timeout = timeout
    resolver.lifetime = lifetime

    # Set as the default resolver used by dnspython
    dns.resolver.default_resolver = resolver
    _DNS_CONFIGURED = True


def _build_client(uri: str) -> MongoClient:
    server_selection_timeout_ms = int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "20000"))
    connect_timeout_ms = int(os.getenv("MONGO_CONNECT_TIMEOUT_MS", "20000"))
    return MongoClient(
        uri,
        serverSelectionTimeoutMS=server_selection_timeout_ms,
        connectTimeoutMS=connect_timeout_ms,
    )


def get_db_connection():
    db_uri = os.getenv("DB_URI")
    if not db_uri:
        raise ValueError("DB_URI environment variable not set")

    # If using SRV scheme, allow optional DNS override
    if db_uri.startswith("mongodb+srv://"):
        _configure_dns_resolver_if_needed()

    db_name = os.getenv("DB_NAME", "file-system")

    # Try primary URI first
    client = _build_client(db_uri)
    try:
        # Force early server selection (DNS+connect) to fail fast if needed
        client.admin.command("ping")
        return client[db_name]
    except ServerSelectionTimeoutError as e:
        logging.warning("Mongo primary URI server selection failed: %s", e)
        fallback_uri = os.getenv("DB_FALLBACK_URI", "").strip()
        if fallback_uri:
            logging.warning("Attempting fallback Mongo URI (SRV-less/direct hosts)...")
            fb_client = _build_client(fallback_uri)
            try:
                fb_client.admin.command("ping")
                return fb_client[db_name]
            except ServerSelectionTimeoutError as e2:
                logging.error("Fallback Mongo URI also failed: %s", e2)
                raise
        # No fallback configured; re-raise
        raise

# Example usage:
# db = get_db_connection()