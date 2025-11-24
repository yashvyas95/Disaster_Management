# Testing Guide - Disaster Management V2

## 🧪 Comprehensive Testing Checklist

### Prerequisites
1. Ensure all services are running:
   ```bash
   docker ps
   ```
   You should see:
   - disaster-backend (healthy)
   - disaster-frontend
   - disaster-mysql (healthy)
   - disaster-redis (healthy)

2. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:8080

---

## Test User Credentials

Based on the seed data, you should have these users:

**Admin User:**
- Username: `admin`
- Password: `admin123` (or check seed data)
- Role: ADMIN

**Department Head:**
- Username: `dept_head`
- Password: (check seed data)
- Role: DEPARTMENT_HEAD

**Rescue Team:**
- Username: `team_leader`
- Password: (check seed data)
- Role: RESCUE_TEAM

**Victim:**
- Username: `victim1`
- Password: (check seed data)
- Role: VICTIM

---

## Test Scenarios

### 1. ✅ Emergency Request Assignment Flow

**Test Steps:**

1. **Login as Admin**
   - Navigate to http://localhost:4200
   - Login with admin credentials
   - Verify admin dashboard loads

2. **View Emergency Requests**
   - Check the requests table at the bottom
   - Verify request details are displayed:
     - ID, Victim Name, Location, Type, Priority, Status, Assigned Team

3. **Assign a Team to a Request**
   - Find a request with status "PENDING" and no assigned team
   - Click the "Assign" button (user-plus icon)
   - Modal should open showing request details
   - Select a rescue team from the list
   - Click on the team to assign
   - Modal should close
   - Request table should refresh
   - Verify the request now shows an assigned team

**Expected Results:**
- ✅ No 500 errors
- ✅ Team is assigned successfully
- ✅ Status changes to "ASSIGNED"
- ✅ Dashboard statistics update

---

### 2. ✅ Request Status Update Flow

**Test Steps:**

1. **Update Status from Admin Dashboard**
   - Find a request with status "ASSIGNED"
   - Click the status dropdown button (sync icon)
   - Select "En Route"
   - Verify request status updates to "EN_ROUTE"
   
2. **Progress Through Workflow**
   - For EN_ROUTE request, update to "On Scene"
   - For ON_SCENE request, click "Complete" button
   - Verify status changes to "RESOLVED"

**Expected Results:**
- ✅ Status updates successfully
- ✅ No errors in console
- ✅ Dashboard refreshes with new data
- ✅ Status badges show correct colors

---

### 3. ✅ Department Dashboard Testing

**Test Steps:**

1. **Login as Department Head**
   - Logout from admin
   - Login with department head credentials

2. **View Department Dashboard**
   - Verify statistics cards display correctly
   - Check assigned requests table

3. **Update Request Status**
   - Click "View" on an assigned request
   - Modal opens with request details
   - Click status progression button:
     - "Mark as En Route" for ASSIGNED
     - "Mark as On Scene" for EN_ROUTE
     - "Mark as Resolved" for ON_SCENE
   - Verify status updates

**Expected Results:**
- ✅ Department-specific data loads
- ✅ Status updates work correctly
- ✅ Modal shows proper controls based on status

---

### 4. ✅ Unified Messaging Testing

**Test Steps:**

1. **Access Messaging (Admin)**
   - Click the "Messages" button in top right
   - Verify unread count badge (if any)
   - Modal opens with Inbox/Compose tabs

2. **View Inbox**
   - Switch to "Inbox" tab
   - Verify conversation partners list
   - Click on a conversation partner
   - Verify messages load
   - Check message formatting (sent vs received)
   - Verify read receipts

3. **Send a Message**
   - Switch to "Compose" tab
   - Select a recipient from dropdown
   - Type a message
   - Click "Send Message"
   - Verify success notification
   - Check message appears in inbox

4. **Test as Different User Types**
   - Logout and login as Department Head
   - Send message to Admin
   - Login as Rescue Team
   - Send message to Department Head
   - Login as Victim
   - Send message to Admin

**Expected Results:**
- ✅ All user types can access messaging
- ✅ Messages send successfully
- ✅ Unread count updates
- ✅ Conversations are threaded correctly
- ✅ Recipient list shows appropriate users based on role

---

### 5. ✅ Victim Dashboard Testing

**Test Steps:**

1. **Login as Victim**
   - Use victim credentials
   - Dashboard loads showing personal requests

