import frappe
from frappe import _
from frappe.utils import random_string, nowdate
from datetime import datetime
from frappe.model.document import Document
from frappe.core.doctype.communication.email import make
import json

@frappe.whitelist()
def return_book(loan_id: str):
    if not loan_id:
        frappe.throw(_("Loan ID is required"))

    try:
        loan = frappe.get_doc("Loan", loan_id)
    except frappe.DoesNotExistError:
        frappe.throw(_("Loan not found"))

    if loan.status != "loaned":
        frappe.throw(_("Book is already returned or not loaned"))

    # Find earliest pending reservation for this book
    reservations = frappe.get_all(
        "Reservation",
        filters={"book": loan.book, "notified": 0, "status": "Pending"},
        fields=["name", "member", "reservation_date"],
        order_by="reservation_date asc",
        limit_page_length=1,
    )

    # Fetch book details once for email
    book = frappe.get_doc("Book", loan.book)
    book_title = book.title
    book_author = book.author
    book_publish_date = book.publish_date.strftime("%Y-%m-%d") if book.publish_date else "N/A"

    if reservations:
        reservation = reservations[0]
        member_email = frappe.db.get_value("Member", reservation.member, "email")

        if member_email:
            try:
                frappe.sendmail(
                    recipients=[member_email],
                    subject="Book Available for Pickup",
                    message=f"""Dear Member,<br><br>
                        The book <strong>{book_title}</strong> by <em>{book_author}</em> (Published: {book_publish_date}) is now available. 
                        Please visit the library within 24 hours to pick it up.<br><br>
                        Thank you!<br>Library Team""",
                )
                frappe.db.set_value("Reservation", reservation.name, "notified", 1)
                frappe.db.set_value("Reservation", reservation.name, "status", "Fulfilled")
            except Exception as e:
                frappe.log_error(f"Failed to send notification: {str(e)}")
                frappe.throw(_("Failed to send notification email, book return aborted."))

    # Update loan status and return date only after successful notification or if no reservations
    loan.status = "returned"
    loan.return_date = datetime.now().date()
    loan.save(ignore_permissions=True)
    frappe.db.commit()

    loan.add_comment("Comment", _("Book marked as returned by system."))

    return {"message": _("Book returned successfully.")}

'''
@frappe.whitelist()
def return_book(loan_id: str):
    if not loan_id:
        frappe.throw(_("Loan ID is required"))

    try:
        loan = frappe.get_doc("Loan", loan_id)
    except frappe.DoesNotExistError:
        frappe.throw(_("Loan not found"))

    if loan.status != "loaned":
        frappe.throw(_("Book is already returned or not loaned"))

    # Update loan status
    loan.status = "returned"
    loan.return_date = datetime.now().date()
    loan.save(ignore_permissions=True)
    frappe.db.commit()

    # Optional: add a comment to audit log
    loan.add_comment("Comment", _("Book marked as returned by system."))

    # Find the earliest pending reservation
    reservations = frappe.get_all(
        "Reservation",
        filters={"book": loan.book, "notified": 0},
        fields=["name", "member", "creation"],
        order_by="creation asc",
        limit_page_length=1,
    )

    if reservations:
        reservation = reservations[0]
        member_email = frappe.db.get_value("Member", reservation.member, "email")

        if member_email:
            try:
                frappe.sendmail(
                    recipients=[member_email],
                    subject="Book Available for Pickup",
                    message=f"""Dear Member,<br><br>
                        The book <strong>{loan.book_title}</strong> is now available. 
                        Please visit the library within 24 hours.<br><br>Thank you!""",
                )
                frappe.db.set_value("Reservation", reservation.name, "notified", 1)
            except Exception as e:
                frappe.log_error(f"Failed to send notification: {str(e)}")

    return {"message": _("Book returned successfully.")}
'''

@frappe.whitelist()
def get_loans(status=None, limit=50, offset=0):
    """Fetch paginated list of loans, optionally filtered by status"""
    filters = {}
    if status:
        filters["status"] = status

    loans = frappe.db.get_all(
        "Loan",
        filters=filters,
        fields=["name", "book", "member", "loan_date", "return_date", "status"],
        order_by="loan_date desc",
        start=int(offset),
        page_length=int(limit)
    )

    result = []
    for loan in loans:
        book_title = frappe.db.get_value("Book", loan.book, "title") or ""
        member_name = frappe.db.get_value("Member", loan.member, "full_name") or ""
        result.append({
            "name": loan.name,
            "book_title": book_title,
            "member_name": member_name,
            "loan_date": loan.loan_date,
            "return_date": loan.return_date,
            "status": loan.status
        })

    return {"loans": result}





def send_reservation_notification(email, book_id):
    book_title = frappe.db.get_value("Book", book_id, "title")

    subject = "📚 Reserved Book Now Available"
    message = f"""
    Dear user,

    The book titled *{book_title}* you reserved is now available.

    Please visit the library system to loan it as soon as possible.

    Regards,  
    Library Management System
    """

    make(
        recipients=email,
        subject=subject,
        content=message,
        communication_medium="Email",
        send_email=True
    ).insert(ignore_permissions=True)


@frappe.whitelist()
def reserve_book(book: str, member: str):
    # Check for existing reservation
    exists = frappe.db.exists("Reservation", {
        "book": book,
        "member": member
    })
    if exists:
        return {"message": "❌ You have already reserved this book."}

    doc = frappe.new_doc("Reservation")
    doc.book = book
    doc.member = member
    doc.insert()

    return {"message": "✅ Book reserved successfully."}


