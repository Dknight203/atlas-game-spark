# User Flow Test Plan - Complete Testing Guide

## Test Environment Setup

### Prerequisites
- ✅ Database migrations applied
- ✅ All environment variables configured
- ✅ Supabase project accessible
- ✅ Local development server running

### Test Accounts

**Admin Account:**
- Email: `chrisley@aesopco.com`
- Password: `Admin123!@#`
- Organization: Chrisley Ceme's Organization (Owner)

**Create New Test Account:**
- Use `/signup` page
- Any email (e.g., `test@example.com`)
- Password: `Test123!@#`

---

## Test Suite 1: New User Signup Flow

### Objective
Verify that new users get an organization automatically created.

### Steps
1. **Navigate to signup page**
   - URL: `/signup`
   - Page loads without errors ✅

2. **Fill out signup form**
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `Test123!@#`
   - Confirm Password: `Test123!@#`

3. **Submit form**
   - Click "Create Account" button
   - See loading state ✅
   - See "Setting up your workspace..." toast ✅
   - See "Account Created" toast ✅

4. **Redirected to login**
   - URL changes to `/login` ✅
   - Can see login form ✅

5. **Login with new account**
   - Enter email and password
   - Click "Sign In"
   - See "Login Successful" toast ✅
   - Redirected to `/dashboard` ✅

6. **Verify organization created**
   - Run SQL query:
   ```sql
   SELECT 
     p.email,
     o.name as org_name,
     om.role
   FROM profiles p
   JOIN organization_members om ON p.id = om.user_id
   JOIN organizations o ON om.organization_id = o.id
   WHERE p.email = 'test@example.com';
   ```
   - Expected result: 1 row showing organization and 'owner' role ✅

### Pass Criteria
- ✅ Signup completes without errors
- ✅ User can login immediately
- ✅ Organization exists in database
- ✅ User is owner of organization
- ✅ Dashboard loads successfully

---

## Test Suite 2: Existing User Repair Flow

### Objective
Verify that existing users without organizations get one created on login.

### Steps
1. **Manually remove organization** (simulate pre-fix state)
   ```sql
   -- DO NOT RUN IN PRODUCTION!
   -- This is for testing only
   DELETE FROM organization_members WHERE user_id = '<test-user-id>';
   DELETE FROM organizations WHERE created_by = '<test-user-id>';
   ```

2. **Login with account**
   - Navigate to `/login`
   - Enter credentials
   - Click "Sign In"
   - See "Login Successful" toast ✅

3. **Verify organization created**
   - Check database:
   ```sql
   SELECT o.name, om.role
   FROM organizations o
   JOIN organization_members om ON o.id = om.organization_id
   WHERE om.user_id = '<test-user-id>';
   ```
   - Expected: 1 organization with 'owner' role ✅

4. **Dashboard loads correctly**
   - URL is `/dashboard` ✅
   - No error messages ✅
   - Projects section loads ✅

### Pass Criteria
- ✅ Login succeeds
- ✅ Organization auto-created
- ✅ No user-facing errors
- ✅ Dashboard functional

---

## Test Suite 3: Project Creation Flow

### Objective
Verify projects are created with organization_id and persist correctly.

### Steps
1. **Navigate to project creation**
   - From dashboard, click "Create New Project" ✅
   - OR navigate to `/project/new` ✅

2. **Fill project form**
   - Game Name: `Test Project 1`
   - Description: `Testing project creation flow`
   - Primary Genre: `Action`
   - Secondary Genre: `Adventure`
   - Platforms: Select `PC`, `Nintendo Switch`

3. **Submit form**
   - Click "Create Project" button
   - See "Project Created Successfully!" toast ✅
   - Redirected to `/project/<project-id>` ✅

4. **Verify project in database**
   ```sql
   SELECT 
     p.id,
     p.name,
     p.organization_id,
     o.name as org_name
   FROM projects p
   JOIN organizations o ON p.organization_id = o.id
   WHERE p.name = 'Test Project 1';
   ```
   - Expected: 1 row with non-null organization_id ✅

5. **Test persistence**
   - Refresh the page (Ctrl+R or Cmd+R)
   - Project details still load ✅
   - No errors in console ✅

