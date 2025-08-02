import requests

BASE = "http://localhost:5000"

def print_result(name, resp):
    print(f"{name}: {resp.status_code} {resp.reason}")
    try:
        print(resp.json())
    except Exception:
        print(resp.text)
    print("-" * 40)

# 1. Register admin
admin_email = "admin@quickdesk.com"
admin_pass = "Admin@12345"
r = requests.post(f"{BASE}/auth/register", json={
    "name": "Admin",
    "email": admin_email,
    "password": admin_pass
})
print_result("Register Admin", r)

# 2. Login as admin
r = requests.post(f"{BASE}/auth/login", json={
    "email": admin_email,
    "password": admin_pass
})
print_result("Login Admin", r)
admin_token = r.json().get("token")

# 3. Promote admin (if not already)
admin_id = r.json().get("user", {}).get("_id")
if admin_id:
    r = requests.put(f"{BASE}/admin/users/{admin_id}/role",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"role": "admin"}
    )
    print_result("Promote to Admin", r)

# 4. Register a normal user
user_email = "user@quickdesk.com"
user_pass = "User@12345"
r = requests.post(f"{BASE}/auth/register", json={
    "name": "User",
    "email": user_email,
    "password": user_pass
})
print_result("Register User", r)

# 5. Login as user
r = requests.post(f"{BASE}/auth/login", json={
    "email": user_email,
    "password": user_pass
})
print_result("Login User", r)
user_token = r.json().get("token")
user_id = r.json().get("user", {}).get("_id")

# 6. User requests role upgrade
r = requests.post(f"{BASE}/auth/request-upgrade",
    headers={"Authorization": f"Bearer {user_token}"}
)
print_result("User Requests Role Upgrade", r)

# 7. Admin views upgrade requests
r = requests.get(f"{BASE}/auth/upgrade-requests",
    headers={"Authorization": f"Bearer {admin_token}"}
)
print_result("Admin Views Upgrade Requests", r)
reqs = r.json().get("requests", [])
if reqs:
    req_id = reqs[0]["_id"]
    # 8. Admin approves upgrade
    r = requests.put(f"{BASE}/auth/approve-upgrade/{req_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
        json={"status": "approved"}
    )
    print_result("Admin Approves Upgrade", r)

# 9. User creates a question
r = requests.post(f"{BASE}/questions",
    headers={"Authorization": f"Bearer {user_token}"},
    json={"title": "How to use QuickDesk?", "description": "Explain features.", "tags": ["help", "intro"]}
)
print_result("User Creates Question", r)
question_id = r.json().get("question", {}).get("_id")

# 10. List questions
r = requests.get(f"{BASE}/questions")
print_result("List Questions", r)

# 11. Upvote question
if question_id:
    r = requests.post(f"{BASE}/questions/{question_id}/vote",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"type": "up"}
    )
    print_result("Upvote Question", r)

# 12. Answer question
if question_id:
    r = requests.post(f"{BASE}/questions/{question_id}/answer",
        headers={"Authorization": f"Bearer {user_token}"},
        json={"text": "You can use QuickDesk for support tickets and Q&A."}
    )
    print_result("Answer Question", r)

# 13. Admin creates a category
r = requests.post(f"{BASE}/admin/categories",
    headers={"Authorization": f"Bearer {admin_token}"},
    json={"name": "General", "description": "General topics"}
)
print_result("Admin Creates Category", r)
cat_id = r.json().get("category", {}).get("_id")

# 14. List categories
r = requests.get(f"{BASE}/admin/categories",
    headers={"Authorization": f"Bearer {admin_token}"}
)
print_result("List Categories", r)

# 15. Admin views users
r = requests.get(f"{BASE}/admin/users",
    headers={"Authorization": f"Bearer {admin_token}"}
)
print_result("Admin Views Users", r)

# 16. Admin views dashboard
r = requests.get(f"{BASE}/dashboard/admin/overview",
    headers={"Authorization": f"Bearer {admin_token}"}
)
print_result("Admin Dashboard Overview", r)

# 17. User views their stats
r = requests.get(f"{BASE}/dashboard/user/stats",
    headers={"Authorization": f"Bearer {user_token}"}
)
print_result("User Dashboard Stats", r)

print("All major endpoints tested!")