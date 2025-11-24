# End-to-End Testing Guide - Disaster Management System V2

## 🎯 Testing Objectives

This guide provides step-by-step instructions for testing all system features to ensure production readiness.

## 📋 Pre-Testing Checklist

- [ ] All Docker containers running and healthy
- [ ] Database seeded with test data (users, teams, requests)
- [ ] Frontend accessible at http://localhost:4200
- [ ] Backend API accessible at http://localhost:8080
- [ ] Browser notifications enabled

## 🔍 Test Scenarios

### Test 1: Victim Emergency Request Journey (No Login Required)

**Objective**: Test emergency request creation without user authentication

**Steps**:
1. Open http://localhost:4200
2. Click "Emergency Request" or navigate to `/request`
3. Fill out the form:
   - Name: `John Doe`
   - Phone: `555-123-4567`
   - Location: `123 Main Street, Downtown` (This will be the password)
   - Select at least one emergency type (Fire/Medical/Crime)
   - Add description: `Urgent: Building fire on 3rd floor`
4. Click "Submit Request"

**Expected Results**:
- ✅ Form validation shows errors for invalid/empty fields
- ✅ Submit button disabled until form valid
- ✅ Success message appears
- ✅ Auto-user creation (username: `JohnDoe`, password: `123 Main Street, Downtown`)
- ✅ Password encrypted with BCrypt in database
- ✅ Request visible in admin dashboard immediately (WebSocket notification)
- ✅ Browser notification appears for admin users

**Backend Verification**:
```sql
SELECT * FROM users WHERE username = 'JohnDoe';
-- Verify password starts with $2a$ (BCrypt hash)

SELECT * FROM emergency_requests WHERE victim_name = 'John Doe';
-- Verify status = 'PENDING'
```

**Console Checks**:
- Backend: `Emergency request created with ID: XX for user: JohnDoe`
- Frontend: `🚨 New emergency request received via WebSocket`

---

### Test 2: Victim Login and Dashboard

**Objective**: Test victim user authentication and dashboard access

**Steps**:
1. Logout if logged in
2. Navigate to `/login`
3. Enter credentials:
   - Username: `JohnDoe`
   - Password: `123 Main Street, Downtown`
4. Click "Login"

**Expected Results**:
- ✅ Successful authentication
- ✅ Redirect to `/victim/dashboard`
- ✅ Dashboard shows user's emergency request
- ✅ Request status visible
- ✅ Can view request details

**Console Checks**:
- Backend: `User JohnDoe logged in successfully`
- Frontend: `Navigating to victim dashboard`

---

### Test 3: Admin Login and Dashboard

**Objective**: Test admin authentication and comprehensive dashboard

**Steps**:
1. Logout from victim account
2. Navigate to `/login`
3. Enter admin credentials:
   - Username: `admin`
   - Password: `Admin@123`
4. Click "Login"

**Expected Results**:
- ✅ Successful authentication (BCrypt matches plain text via DelegatingPasswordEncoder)
- ✅ Redirect to `/admin/dashboard`
- ✅ Dashboard statistics displayed:
   - Total Requests
   - Active Requests
   - Resolved Requests
   - Available Teams
- ✅ Charts rendered (Status, Priority, Team availability)
- ✅ All requests visible in table
- ✅ WebSocket connection established

**Dashboard Features to Verify**:
- Request filtering by status
- Request sorting by date
- Team availability status
- Action buttons (Manage, View, Update Status)

---

### Test 4: Request Assignment Workflow

**Objective**: Test manual team assignment to emergency request

**Steps**:
1. As admin, navigate to dashboard
2. Find John Doe's emergency request
3. Click "Manage" button
4. In the dialog, click "Assign Team" tab
5. Select an available rescue team (must have matching capability)
6. Click "Assign"

**Expected Results**:
- ✅ Team assignment successful
- ✅ Request status changes to `ASSIGNED`
- ✅ Team status changes to `ASSIGNED`
- ✅ Assignment timestamp recorded
- ✅ WebSocket notification sent
- ✅ Both request and team views updated in real-time