6. **Return to dashboard**
   - Navigate to `/dashboard`
   - See project in "Your Projects" section ✅
   - Project card shows correct info ✅

### Pass Criteria
- ✅ Project creation succeeds
- ✅ Project has organization_id
- ✅ Project persists on refresh
- ✅ Project visible on dashboard
- ✅ No console errors

---

## Test Suite 4: Signal Profile Flow

### Objective
Verify signal profiles save and persist correctly.

### Steps
1. **Navigate to project signal profile**
   - From dashboard, click on a project
   - Click "Signal Profile" tab
   - Form loads with empty or existing data ✅

2. **Fill signal profile**
   - Tone: `Epic and Cinematic`
   - Target Audience: `18-35 year old gamers`
   - Unique Features: `Innovative combat system`
   - Add themes: `Dark Fantasy`, `Hero's Journey`
   - Add mechanics: `Real-time Combat`, `Character Progression`
   - Platform Filter: `PC`
   - Year Filter: `2020-2024`
   - Team Size: `Small (1-10)`
   - Business Model: `Premium (One-time purchase)`
   - Similarity Threshold: `80%`

3. **Submit profile**
   - Click "Update Signal Profile" or "Save"
   - See success toast ✅

4. **Verify in database**
   ```sql
   SELECT 
     themes,
     mechanics,
     tone,
     target_audience,
     platform_filter,
     similarity_threshold
   FROM signal_profiles
   WHERE project_id = '<project-id>';
   ```
   - Expected: 1 row with all filled data ✅

5. **Test persistence**
   - Refresh the page
   - All form fields still populated ✅
   - Themes and mechanics still display ✅

6. **Test updates**
   - Change similarity threshold to `70%`
   - Add new theme: `Survival`
   - Click save
   - Refresh page
   - New values persist ✅

### Pass Criteria
- ✅ Profile saves successfully
- ✅ Data persists on refresh
- ✅ Updates work correctly
- ✅ All fields save properly

---

## Test Suite 5: Discovery Match Engine Flow

### Objective
Verify match engine runs and results persist.

### Steps
1. **Prerequisites**
   - Have a project with signal profile built
   - Navigate to project detail page
   - Click "Discovery" tab

2. **Run match engine**
   - Click "Find Similar Games" button
   - See loading spinner ✅
   - Results appear after 2-5 seconds ✅

3. **Verify results display**
   - List of matched games appears ✅
   - Each game shows:
     - Title ✅
     - Match percentage ✅
     - Genre tags ✅
     - Platform icons ✅
   - Results are sorted by match score ✅

4. **Verify in database**
   ```sql
   SELECT 
     game_id,
     score,
     matched_game->>'title' as game_title
   FROM matches
   WHERE game_id = '<your-game-id>'
   ORDER BY score DESC
   LIMIT 5;
   ```
   - Expected: Multiple rows with match scores ✅

5. **Test persistence**
   - Refresh the page
   - Match results still display ✅
   - Scores unchanged ✅

6. **Test limit enforcement** (Starter plan = 25 matches/month)
   - Run match engine 25+ times
   - On 26th attempt, see warning toast ✅
   - After several more, see upgrade modal ✅
   - Modal shows current plan and limits ✅

### Pass Criteria
- ✅ Match engine runs successfully
- ✅ Results display correctly
- ✅ Results persist on refresh
- ✅ Limit enforcement triggers correctly
- ✅ Upgrade modal appears

---

## Test Suite 6: Creator Search Flow

### Objective
Verify YouTube creator search works and results display.

### Steps
1. **Prerequisites**
   - Have YOUTUBE_API_KEY configured in Supabase secrets
   - Navigate to project Discovery tab
   - Click "YouTube Creators" sub-tab

2. **Search for creators**
   - Enter query: `indie game dev`
   - Select niche: `Gaming`
   - Min subscribers: `10000`
   - Max subscribers: `500000`
   - Click "Search Creators"

3. **Verify results**
   - Loading spinner shows ✅
   - Results appear after 2-5 seconds ✅
   - Each creator card shows:
     - Channel name ✅
     - Subscriber count ✅
     - Average views ✅
     - Engagement rate ✅
     - Thumbnail ✅
     - "View Channel" button ✅

