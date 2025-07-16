import frappe
from frappe import _
from frappe.exceptions import ValidationError



@frappe.whitelist()
def update_user_roles(user: str, roles: list[str]):
    if not frappe.has_permission("User", "write"):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    # Prevent removing admin from self
    if user == frappe.session.user and "Administrator" not in roles:
        frappe.throw(_("You cannot remove the Administrator role from yourself."))

    current_roles = [r.role for r in frappe.get_all("Has Role", filters={"parent": user}, fields=["role"])]

    # Remove roles not in the new list
    for role in current_roles:
        if role not in roles:
            frappe.db.delete("Has Role", {"parent": user, "role": role})

    # Add new roles
    for role in roles:
        if role not in current_roles:
            doc = frappe.get_doc("User", user)
            doc.append("roles", {"role": role})
            doc.save(ignore_permissions=True)

    return {"message": "✅ Roles updated successfully."}







@frappe.whitelist()
def get_all_users():
    users = frappe.get_all(
        "User",
        fields=["name", "email", "full_name", "enabled", "last_login"],
        filters={"user_type": "System User"}
    )
    return {"users": users}

@frappe.whitelist()
def get_all_books():
    books = frappe.get_all("Book", fields=["name", "title", "author", "isbn", "publish_date"])
    return {"books": books}



@frappe.whitelist()
def get_all_roles_and_user_roles(user: str):
    if not frappe.has_permission("User", user, "read"):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    all_roles = frappe.get_all("Role", pluck="name")
    user_doc = frappe.get_doc("User", user)
    assigned_roles = [r.role for r in user_doc.roles]
    
    return {
        "all_roles": all_roles,
        "assigned_roles": assigned_roles
    }





@frappe.whitelist()
def change_user_role(user: str, new_role: str):
    # ✅ Only allow if logged-in user is an Administrator
    if "Administrator" not in frappe.get_roles(frappe.session.user):
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    if not frappe.db.exists("User", user):
        frappe.throw(_("User not found"))

    # ✅ Get existing roles and avoid adding duplicates
    current_roles = frappe.get_roles(user)
    if new_role not in current_roles:
        frappe.add_role(user=user, role=new_role)
        return {"message": f"✅ Role '{new_role}' has been added to user {user}"}
    else:
        return {"message": f"ℹ️ User {user} already has role '{new_role}'"}




@frappe.whitelist()
def assign_role(user: str, new_role: str):
    if not frappe.session.user == "Administrator":
        frappe.throw(_("Not permitted"), frappe.PermissionError)

    if not frappe.db.exists("User", user):
        frappe.throw(_("User not found"))

    # Check if role already assigned
    if frappe.db.exists("Has Role", {"parent": user, "role": new_role}):
        return {"message": f"{user} already has the role {new_role}"}

    # Assign the new role without removing existing ones
    frappe.add_role(user, new_role)

    return {"message": f"✅ Role '{new_role}' added to {user}"}
