"""
SSRF Protection & Safe URL Ingestion Validator
Blocks internal IPs, metadata services, and invalid protocols
"""

import ipaddress
import socket
from urllib.parse import urlparse
from app.core.exceptions import ValidationException


def validate_public_url(url_str: str) -> str:
    """
    Validates a URL to ensure it is public, safe, and not pointing to internal network or cloud metadata.
    Throws ValidationException if unsafe.
    """
    if not url_str or not isinstance(url_str, str):
        raise ValidationException("URL must be a non-empty string.")

    parsed = urlparse(url_str)
    if parsed.scheme not in ["http", "https"]:
        raise ValidationException(f"Unsupported protocol '{parsed.scheme}'. Only HTTP and HTTPS are allowed.")

    hostname = parsed.hostname
    if not hostname:
        raise ValidationException("Invalid URL format: missing hostname.")

    # Block common local hostnames
    if hostname.lower() in ["localhost", "127.0.0.1", "0.0.0.0", "::1", "metadata.google.internal"]:
        raise ValidationException("Access to internal hostnames is prohibited (SSRF protection).")

    # Resolve IP address to prevent DNS rebinding to private IP ranges
    try:
        ip_addresses = socket.getaddrinfo(hostname, None)
        for entry in ip_addresses:
            ip_str = entry[4][0]
            ip_obj = ipaddress.ip_address(ip_str)
            
            if (
                ip_obj.is_private
                or ip_obj.is_loopback
                or ip_obj.is_link_local
                or ip_obj.is_multicast
                or ip_obj.is_reserved
            ):
                raise ValidationException(
                    f"Access to private/local IP address ({ip_str}) is prohibited."
                )
    except socket.gaierror:
        raise ValidationException(f"Could not resolve domain '{hostname}'.")
    except ValueError:
        raise ValidationException(f"Invalid IP address format for '{hostname}'.")

    return url_str