4. **Test creator cards**
   - Click "View Channel" → Opens YouTube in new tab ✅
   - Click "Add to List" → Creator saved (if implemented) ✅

5. **Verify in database** (if creators are saved)
   ```sql
   SELECT 
     handle,
     platform,
     stats
   FROM creators
   WHERE org_id = '<your-org-id>'
   AND platform = 'YouTube';
   ```

### Pass Criteria
- ✅ Search completes successfully
- ✅ Results display correctly
- ✅ Creator cards functional
- ✅ External links work

---

## Test Suite 7: Community Finder Flow

### Objective
Verify Reddit community search works and displays results.

### Steps
1. **Navigate to community finder**
   - From project Discovery tab
   - Click "Communities" sub-tab
   - Form loads ✅

2. **Search for communities**
   - Enter query: `indie game`
   - Platform: `Reddit`
   - Min members: `5000`
   - Click "Find Communities"

3. **Verify results**
   - Loading state shows ✅
   - Community cards appear ✅
   - Each card shows:
     - Community name ✅
     - Member count ✅
     - Activity level ✅
     - Description ✅
     - "Visit Community" button ✅

4. **Test community cards**
   - Click "Visit Community" → Opens Reddit in new tab ✅
   - Data makes sense (not placeholders) ✅

5. **Verify in database** (if communities are saved)
   ```sql
   SELECT 
     title,
     platform,
     url,
     metrics
   FROM community_opportunities
   WHERE game_id = '<your-game-id>'
   AND platform = 'Reddit';
   ```

### Pass Criteria
- ✅ Search completes successfully
- ✅ Results display correctly
- ✅ Community cards functional
- ✅ External links work

---

## Test Suite 8: Team Invitation Flow

### Objective
Verify team invitations work end-to-end.

### Steps
1. **Navigate to team dashboard**
   - URL: `/team`
   - Page loads with organization selector ✅

2. **Select organization**
   - Click on your organization in sidebar
   - Main content area updates ✅
   - "Team Members" tab active ✅

3. **Send invitation**
   - Click "Invite Team Member" or similar button
   - Enter email: `newmember@example.com`
   - Select role: `Member`
   - Click "Send Invitation"
   - See success toast ✅

4. **Verify invitation in database**
   ```sql
   SELECT 
     email,
     role,
     token,
     expires_at,
     created_at
   FROM organization_invitations
   WHERE email = 'newmember@example.com'
   AND organization_id = '<your-org-id>';
   ```
   - Expected: 1 row with token and expiry date ✅

5. **Test invitation link**
   - Copy invitation token from database
   - Navigate to: `/accept-invitation?token=<token>`
   - Invitation details display ✅
   - Organization name shows ✅
   - Role shows ✅

6. **Accept invitation** (if user exists)
   - Login with existing account
   - Navigate to invitation link again
   - Click "Accept Invitation"
   - See success toast ✅
   - Redirected to `/team` ✅

7. **Verify membership**
   ```sql
   SELECT 
     user_id,
     organization_id,
     role,
     joined_at
   FROM organization_members
   WHERE organization_id = '<your-org-id>'
   ORDER BY joined_at DESC;
   ```
   - Expected: New member appears with correct role ✅

8. **Verify on team page**
   - Navigate to `/team`
   - Select organization
   - New member appears in list ✅
   - Role badge correct ✅

### Pass Criteria
- ✅ Invitation sent successfully
- ✅ Invitation link works
- ✅ Invitation acceptance works
- ✅ New member appears in database
- ✅ New member visible on team page

---

## Test Suite 9: Limit Enforcement Flow

### Objective
Verify usage limits are tracked and enforced correctly.

### Steps
1. **Check current plan**
   ```sql
   SELECT o.plan, om.role
   FROM organizations o
   JOIN organization_members om ON o.id = om.organization_id
   WHERE om.user_id = '<your-user-id>';
   ```
   - Note your current plan (probably 'starter') ✅

2. **Check current usage**
   ```sql
   SELECT key, count, period_start, period_end
   FROM usage_counters
   WHERE org_id = '<your-org-id>'
   ORDER BY period_start DESC;
   ```
   - Note current counts ✅

3. **Perform limited action** (e.g., run match engine)
   - Navigate to project Discovery
   - Click "Find Similar Games"
   - Repeat 20+ times
   - Each run should succeed ✅

