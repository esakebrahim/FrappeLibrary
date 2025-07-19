# Copyright (c) 2025, Esak Ebrahim and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.model.document import Document
print("✅ Loan.py loaded")

class Loan(Document):
    def validate(self):
        self.check_if_book_already_loaned()
        self.validate_dates()

    def check_if_book_already_loaned(self):
        if not self.book or self.status.lower() != "loaned":
            return

        # Check for existing active loan of the same book
        existing_loans = frappe.get_all(
            "Loan",
            filters={
                "book": self.book,
                "status": "loaned",
                "name": ["!=", self.name]
            },
            fields=["name"]
        )

        if existing_loans:
            frappe.throw(_("This book is already on loan and cannot be loaned again."))

    def validate_dates(self):
        pass
