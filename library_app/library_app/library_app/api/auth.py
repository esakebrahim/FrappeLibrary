import frappe
from frappe import _, throw
from frappe.utils.password import update_password
from frappe.auth import LoginManager
from frappe.exceptions import AuthenticationError, ValidationError
from frappe.utils import nowdate, add_months, add_days
from datetime import datetime, timedelta
from frappe.utils import nowdate


@frappe.whitelist(allow_guest=False)
def change_password(current_password, new_password):
    try:
        user = frappe.session.user

        # Validate current password
        login_manager = LoginManager()
        login_manager.check_password(user, current_password)

        # Update password securely
        update_password(user, new_password)

        # ✅ Return string directly, not wrapped in dict
        return _("Password changed successfully.")

    except AuthenticationError:
        throw(_("❌ Incorrect current password."), title="Authentication Failed")

    except Exception as e:
        throw(_("❌ Failed to change password: ") + str(e))




@frappe.whitelist()
def get_user_roles():
    if not frappe.session.user:
        frappe.throw(_("No user is currently logged in."))

    roles = frappe.get_roles(frappe.session.user)
    return {"roles": roles}
@frappe.whitelist()
def get_all_roles():
    return {
        "roles": frappe.get_all("Role", filters={"disabled": 0}, pluck="name")
    }
@frappe.whitelist()
def get_current_user():
    return {"user": frappe.session.user}


def get_date_filter(time_range):
    today = datetime.today()

    if time_range == "annual":
        return today - timedelta(days=365)
    elif time_range == "semi_annual":
        return today - timedelta(days=182)
    elif time_range == "quarterly":
        return today - timedelta(days=90)
    else:
        return None  # No date filter



@frappe.whitelist()
def get_borrowed_books(time_range=None):
    try:
        filters = {"status": "loaned"}
        # Optional: Add date filter if needed
        # filters["loan_date"] = [">=", frappe.utils.add_days(frappe.utils.nowdate(), -30)]

        borrowed = frappe.get_all(
            "Loan",
            fields=["name", "book", "member", "loan_date", "return_date", "status"],
            filters=filters,
            order_by="loan_date desc"
        )

        return {"message": borrowed}

    except Exception as e:
        frappe.throw(_("❌ Failed to fetch borrowed books: ") + str(e))



@frappe.whitelist()
def get_reserved_books():
    try:
        reserved = frappe.get_all(
            "Reservation",
            fields=["name", "book", "member", "reservation_date", "status"],
            filters={"status": "Pending"},
            order_by="reservation_date desc"
        )

        return {"message": reserved}

    except Exception as e:
        frappe.throw(_("❌ Failed to fetch reserved books: ") + str(e))



@frappe.whitelist(allow_guest=False)
def reserve_book(book_id):
    user_email = frappe.session.user

    # Find the Member doc linked to the logged-in user
    member_doc = frappe.db.get_value("Member", {"user_id": user_email}, "name")

    if not member_doc:
        frappe.throw(f"Could not find Member linked to user {user_email}")

    # Check for existing pending reservation
    existing_reservation = frappe.db.exists({
        "doctype": "Reservation",
        "book": book_id,
        "member": member_doc,
        "status": "Pending"
    })

    if existing_reservation:
        frappe.throw("You already have a pending reservation for this book.")

    # Create reservation
    reservation = frappe.get_doc({
        "doctype": "Reservation",
        "book": book_id,
        "member": member_doc,
        "reservation_date": nowdate(),
        "status": "Pending"
    })

    reservation.insert()
    frappe.db.commit()

    return {"message": "Success", "reservation_id": reservation.name}


@frappe.whitelist()
def get_loaned_books():
    try:
        loans = frappe.get_all(
            "Loan",
            filters={"status": "loaned"},
            fields=["name", "book", "member", "loan_date", "return_date"]
        )

        loaned_books = []
        for loan in loans:
            book_doc = frappe.get_doc("Book", loan.book)
            loaned_books.append({
                "id": book_doc.name,
                "title": book_doc.title,
                "author": book_doc.author,
                "loan_date": loan.loan_date,
                "return_date": loan.return_date,
                "member": loan.member
            })

        return loaned_books

    except Exception as e:
        frappe.throw(_("Failed to fetch loaned books: ") + str(e))