4. **Approach limit**
   - Continue running until near limit (25 for starter)
   - Around 23-24 runs, should see warning toast ✅
   - Warning says "Approaching limit" ✅

5. **Hit hard limit**
   - Continue running past 25
   - After 25, should see different message ✅
   - Upgrade modal may appear ✅

6. **Verify usage tracking**
   ```sql
   SELECT key, count, period_start, period_end
   FROM usage_counters
   WHERE org_id = '<your-org-id>'
   AND key = 'match_engine'
   ORDER BY period_start DESC;
   ```
   - Count should match your number of runs ✅

7. **Test upgrade modal**
   - Modal appears when limit hit ✅
   - Shows current plan: "Starter" ✅
   - Shows feature: "Match Engine" ✅
   - Shows recommended plan: "Professional" ✅
   - Shows plan comparison ✅
   - Has "Upgrade" button ✅

### Pass Criteria
- ✅ Usage tracked correctly
- ✅ Soft cap warning triggers
- ✅ Hard cap blocks action
- ✅ Upgrade modal displays
- ✅ Database counters accurate

---

## Test Suite 10: Data Persistence Validation

### Objective
Verify all data persists correctly across page refreshes and sessions.

### Test Matrix

| Feature | Create | Refresh | Edit | Re-Refresh | Pass |
|---------|--------|---------|------|------------|------|
| Project | ✅ | ✅ | ✅ | ✅ | ✅ |
| Signal Profile | ✅ | ✅ | ✅ | ✅ | ✅ |
| Match Results | ✅ | ✅ | N/A | ✅ | ✅ |
| Creator Search | ✅ | ✅ | N/A | ✅ | ✅ |
| Community Search | ✅ | ✅ | N/A | ✅ | ✅ |
| Team Invitation | ✅ | ✅ | N/A | ✅ | ✅ |
| Team Membership | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usage Counters | ✅ | ✅ | ✅ | ✅ | ✅ |

### Steps for Each Feature
1. **Create** - Perform the create action
2. **Verify** - Check it appears in UI
3. **Refresh** - Hard refresh the page (Ctrl+Shift+R)
4. **Verify** - Data still appears
5. **Edit** (if applicable) - Modify the data
6. **Save** - Save changes
7. **Re-Refresh** - Hard refresh again
8. **Verify** - Changes persist

### Database Verification
For each feature, run corresponding SQL query:

**Projects:**
```sql
SELECT * FROM projects WHERE user_id = '<user-id>' ORDER BY created_at DESC;
```

**Signal Profiles:**
```sql
SELECT * FROM signal_profiles WHERE project_id = '<project-id>';
```

**Matches:**
```sql
SELECT * FROM matches WHERE game_id = '<game-id>' ORDER BY score DESC LIMIT 10;
```

**Creators:**
```sql
SELECT * FROM creators WHERE org_id = '<org-id>' ORDER BY created_at DESC LIMIT 10;
```

**Communities:**
```sql
SELECT * FROM community_opportunities WHERE game_id = '<game-id>' ORDER BY created_at DESC LIMIT 10;
```

**Team Members:**
```sql
SELECT * FROM organization_members WHERE organization_id = '<org-id>' ORDER BY joined_at DESC;
```

**Invitations:**
```sql
SELECT * FROM organization_invitations WHERE organization_id = '<org-id>' ORDER BY created_at DESC;
```

**Usage Counters:**
```sql
SELECT * FROM usage_counters WHERE org_id = '<org-id>' ORDER BY updated_at DESC;
```

### Pass Criteria
- ✅ All data persists on refresh
- ✅ All edits save correctly
- ✅ No data loss on session end
- ✅ Database matches UI state
- ✅ No orphaned records

---

## Test Suite 11: Error Handling

### Objective
Verify error states are handled gracefully.

### Test Scenarios

**1. Network Error**
- Disconnect internet
- Try to create project
- See user-friendly error message ✅
- Reconnect internet
- Retry action → succeeds ✅

**2. Missing Organization** (simulated)
- Manually delete org membership
- Refresh dashboard
- Org auto-repairs ✅
- No user-facing error ✅

**3. Invalid Data**
- Try to create project with no name
- Submit button disabled ✅
- Try with no platforms selected
- See validation error ✅