@frappe.whitelist()
def get_books():
    books = frappe.get_all(
        "Book",
        fields=["name", "title"],
        order_by="modified desc"
    )
    return {"books": books}

# library_app/library_app/api/librarian.py



@frappe.whitelist()
def add_new_book(title, author, isbn, publish_date):
    if not frappe.has_permission("Book", "write"):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    # Check for duplicate ISBN
    existing = frappe.db.exists("Book", {"isbn": isbn})
    if existing:
        frappe.throw(_("A book with this ISBN already exists."))

    book = frappe.new_doc("Book")
    book.title = title
    book.author = author
    book.isbn = isbn
    book.publish_date = publish_date
    book.insert()
    frappe.db.commit()

    return {"message": "✅ Book added successfully."}


@frappe.whitelist()
def get_members():
    members = frappe.get_all(
        "Member",
        fields=["name", "full_name"],
        order_by="modified desc"
    )
    return {"members": members}

@frappe.whitelist()
def create_loan(book, member, loan_date=None, return_date=None, status="loaned"):
    if not loan_date:
        loan_date = nowdate()

    missing_fields = []
    if not book:
        missing_fields.append("book")
    if not member:
        missing_fields.append("member")
    if not return_date:
        missing_fields.append("return_date")

    if missing_fields:
        frappe.throw(_("Missing required field(s): {0}").format(", ".join(missing_fields)))

    # Check if the book is already loaned out and not returned
    existing_loan = frappe.get_all(
        "Loan",
        filters={
            "book": book,
            "status": "Loaned"
        },
        limit=1
    )

    if existing_loan:
        frappe.throw(_("This book is currently loaned out and cannot be loaned again."))

    # Create the loan document
    loan = frappe.get_doc({
        "doctype": "Loan",
        "book": book,
        "member": member,
        "loan_date": loan_date,
        "return_date": return_date,
        "status": status
    })

    loan.insert()
    frappe.db.commit()

    return {"message": "✅ Loan created successfully."}





@frappe.whitelist(allow_guest=False)
def update_member():
    try:
        raw_data = frappe.local.request.get_data(as_text=True)
        data = json.loads(raw_data)

        name = data.get("name")
        if not name:
            frappe.throw(_("Member name is required."))

        member = frappe.get_doc("Member", name)

        # Update fields if provided
        for field in ["full_name", "membership_id", "email", "phone"]:
            if data.get(field) is not None:
                setattr(member, field, data[field])

        member.save()
        frappe.db.commit()

        return {"message": "Member updated successfully."}

    except Exception as e:
        frappe.log_error(e, "update_member error")
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=False)
def delete_member():
    try:
        raw_data = frappe.local.request.get_data(as_text=True)
        data = json.loads(raw_data)

        name = data.get("name")
        if not name:
            frappe.throw(_("Member name is required."))

        if not frappe.has_permission("Member", "delete"):
            frappe.throw(_("Not permitted"), frappe.PermissionError)

        frappe.delete_doc("Member", name)
        frappe.db.commit()

        return {"message": "Member deleted successfully."}

    except Exception as e:
        frappe.log_error(e, "delete_member error")
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=False)
def get_all_members():
    members = frappe.get_all("Member", fields=["name", "full_name", "membership_id", "email", "phone"])
    return {"members": members}




@frappe.whitelist()
def add_new_member(name, membership_id, email, phone):
    password = random_string(10)

    # Create linked Frappe User first
    user = frappe.get_doc({
        "doctype": "User",
        "first_name": name,
        "email": email,
        "send_welcome_email": 1,
        "new_password": password,
        "roles": [{"role": "Member"}]
    })
    user.insert(ignore_permissions=True)

    # Create Member document and fill all required fields
    member = frappe.get_doc({
        "doctype": "Member",
        "full_name": name,
        "membership_id": membership_id,
        "email": email,
        "phone": phone,
        "user_id": user.name,
        "password": password
    })
    member.insert()

    # Send custom welcome email
    message = f"""Welcome {name}!\n\nYour library membership has been created.\n\nLogin with:\nEmail: {email}\nPassword: {password}\n\nPlease change your password after first login."""
    frappe.sendmail(
        recipients=email,
        subject="📚 Welcome to Dilla Library System",
        message=message
    )

    return {"message": "✅ Member added and user account created. Login credentials sent via email."}


@frappe.whitelist()
def update_book(name, title=None, author=None, isbn=None, publish_date=None):
    book = frappe.get_doc("Book", name)
    if title:
        book.title = title
    if author:
        book.author = author
    if isbn:
        book.isbn = isbn
    if publish_date:
        book.publish_date = publish_date
    book.save()
    return {"message": "Book updated successfully."}


@frappe.whitelist()
def delete_book(name):
    if not frappe.has_permission("Book", "delete"):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    frappe.delete_doc("Book", name)
    frappe.db.commit()
    return {"message": "Book deleted"}



@frappe.whitelist()
def get_all_books():
    books = frappe.get_all("Book", fields=["name", "title", "author", "isbn", "publish_date"])
    return {"books": books}




@frappe.whitelist()
def add_new_book():
    title = frappe.form_dict.get("title")
    author = frappe.form_dict.get("author")
    isbn = frappe.form_dict.get("isbn")
    publish_date = frappe.form_dict.get("publish_date")

    if not frappe.has_permission("Book", "write"):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    if not (title and author and isbn and publish_date):
        frappe.throw(_("All fields are required."))

    book = frappe.new_doc("Book")
    book.title = title
    book.author = author
    book.isbn = isbn
    book.publish_date = publish_date
    book.insert()
    frappe.db.commit()

    return {"message": "✅ Book added successfully."}
