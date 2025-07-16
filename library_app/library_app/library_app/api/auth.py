import frappe
from frappe import _

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