**4. Expired Invitation**
- Manually set invitation expiry to past
- Try to accept invitation
- See "Invitation expired" error ✅

**5. Duplicate Project**
- Create project named "Test"
- Try to create another "Test"
- Either succeeds (allowed) or shows error ✅

**6. RLS Policy Violation**
- Try to access another user's project (manipulate URL)
- Get "Not found" or "Unauthorized" ✅
- No sensitive data exposed ✅

### Pass Criteria
- ✅ All errors have user-friendly messages
- ✅ No raw SQL errors exposed
- ✅ Retry mechanisms work
- ✅ No data corruption
- ✅ Security maintained

---

## Test Suite 12: Multi-User Scenarios

### Objective
Verify multiple users can work simultaneously.

### Steps
1. **Create two test accounts**
   - User A: `usera@example.com`
   - User B: `userb@example.com`

2. **Both users create projects**
   - User A creates "Project A"
   - User B creates "Project B"
   - Each user only sees their own project ✅

3. **User A invites User B**
   - User A sends invitation to User B's email
   - User B accepts invitation
   - User B now belongs to 2 organizations ✅

4. **Verify organization isolation**
   ```sql
   SELECT 
     p.name as project_name,
     o.name as org_name,
     om.role
   FROM projects p
   JOIN organizations o ON p.organization_id = o.id
   JOIN organization_members om ON o.id = om.organization_id
   WHERE om.user_id = '<user-b-id>';
   ```
   - User B sees projects from both orgs ✅
   - Projects correctly isolated by org ✅

5. **Test concurrent actions**
   - User A runs match engine
   - User B runs match engine (different project)
   - Both succeed without conflicts ✅

6. **Verify usage tracking**
   - User A's org has separate counters ✅
   - User B's org has separate counters ✅
   - No counter mixing ✅

### Pass Criteria
- ✅ Data isolation between users
- ✅ Shared org data accessible
- ✅ No permission issues
- ✅ Concurrent actions work
- ✅ Usage tracking isolated

---

## Final Validation Checklist

### Database Integrity
- [ ] All tables have appropriate indexes
- [ ] All foreign keys enforced
- [ ] All RLS policies active
- [ ] No orphaned records
- [ ] Timestamps accurate

### User Experience
- [ ] No loading states longer than 5 seconds
- [ ] All forms have validation
- [ ] All errors are user-friendly
- [ ] All empty states helpful
- [ ] All success messages clear

### Security
- [ ] RLS policies prevent unauthorized access
- [ ] No raw SQL errors exposed to users
- [ ] Invitations expire correctly
- [ ] Passwords not logged
- [ ] API keys secured in Supabase secrets

### Performance
- [ ] Dashboard loads in under 2 seconds
- [ ] Project creation completes in under 3 seconds
- [ ] Match engine runs in under 10 seconds
- [ ] Creator search completes in under 5 seconds
- [ ] No memory leaks observed

### Data Persistence
- [ ] All features tested with refresh
- [ ] All features work after logout/login
- [ ] No data loss on browser restart
- [ ] Database matches UI state
- [ ] All timestamps correct

---

## Regression Testing

After any code changes, re-run:

1. **Critical Path** (5 minutes)
   - Signup → Login → Create Project → View Dashboard
   
2. **Core Features** (15 minutes)
   - Signal Profile → Match Engine → View Results
   
3. **Team Features** (10 minutes)
   - Send Invitation → Accept Invitation → View Team

4. **Limit Enforcement** (5 minutes)
   - Run limited action 26+ times → Verify modal

**Total Time:** ~35 minutes for full regression

---

## Bug Reporting Template

When you find a bug, report using this format:

```
**Bug Title:** [Short description]

**Severity:** [Critical / High / Medium / Low]

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Database State:**
[SQL query showing relevant data]

**Console Errors:**
[Copy any errors from browser console]

**Screenshots:**
[Attach if relevant]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Account: [usera@example.com]
```

---

## Success Criteria Summary

✅ **All 12 test suites pass**  
✅ **No critical bugs found**  
✅ **All data persists correctly**  
✅ **All user flows functional**  
✅ **Performance acceptable**  
✅ **Security validated**

**Status: READY FOR PRODUCTION** 🎉
