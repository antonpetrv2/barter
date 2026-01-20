# Step 4.2: Seed Data and Testing Guide

## Overview
This guide will help you populate your Supabase database with sample data and test the Barter application with real data.

## Prerequisites
- Supabase project created and configured
- Database schema created (from `database.sql`)
- Test users created in Supabase Auth
- Local environment configured with `.env.local`

## Step-by-Step Guide

### Step 1: Create Test Users in Supabase Auth

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"** button
4. Create 3 test users with these emails (or your own):
   - `user1@test.com` (password: `Test@1234`)
   - `user2@test.com` (password: `Test@1234`)
   - `user3@test.com` (password: `Test@1234`)

5. After creating users, note their **User IDs** (UUIDs)

### Step 2: Update Seed Data with User IDs

1. Open `seed-data.sql` in VS Code
2. Replace these UUIDs with your actual user IDs:
   - `'00000000-0000-0000-0000-000000000001'` → First user's ID
   - `'00000000-0000-0000-0000-000000000002'` → Second user's ID
   - `'00000000-0000-0000-0000-000000000003'` → Third user's ID

**Example:**
```sql
-- Before:
INSERT INTO listings (user_id, ...) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Commodore 64...

-- After (with real UUIDs):
INSERT INTO listings (user_id, ...) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'Commodore 64...
```

### Step 3: Insert Sample Data into Database

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor** (bottom left sidebar)
3. Click **"New Query"**
4. Open the `seed-data.sql` file from the project
5. Copy all the SQL content
6. Paste it into the SQL Editor
7. Click **"Run"** (▶ button)
8. You should see a success message

**Expected output:**
```
PostgreSQL Result: command completed successfully (8 rows affected)
```

### Step 4: Verify Data in Database

1. Go to **Table Editor** in Supabase
2. Select the **listings** table
3. You should see 8 new listings with sample data
4. Verify that:
   - All listings have correct categories
   - user_id values are properly assigned
   - Timestamps are generated correctly

### Step 5: Test the Application

1. Make sure your `.env.local` has correct Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Navigate to **Listings** page (`http://localhost:5173/#/listings`)
   - You should see 8 sample listings loading from Supabase
   - Loading spinner should appear briefly
   - All filters should work (category, search, sort)

4. Click on any listing to view details:
   - Should show full description
   - Seller information should be displayed
   - Related listings in the same category should appear

5. Test authentication:
   - Go to **Auth** page (`http://localhost:5173/#/auth`)
   - Log in with `user1@test.com` / `Test@1234`
   - After login, navigate to **My Listings** page
   - You should see the listings created by that user

### Step 6: Troubleshooting

**Problem: "No listings appear on the Listings page"**
- Solution: Check that `.env.local` has correct Supabase credentials
- Verify data was inserted in the SQL Editor (Step 3)
- Check browser console for errors (F12 > Console tab)

**Problem: "Listings page shows loading spinner forever"**
- Solution: Check Supabase connection
- Verify `VITE_SUPABASE_ANON_KEY` is correct
- Check that RLS policies are set correctly (should allow reading all listings)

**Problem: "Can't log in"**
- Solution: Verify users were created in Supabase Auth
- Check email and password are correct
- Make sure `.env.local` has correct Supabase URL and key

**Problem: "My Listings page shows nothing after login"**
- Solution: The logged-in user might not have any listings
- Create a listing by clicking "New Listing" or use the test user that has listings

### Step 7: Additional Data

If you need more sample data, you can:

1. **Add more listings:**
   ```sql
   INSERT INTO listings (user_id, title, description, category, price, location, condition, year, working, created_at, updated_at)
   VALUES (
       'your-user-id-here',
       'Title of item',
       'Description here',
       'Category name',
       'Price',
       'Location',
       'Condition',
       1990,
       true,
       NOW(),
       NOW()
   );
   ```

2. **Create users programmatically:**
   - You can use Supabase auth methods in the application itself
   - Or use Supabase CLI: `supabase auth users create --email test@test.com`

### Next Steps

Once data is seeded and working:

1. Test all filtering and search functionality
2. Test creating new listings through the application
3. Test authentication flows
4. Test message system (when implemented)
5. Test image uploads (when implemented)

## Cleanup

To remove all sample data and start fresh:

```sql
-- Delete all listings
DELETE FROM listings;

-- Delete all user profiles (optional)
DELETE FROM users WHERE id NOT IN (SELECT id FROM auth.users);
```

Then run the seed-data.sql again to repopulate.