2. **View Request History**
   - Check personal emergency requests
   - Verify status display
   - Check request details

3. **Create New Request**
   - Click "Create New Request" button
   - Fill in emergency details
   - Submit request
   - Verify request appears in list

4. **Use Messaging**
   - Click Messages button
   - Send message to admin
   - Verify message sends successfully

**Expected Results:**
- ✅ Victim sees only their requests
- ✅ Can create new requests
- ✅ Can message rescue teams and admin
- ✅ Real-time status updates visible

---

## Browser Console Testing

### Check for Errors

1. **Open Browser DevTools**
   - Press F12 or right-click → Inspect
   - Go to Console tab

2. **Monitor During Testing**
   - Look for RED error messages
   - Check Network tab for failed requests (status 4xx or 5xx)

**Expected:**
- ✅ No console errors
- ✅ All API calls return 200/201 status
- ✅ No CORS errors

---

## API Testing (Optional)

### Using Browser or Postman

1. **Get Auth Token**
   ```bash
   POST http://localhost:8080/api/auth/login
   Content-Type: application/json
   
   {
     "username": "admin",
     "password": "admin123"
   }
   ```

2. **Test Assignment Endpoint**
   ```bash
   POST http://localhost:8080/api/requests/68/assign/1
   Authorization: Bearer <your-token>
   ```

3. **Test Status Update**
   ```bash
   PATCH http://localhost:8080/api/requests/68/status?status=EN_ROUTE
   Authorization: Bearer <your-token>
   ```

4. **Test Messaging**
   ```bash
   POST http://localhost:8080/api/direct-messages
   Authorization: Bearer <your-token>
   Content-Type: application/json
   
   {
     "recipientId": 2,
     "content": "Test message"
   }
   ```

---

## Performance Testing

### Check Response Times

1. **Dashboard Load**
   - Should load within 2-3 seconds
   - Statistics should populate quickly

2. **Request Assignment**
   - Assignment should complete within 1 second
   - No hanging or freezing

3. **Messaging**
   - Messages should send instantly
   - Conversation should load quickly

---

## Database Verification

### Check Data Changes

```bash
# Connect to MySQL
docker exec -it disaster-mysql mysql -uroot -prootpassword disaster_management_v2

# Check request assignment
SELECT id, victim_name, status, assigned_team_id FROM emergency_requests WHERE id = 68;

# Check team assignment
SELECT id, name, status, current_request_id FROM rescue_teams WHERE id = 1;

# Check messages
SELECT id, sender_id, recipient_id, content, created_at FROM direct_messages ORDER BY created_at DESC LIMIT 10;
```

---

## Known Issues (If Any)

### Issue Tracking

If you encounter any issues during testing, check:

1. **Backend Logs**
   ```bash
   docker logs disaster-backend --tail 50
   ```

2. **Frontend Logs**
   ```bash
   docker logs disaster-frontend --tail 50
   ```

3. **MySQL Logs**
   ```bash
   docker logs disaster-mysql --tail 50
   ```

---

## Test Results Template

### Test Execution Report

**Date:** ___________  
**Tester:** ___________  
**Build Version:** Docker Compose

| Test Scenario | Status | Notes |
|--------------|--------|-------|
| Request Assignment | ⬜ Pass / ⬜ Fail | |
| Status Update (Admin) | ⬜ Pass / ⬜ Fail | |
| Status Update (Dept) | ⬜ Pass / ⬜ Fail | |
| Unified Messaging | ⬜ Pass / ⬜ Fail | |
| Victim Dashboard | ⬜ Pass / ⬜ Fail | |
| All User Types Messaging | ⬜ Pass / ⬜ Fail | |

**Overall Result:** ⬜ Pass / ⬜ Fail

**Comments:**
```
_________________________________________________
_________________________________________________
_________________________________________________
```

---

## Success Criteria

The application passes testing if:

✅ All emergency requests can be assigned to teams  
✅ Request status can be updated through the workflow  
✅ All user types can send and receive messages  
✅ No console errors or failed API calls  
✅ UI is responsive and functional  
✅ Data persists correctly in the database  
✅ Role-based access control works correctly  

---

## Support

If tests fail:

1. Check MODERNIZATION_SUMMARY.md for API details
2. Review backend logs for errors
3. Verify database data is correct
4. Clear browser cache and retry
5. Restart Docker containers if needed:
   ```bash
   docker-compose restart
   ```

---

**Happy Testing! 🧪**