**Backend Verification**:
```sql
SELECT * FROM emergency_requests WHERE id = XX;
-- Verify assigned_team_id IS NOT NULL, status = 'ASSIGNED'

SELECT * FROM rescue_teams WHERE id = XX;
-- Verify status = 'ASSIGNED', current_request_id = XX
```

**Console Checks**:
- Backend: `Assigning team XX to request XX`
- Backend: `Broadcasting team assignment for request XX`
- Frontend: `Team assignment: {id: XX, status: 'ASSIGNED'}`

---

### Test 5: Status Update Workflow

**Objective**: Test status progression through emergency lifecycle

**Steps**:
1. As admin, open assigned request
2. Click "Update Status"
3. Change status to `EN_ROUTE`
4. Save
5. Repeat for `ON_SCENE`
6. Repeat for `RESOLVED` with completion notes

**Expected Results**:
- ✅ Status updates in real-time
- ✅ Timestamps recorded for each status:
   - `respondedAt` for EN_ROUTE
   - `completedAt` for RESOLVED
- ✅ Team status synchronized (EN_ROUTE → ON_SCENE)
- ✅ WebSocket notifications sent for each update
- ✅ On RESOLVED: Team status back to `AVAILABLE`, `currentRequest` set to null
- ✅ Charts update automatically

**Backend Verification**:
```sql
SELECT status, responded_at, completed_at FROM emergency_requests WHERE id = XX;

SELECT status, current_request_id FROM rescue_teams WHERE id = XX;
-- For RESOLVED status, current_request_id should be NULL
```

---

### Test 6: Department Head Dashboard

**Objective**: Test department-specific dashboard and team management

**Steps**:
1. Login as department head:
   - Username: `fire_chief`
   - Password: `Fire@123`
2. Verify redirect to `/department/dashboard`
3. View assigned requests for department teams
4. Update request status
5. View team members

**Expected Results**:
- ✅ Only department-related requests visible
- ✅ Can update status of assigned requests
- ✅ Team member details visible
- ✅ WebSocket notifications for team assignments

---

### Test 7: Password Encryption Migration

**Objective**: Test DelegatingPasswordEncoder backward compatibility

**Steps**:
1. Verify admin can login with plain text password (`Admin@123`)
2. Check database - password is still plain text
3. Create new user via registration
4. Check database - new password is BCrypt encrypted

**Database Verification**:
```sql
-- Old user (plain text)
SELECT password FROM users WHERE username = 'admin';
-- Should NOT start with $2a$

-- New user (BCrypt)
SELECT password FROM users WHERE username = 'JohnDoe';
-- Should start with $2a$ or $2b$ or $2y$
```

**Expected Results**:
- ✅ Admin login works with plain text password
- ✅ `DelegatingPasswordEncoder.matches()` handles both formats
- ✅ New registrations always use BCrypt
- ✅ No migration errors or user disruption

---

### Test 8: Form Validation

**Objective**: Test comprehensive form validation

**Emergency Request Form**:
1. Try to submit with empty name → Error shown
2. Try to submit with 1 character name → Min length error
3. Try to submit with 0 people → Min value error
4. Try to submit with no emergency type selected → Error shown
5. Submit button should be disabled for all invalid states

**Login Form**:
1. Try to submit with empty username → Error shown
2. Try to submit with empty password → Error shown
3. Submit button disabled when invalid

**Expected Results**:
- ✅ All validation rules enforced
- ✅ Error messages display correctly
- ✅ Submit buttons disabled appropriately
- ✅ No invalid data submitted to backend

---

### Test 9: WebSocket Real-Time Updates

**Objective**: Test real-time notifications across multiple browser tabs

**Setup**:
1. Open 2 browser tabs
2. Tab 1: Login as admin
3. Tab 2: Create emergency request (no login)

**Steps**:
1. Submit request in Tab 2
2. Immediately check Tab 1 (admin dashboard)

**Expected Results**:
- ✅ Request appears in Tab 1 within 1-2 seconds (no page refresh)
- ✅ Browser notification shows in Tab 1
- ✅ Console shows WebSocket message: `🚨 New emergency request received`
- ✅ Dashboard statistics update automatically

