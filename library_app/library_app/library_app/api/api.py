import frappe
import random
import time
import string
from frappe.utils import now_datetime, get_datetime

OTP_EXPIRY_SECONDS = 10 * 60  # 10 minutes expiry



@frappe.whitelist(allow_guest=True)
def send_otp(email: str):
    if not frappe.db.exists("User", email):
        frappe.throw("User with this email does not exist")

    # Generate a 6-digit OTP
    otp_code = ''.join(random.choices(string.digits, k=6))

    # Save OTP in a private cache (expires in 5 minutes)
    frappe.cache().set_value(f"otp_{email}", otp_code, expires_in_sec=300)

    # Queue the OTP email
    frappe.sendmail(
        recipients=[email],
        subject="Your OTP Code",
        message=f"Your verification code is: <b>{otp_code}</b>",
        delayed=True
    )

    return {"message": f"OTP sent to {email}"}


@frappe.whitelist(allow_guest=True)
def verify_otp(email: str, code: str):
    cached_otp = frappe.cache().get_value(f"otp_{email}")

    if not cached_otp:
        frappe.throw("OTP has expired or was not sent")

    if str(code) != str(cached_otp):
        frappe.throw("Incorrect OTP")

    # OTP is correct — you can proceed to allow password reset etc.
    frappe.cache().delete_value(f"otp_{email}")  # optional: clear OTP after success

    return {"message": "OTP verified successfully"}


@frappe.whitelist(allow_guest=True)
def reset_password(email, new_password, code):
    # Verify OTP first
    verification = verify_otp(email, code)
    if not verification.get("verified"):
        frappe.throw(verification.get("error", "OTP verification failed"))

    # Change password
    user = frappe.get_doc("User", email)
    user.new_password = new_password
    user.save(ignore_permissions=True)

    # Remove used OTP
    if email in otp_cache:
        del otp_cache[email]

    return {"message": "Password updated successfully"}
