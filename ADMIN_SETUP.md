# Admin Setup Guide

## How to Create an Admin Account

### Step 1: Register a New User
1. Go to the app at http://localhost:5173
2. Click "Вход / Регистрация"
3. Fill in the registration form
4. Click "Регистрирай се"

### Step 2: Make User Admin via Supabase

#### Method A: Using SQL Editor (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard/projects
2. Open your BARTER project
3. Go to **SQL Editor** on the left sidebar
4. Click **New query**
5. Paste this command and replace `your-email@example.com` with your email:

```sql
UPDATE users 
SET role = 'admin', status = 'approved' 
WHERE email = 'your-email@example.com';
```

6. Click **Run**
7. Go back to the app and **refresh** (Ctrl+F5)
8. You should now see **"Админ Панел"** (red link) in the navbar

#### Method B: Using Table Editor

1. In Supabase, go to **Table Editor**
2. Click on the **users** table
3. Find your user row
4. Click on the row to edit it
5. Change:
   - `role` → set to `admin`
   - `status` → set to `approved`
6. Save
7. Refresh the app

### Step 3: Access Admin Panel

- Click the red **"Админ Панел"** link in the navbar
- You should see the dashboard with statistics and user management options

## Admin Panel Features

### Dashboard Statistics
- Total users count
- Pending approvals
- Banned users
- Active listings

### User Management Tabs

#### 1. Pending Approvals
- View users waiting to be approved
- **Approve** - grant access to the platform
- **Reject** - deny access (optional reason)

#### 2. All Users
- View all registered users in a table
- **Ban** - block user from using the platform
- **Make Admin** - grant admin privileges
- **Delete** - permanently remove user account
- **Search** - find users by email or name

#### 3. Banned Users
- View all blocked users
- **Unban** - restore user access
- **Delete** - remove permanently

## Common Admin Tasks

### Approve a New User
1. Go to "Чакащи одобрение" tab
2. Find the user
3. Click green **"Одобри"** button
4. Confirm the action

### Ban a User
1. Go to "Всички потребители" tab
2. Find the user in the table
3. Click the ban button (thumbs down icon)
4. Enter the ban reason (e.g., "违反社区准则")
5. Confirm

### Make Someone Admin
1. Go to "Всички потребители" tab
2. Find the user
3. Click the **shield with check** icon
4. Confirm the action
5. They will see the Admin Panel on next login

## Important Notes

⚠️ **Be careful with:**
- **Delete user** - This removes the user AND all their listings permanently
- **Make admin** - Only trust users with admin privileges
- **Ban user** - The user will not be able to login

✅ **Safe to do:**
- Approve/Reject users - Easy to reverse by approving later
- Unban users - Can restore access anytime

## SQL Commands Reference

### Make user admin
```sql
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### Approve user
```sql
UPDATE users SET status = 'approved' WHERE email = 'user@example.com';
```

### Ban user
```sql
UPDATE users SET is_banned = true, ban_reason = 'Reason here' WHERE email = 'user@example.com';
```

### Unban user
```sql
UPDATE users SET is_banned = false, ban_reason = NULL WHERE email = 'user@example.com';
```

### View all pending users
```sql
SELECT email, full_name, created_at FROM users WHERE status = 'pending';
```

### View all admins
```sql
SELECT email, full_name, role FROM users WHERE role = 'admin';
```

### View all banned users
```sql
SELECT email, full_name, ban_reason, banned_at FROM users WHERE is_banned = true;
```