**Status Update Test**:
1. In Tab 1, update request status to ASSIGNED
2. Open Tab 3 as victim user (same request)
3. Verify status updates in real-time without refresh

---

### Test 10: Navigation and Authorization

**Objective**: Test role-based routing and access control

**Tests**:
1. Login as victim → Should redirect to `/victim/dashboard`
2. Try to access `/admin/dashboard` as victim → Should be blocked/redirected
3. Login as admin → Should redirect to `/admin/dashboard`
4. Try to access `/department/dashboard` as admin → Should be blocked
5. Logout → Should clear session and redirect to login

**Expected Results**:
- ✅ AuthGuard enforces role-based access
- ✅ Unauthorized access attempts blocked
- ✅ Proper redirects based on user role
- ✅ Header navigation shows only authorized links

---

## 🐛 Known Issues & Edge Cases

### Edge Case 1: Duplicate Victim Username
- **Scenario**: Two victims with same name
- **Expected**: Second victim should reuse existing user account
- **Verify**: `EmergencyRequestService.createVictimUser()` checks for existing username

### Edge Case 2: Team Assignment Without Capability
- **Scenario**: Try to assign Fire team to Medical emergency
- **Expected**: Error message "Team does not have capability for MEDICAL"
- **Verify**: Validation in `EmergencyRequestService.assignTeamToRequest()`

### Edge Case 3: WebSocket Disconnection
- **Scenario**: Backend restarts while frontend connected
- **Expected**: Auto-reconnect after 5 seconds
- **Verify**: Console shows reconnection attempts

---

## 📊 Performance Verification

### Response Time Checks

```bash
# Emergency request creation
curl -X POST http://localhost:8080/api/emergency-request \
  -H "Content-Type: application/json" \
  -d '{"victimName":"Test","location":"Test Location","emergencyType":"FIRE"}' \
  -w "\nTime: %{time_total}s\n"
# Target: < 500ms

# Dashboard stats
curl http://localhost:8080/api/dashboard/admin/stats \
  -H "Authorization: Bearer <token>" \
  -w "\nTime: %{time_total}s\n"
# Target: < 1s
```

### WebSocket Latency
- Measure time between backend notification and frontend display
- Target: < 2 seconds

---

## ✅ Success Criteria

**System is production-ready when**:
- [ ] All 10 test scenarios pass
- [ ] No console errors in browser or backend logs
- [ ] WebSocket notifications deliver within 2 seconds
- [ ] Form validation prevents invalid submissions
- [ ] Password encryption works for new and existing users
- [ ] Role-based authorization enforced correctly
- [ ] All Docker containers healthy
- [ ] Database contains only encrypted passwords for new users

---

## 🚀 Next Steps After Testing

1. **Performance Testing**: Load test with 100+ concurrent requests
2. **Security Audit**: Penetration testing, SQL injection tests
3. **Documentation**: Update README with deployment instructions
4. **Monitoring**: Set up logging and alerting
5. **Backup Strategy**: Configure automated database backups

---

## 📝 Test Results Template

```
Test Date: ___________
Tester: ___________

| Test # | Scenario | Status | Notes |
|--------|----------|--------|-------|
| 1 | Victim Request | ✅/❌ | |
| 2 | Victim Login | ✅/❌ | |
| 3 | Admin Dashboard | ✅/❌ | |
| 4 | Request Assignment | ✅/❌ | |
| 5 | Status Updates | ✅/❌ | |
| 6 | Department Dashboard | ✅/❌ | |
| 7 | Password Encryption | ✅/❌ | |
| 8 | Form Validation | ✅/❌ | |
| 9 | WebSocket Updates | ✅/❌ | |
| 10 | Navigation/Auth | ✅/❌ | |

Overall Status: ___________
Ready for Production: Yes / No
```

---

## 🔗 Related Documentation

- [USER_GUIDE.md](./USER_GUIDE.md) - End-user instructions
- [TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md) - Architecture details
- [README.md](./README.md) - Deployment instructions
