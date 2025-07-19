# library_app/library_app/api/member.py
import frappe
from frappe import _

@frappe.whitelist()
def get_my_reservations():
    user = frappe.session.user
    member = frappe.db.get_value("Member", {"user_id": user}, "name")
    if not member:
        frappe.throw(_("No Member linked to current user"))

    reservations = frappe.get_all(
        "Reservation",
        filters={"member": member},
        fields=["name", "book", "reservation_date", "status"],
        order_by="reservation_date asc"
    )

    for r in reservations:
        r["book_title"] = frappe.db.get_value("Book", r.book, "title") or "Unknown"

    return {"reservations": reservations}





@frappe.whitelist()
def create_reservation(book: str):
    user = frappe.session.user
    member = frappe.db.get_value("Member", {"user_id": user}, "name")
    if not member:
        frappe.throw(_("No Member linked to current user"))

    # Check if book is currently loaned (you can customize this logic)
    loaned = frappe.db.exists({
        "doctype": "Loan",
        "book": book,
        "status": "loaned"
    })
    if not loaned:
        frappe.throw(_("Book is currently available and cannot be reserved."))

    # Prevent duplicate reservation by this member on same book
    existing = frappe.db.exists({
        "doctype": "Reservation",
        "book": book,
        "member": member,
        "status": "Pending"
    })
    if existing:
        frappe.throw(_("You already have a pending reservation for this book."))

    reservation = frappe.get_doc({
        "doctype": "Reservation",
        "book": book,
        "member": member,
        "reservation_date": frappe.utils.now_datetime(),
        "status": "Pending"
    })
    reservation.insert()
    frappe.db.commit()

    return {"message": "Reservation created successfully."}


@frappe.whitelist()
def get_my_loans():
    # Get current logged-in user
    user = frappe.session.user
    
    # Get the member linked to this user
    member = frappe.db.get_value("Member", {"user_id": user}, "name")
    if not member:
        frappe.throw(_("No Member linked to current user"))

    loans = frappe.get_all(
        "Loan",
        filters={
            "member": member,
            "status": ["in", ["Loaned", "Overdue"]]  # only active loans
        },
        fields=["name", "book", "loan_date", "return_date", "status"]
    )

    # Enrich loans with book title
    for loan in loans:
        loan["book_title"] = frappe.db.get_value("Book", loan.book, "title") or "Unknown"

    return {"loans": loans}

@frappe.whitelist()
def get_loaned_books():
    loans = frappe.get_all(
        "Loan",
        filters={"status": "Loaned"},
        fields=["book"],
        distinct=True
    )
    books = []
    for loan in loans:
        title = frappe.db.get_value("Book", loan.book, "title")
        books.append({"name": loan.book, "title": title})
    return {"books": books}

