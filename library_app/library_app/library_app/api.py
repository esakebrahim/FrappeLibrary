import frappe
from frappe.utils import nowdate

def check_overdues():
    today = nowdate()
    overdue_loans = frappe.get_all(
        "Loan",
        filters={
            "return_date": ["<", today],
            "status": "loaned"
        },
        fields=["name", "member", "book"]
    )

    for loan in overdue_loans:
        member_doc = frappe.get_doc("Member", loan.member)
        book_doc = frappe.get_doc("Book", loan.book)

        if not member_doc.email:
            continue

        frappe.sendmail(
            recipients=[member_doc.email],
            subject="📚 Overdue Book Reminder",
            message=f"""Dear {member_doc.full_name},

The book titled "{book_doc.title}" was due for return on {book_doc.return_date}. Please return it as soon as possible.

Thank you,
Library System"""
        )
