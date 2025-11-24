# Disaster Management System V2 - User Guide

## Welcome to Disaster Management System!

This comprehensive guide will help you navigate and use all features of the Disaster Management System V2 effectively.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Login & Registration](#login--registration)
4. [Emergency Submission (Victim)](#emergency-submission-victim)
5. [Victim Dashboard](#victim-dashboard)
6. [Admin Dashboard](#admin-dashboard)
7. [Department Dashboard](#department-dashboard)
8. [Real-Time Chat](#real-time-chat)
9. [Troubleshooting](#troubleshooting)
10. [FAQ](#faq)

---

## Getting Started

### System Access

**URL**: http://localhost:4200

### Supported Browsers
- ✅ Google Chrome (Recommended)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari

### System Requirements
- Modern web browser with JavaScript enabled
- Internet connection
- Screen resolution: 1024x768 minimum (responsive design)

---

## User Roles

The system supports 5 distinct user roles, each with specific permissions:

### 1. 👤 Victim (ROLE_VICTIM)
**Purpose**: Report emergencies and track their status

**Capabilities:**
- Submit emergency requests
- View own requests
- Chat with rescue teams
- Track request status in real-time

**Default Credentials:**
- Username: `victim_test1` / Password: `password123`

---

### 2. 👨‍💼 Admin (ROLE_ADMIN)
**Purpose**: Oversee entire system operations

**Capabilities:**
- View comprehensive dashboard with all statistics
- Manage all emergency requests
- Assign rescue teams to any request
- View all departments and teams
- Access system-wide analytics
- View all chat conversations

**Default Credentials:**
- Username: `admin` / Password: `admin123`

**Dashboard Features:**
- Total requests, pending, active, resolved counts
- Request distribution by status (pie chart)
- Priority breakdown (bar chart)
- Team availability (donut chart)
- All emergency requests table with assignment capability

---

### 3. 🏢 Department Head (ROLE_DEPARTMENT_HEAD)
**Purpose**: Manage specific department operations

**Capabilities:**
- View department-specific dashboard
- Assign teams within their department
- Monitor team utilization
- Track department performance
- Approve or escalate requests

**Default Credentials:**
- Fire Dept: `fire_chief` / Password: `password123`
- Police Dept: `police_chief` / Password: `password123`
- Medical Dept: `medical_director` / Password: `password123`

**Dashboard Features:**
- Assigned requests to department
- Pending assignments
- Completed requests
- Team utilization percentage
- Department request table

---

### 4. 📞 Dispatcher (ROLE_DISPATCHER)
**Purpose**: Handle real-time emergency coordination

**Capabilities:**
- View incoming emergency requests
- Assign rescue teams
- Update request status
- Coordinate multi-team responses
- Monitor active incidents

**Default Credentials:**
- Username: `dispatcher1` / Password: `password123`

---

### 5. 🚒 Rescue Team Member (ROLE_RESCUE_TEAM_MEMBER)
**Purpose**: Execute field operations

**Capabilities:**
- View assigned requests
- Update status (En Route, On Scene, Resolved)
- Chat with victims and command center
- Report back real-time updates

**Default Credentials:**
- Username: `rescue_member1` / Password: `password123`

---

## Login & Registration

### Login Process

1. Navigate to http://localhost:4200/login
2. Enter your username and password
3. Click "Sign In"
4. You'll be redirected to your role-specific dashboard

**Login Screen Features:**
- Remember me checkbox (future enhancement)
- Forgot password link (future enhancement)
- Sign up link for new users
- Error messages for invalid credentials

---

### Registration Process

1. Click "Sign Up" on the login page
2. Fill in the registration form:
   - **Username**: Unique identifier (min 3 characters)
   - **Email**: Valid email address
   - **Password**: Strong password (min 6 characters)
   - **Role**: Select your role (default: ROLE_VICTIM)

3. Click "Create Account"
4. Upon success, you'll be redirected to login

**Password Requirements:**
- Minimum 6 characters (recommended: 12+)
- Mix of letters and numbers recommended
- Special characters accepted

---

## Emergency Submission (Victim)

### Submitting an Emergency Request

1. Navigate to http://localhost:4200/request-landing
   - *Note: This page is accessible without login for true emergencies*

2. Fill in the emergency form:

   **Victim Information:**
   - Name: Your full name
   - Phone Number: Contact number (format: 555-1234)

   **Location Details:**
   - Address: Exact location of emergency
   - Latitude/Longitude: Auto-filled if location services enabled

   **Emergency Details:**
   - Emergency Type: Select from dropdown
     - 🔥 FIRE
     - 🚨 CRIME
     - 🚑 MEDICAL
     - 🚗 ACCIDENT
   
   - Priority Level: System auto-suggests based on keywords
     - 🔴 CRITICAL: Life-threatening
     - 🟠 HIGH: Urgent attention needed
     - 🟡 MEDIUM: Important but not immediate
     - 🟢 LOW: Non-urgent

   - Description: Detailed description of the situation
     - What happened?
     - How many people involved?
     - Any injuries?
     - Special considerations?

3. Click "Submit Emergency Request"

4. **Confirmation:**
   - Request ID displayed
   - Status: PENDING
   - Option to track via dashboard (requires login)

**Example Emergency Description:**
```
"Building fire on 3rd floor. Heavy smoke visible. 
Approximately 15 people potentially trapped. 
Fire started in electrical room. We need immediate evacuation assistance."
```

---

## Victim Dashboard

### Accessing Your Dashboard

Login → Redirected to Victim Dashboard

### Dashboard Overview

**Statistics Cards:**
- Total Requests: All your submitted requests
- Pending Requests: Awaiting assignment
- Resolved Requests: Completed emergencies

**Recent Requests Table:**
- Request ID
- Location
- Emergency Type
- Priority Level
- Current Status
- Date Submitted
- Actions: View Details, Chat

### Request Status Lifecycle

```
PENDING → ASSIGNED → EN_ROUTE → ON_SCENE → RESOLVED
```

**Status Definitions:**
- **PENDING**: Request received, awaiting team assignment
- **ASSIGNED**: Rescue team assigned, preparing to respond
- **EN_ROUTE**: Team is traveling to location
- **ON_SCENE**: Team has arrived and is handling the situation
- **RESOLVED**: Emergency handled successfully
- **CANCELLED**: Request cancelled or invalid

### Tracking Your Request

1. Click "View Details" on any request
2. **Modal displays:**
   - Complete request information
   - Assigned rescue team details
   - Status history timeline
   - Estimated time of arrival (if en route)

3. **Real-Time Updates:**
   - Status changes appear instantly
   - Toast notifications for important updates
   - Chat messages from rescue team

---

## Admin Dashboard

### Dashboard Layout

The admin dashboard provides a comprehensive overview of the entire system.

#### Section 1: Statistics Cards (Top Row)

**Four Key Metrics:**
1. **Total Requests** (Blue)
   - All emergency requests in the system
   - Icon: Exclamation circle

2. **Pending** (Yellow/Warning)
   - Requests awaiting assignment
   - Icon: Clock
   - Action Required!

3. **Active** (Cyan/Info)
   - Requests currently being handled
   - Icon: Sync/Refresh
   - Includes: ASSIGNED, EN_ROUTE, ON_SCENE

4. **Resolved** (Green/Success)
   - Successfully completed requests
   - Icon: Check circle
   - Historical data

#### Section 2: Visual Analytics (Charts)

**Chart 1: Requests by Status (Doughnut Chart)**
- Visual breakdown of all request statuses
- Color-coded segments
- Hover for exact counts
- Legend at bottom

**Chart 2: Requests by Priority (Bar Chart)**
- Comparison of priority levels
- Vertical bars
- Y-axis shows request count
- Helps identify system load

**Chart 3: Team Availability (Pie Chart)**
- Available vs. Busy teams
- Fixed 350px size
- Green: Available teams
- Red: Busy teams

#### Section 3: Emergency Requests Table

**Columns:**
1. **ID**: Unique request identifier
2. **Victim**: Name and phone number
3. **Location**: Emergency address
4. **Type**: Emergency category badge
5. **Priority**: Priority level badge
6. **Status**: Current status badge
7. **Assigned Team**: Team name or "Unassigned"
8. **Created**: Timestamp
9. **Actions**: Assign button

**Features:**
- **Sorting**: Click column headers to sort
- **Color Coding**:
  - Red row background: CRITICAL priority
  - Yellow row background: HIGH priority
- **Real-time Updates**: Table refreshes automatically
- **Pagination**: Handle large datasets (100 records loaded)

### Assigning a Rescue Team

1. Locate the emergency request in the table
2. Click the "Assign" button (blue button in Actions column)
3. **Assignment Modal Opens:**
   - Request details displayed (left side)
   - Available rescue teams list (right side)
   - Each team shows:
     - Team name
     - Department
     - Current status badge
     - Member count

4. Click on a team to assign
5. **Confirmation:**
   - Modal closes
   - Request status updates to "ASSIGNED"
   - Team status changes to "BUSY"
   - Table refreshes automatically

**Best Practices:**
- Assign CRITICAL requests first
- Match emergency type with team specialization
  - FIRE → Fire Department teams
  - MEDICAL → Medical Department teams
  - CRIME → Police Department teams
- Check team availability (green badge = AVAILABLE)
- Balance workload across teams

---

## Department Dashboard

### Department-Specific View

Each department head sees only requests relevant to their department.

### Dashboard Components

**Statistics:**
- **Assigned Requests**: Total assigned to your department
- **Completed Requests**: Successfully resolved
- **Pending Assignments**: Awaiting your action
- **Team Utilization**: Percentage of teams currently busy

**Requests Table:**
- Filter: Only your department's requests
- Columns: ID, Victim, Location, Type, Priority, Status, Team, Created
- Actions: Assign (within department), Update Status

### Managing Your Department

**Team Assignment:**
1. Review pending requests
2. Select appropriate team based on:
   - Proximity to location
   - Team specialization
   - Current workload
3. Click "Assign" and choose team
4. Monitor team progress

**Status Updates:**
1. Click "View Details" on assigned request
2. Update status as team reports:
   - Mark "EN_ROUTE" when team departs
   - Mark "ON_SCENE" upon arrival
   - Mark "RESOLVED" when complete
3. Add notes if needed

**Performance Monitoring:**
- Track completion rate
- Monitor response times
- Identify bottlenecks
- Optimize team assignments

---

## Real-Time Chat

### Accessing Chat

**Method 1: From Dashboard**
- Click "Chat" in navigation menu
- Select active request from lobby

**Method 2: From Request Details**
- Click "View Details" on a request
- Click "Open Chat" button

### Chat Interface

**Layout:**
- **Left Sidebar**: Active conversations list
  - Request ID
  - Victim name
  - Unread message count
  - Last message preview

- **Main Chat Area**:
  - Message history (scrollable)
  - Your messages: Right-aligned, blue background
  - Other messages: Left-aligned, gray background
  - Timestamps on each message
  - Sender name above message

- **Input Area** (Bottom):
  - Text input field
  - "Send" button
  - Typing indicator: "John is typing..."

### Sending Messages

1. Type your message in the input field
2. Press "Enter" or click "Send"
3. Message appears instantly
4. Delivered to all participants in real-time

**Message Types:**
- **Status Updates**: "Team is en route, ETA 5 minutes"
- **Questions**: "How many people are injured?"
- **Instructions**: "Please move to safe location"
- **Confirmations**: "We have arrived at the scene"

### Chat Features

**Real-Time Updates:**
- Instant message delivery
- No page refresh needed
- WebSocket connection

**Typing Indicators:**
- See when others are typing
- "John Doe is typing..."
- Disappears after 3 seconds of inactivity

**Message History:**
- Full conversation history
- Scroll up to view older messages
- Messages persist in database

**Participants:**
- Victim who submitted request
- Assigned rescue team members
- Department head
- Dispatchers

**Notifications:**
- Toast popup for new messages
- Sound notification (if enabled)
- Unread count badge

### Chat Best Practices

**For Victims:**
- Provide clear, concise information
- Answer questions quickly
- Stay available for communication
- Notify immediately if situation changes

**For Rescue Teams:**
- Update status frequently
- Request additional information if needed
- Provide ETAs
- Confirm arrival and completion

**For Admins/Dispatchers:**
- Monitor critical conversations
- Intervene if needed
- Coordinate multi-team responses
- Document important information

---

## Troubleshooting

### Common Issues & Solutions

#### Login Problems

**Issue**: "Invalid username or password"
- **Solution**: 
  - Verify credentials (case-sensitive)
  - Check Caps Lock is off
  - Try default test accounts
  - Contact admin for password reset

**Issue**: "Session expired"
- **Solution**:
  - JWT token expired (24-hour limit)
  - Simply log in again
  - Auto-logout implemented for security

---

#### Dashboard Not Loading

**Issue**: Empty statistics or charts not displaying
- **Solution**:
  - Refresh the page (Ctrl+F5)
  - Clear browser cache
  - Check browser console for errors (F12)
  - Verify backend is running: http://localhost:8080/actuator/health

**Issue**: "Error loading requests"
- **Solution**:
  - Check network connection
  - Verify API is accessible
  - Wait a few seconds and retry
  - Check Docker containers: `docker ps`

---

#### Emergency Submission Fails

**Issue**: "Failed to submit request"
- **Solution**:
  - Check all required fields are filled
  - Verify phone number format (555-1234)
  - Ensure description is not empty
  - Try refreshing the page

**Issue**: Location not auto-filling
- **Solution**:
  - Enable location services in browser
  - Allow site access to location
  - Manually enter latitude/longitude
  - Enter full address in location field

---

#### Chat Not Working

**Issue**: Messages not sending
- **Solution**:
  - Check internet connection
  - Refresh the page
  - Re-login to establish new WebSocket connection
  - Verify backend WebSocket endpoint: ws://localhost:8080/ws

**Issue**: "Connection failed"
- **Solution**:
  - Backend might be restarting
  - Wait 30 seconds and retry
  - Check Docker logs: `docker logs disaster-backend`

**Issue**: Typing indicators not showing
- **Solution**:
  - This is optional feature
  - Refresh chat window
  - May require all participants to refresh

---

#### Performance Issues

**Issue**: Slow page loading
- **Solution**:
  - Clear browser cache
  - Close unnecessary browser tabs
  - Check system resources
  - Verify Docker containers have enough memory

**Issue**: Charts not rendering
- **Solution**:
  - Wait for data to load completely
  - Refresh page
  - Check browser console for JavaScript errors
  - Update browser to latest version

---

## FAQ

### General Questions

**Q: Do I need an account to submit an emergency?**  
A: No! The emergency submission page (/request-landing) is publicly accessible. However, to track your request status, you'll need to create an account and log in.

**Q: How long does it take for a team to be assigned?**  
A: Typically 1-5 minutes depending on admin/dispatcher availability. CRITICAL priority requests are handled first.

**Q: Can I submit multiple emergency requests?**  
A: Yes, if you have multiple emergencies to report. Each gets a unique ID and is tracked separately.

**Q: Is my data secure?**  
A: Yes. The system uses JWT authentication, encrypted WebSocket connections, and secure HTTPS (in production). Passwords should be encrypted with BCrypt (production requirement).

**Q: Can I cancel an emergency request?**  
A: Yes. Contact the admin or use the "Cancel" option in your dashboard. Once a team is en route, cancellation may not be immediate.

---

### Role-Specific Questions

**Q: [Victim] I submitted a request but can't see it in my dashboard**  
A: You must log in with the same account. If you submitted without login, contact admin with your request ID.

**Q: [Admin] How do I reassign a request to a different team?**  
A: Currently, you must mark the request as "PENDING" again, then reassign. Future enhancement will allow direct reassignment.

**Q: [Department Head] Can I see other departments' requests?**  
A: No, you only see requests assigned to or relevant to your department for privacy and focus.

**Q: [Rescue Team] How do I update my team's status?**  
A: Through the department dashboard or mobile app (future feature). Currently, admin/dispatcher updates status based on your reports.

---

### Technical Questions

**Q: What browsers are supported?**  
A: Chrome (recommended), Firefox, Edge, Safari - latest versions. Internet Explorer is NOT supported.

**Q: Does the system work on mobile devices?**  
A: Yes, the interface is responsive and works on tablets and phones. A dedicated mobile app is planned for future release.

**Q: Can I use the system offline?**  
A: No, an internet connection is required for real-time features. Emergency requests must be submitted online.

**Q: What happens if the system goes down during an emergency?**  
A: Have backup communication methods. The system has high availability with Docker health checks and automatic restart, but always maintain traditional emergency contacts (911, local authorities).

**Q: How long is chat history retained?**  
A: All chat messages are stored permanently in the database for record-keeping and analysis.

---

### Feature Requests

**Q: Can I request a new feature?**  
A: Yes! Contact your admin or submit feedback. Common requests:
- Mobile app
- SMS notifications
- Map visualization
- Advanced analytics
- Multi-language support

**Q: Is there an API for third-party integration?**  
A: Yes, REST API with Swagger documentation at http://localhost:8080/swagger-ui.html

**Q: Will there be training sessions?**  
A: Contact your organization's admin. Training materials and videos are being developed.

---

## Getting Help

### Support Channels

**Technical Support:**
- Email: support@disastermanagement.local (update to your email)
- Phone: +1-XXX-XXX-XXXX (update to your phone)
- Business Hours: 24/7 (Emergency System)

**Documentation:**
- Technical Documentation: /TECHNICAL_DOCUMENTATION.md
- System Analysis: /SYSTEM_ANALYSIS.md
- API Docs: http://localhost:8080/swagger-ui.html

**Emergency Contact:**
- For true emergencies, always call local emergency services (911)
- This system supplements, not replaces, traditional emergency response

---

## Tips for Effective Use

### For Victims

✅ **DO:**
- Provide accurate location information
- Include all relevant details in description
- Respond promptly to chat messages
- Update if situation changes (escalates or resolves)

❌ **DON'T:**
- Submit fake emergencies
- Provide false information
- Ignore communication from rescue teams
- Leave the area without notifying responders

---

### For Admins

✅ **DO:**
- Monitor dashboard frequently
- Prioritize CRITICAL requests
- Ensure balanced team workload
- Document unusual situations
- Verify team assignment logic

❌ **DON'T:**
- Ignore pending requests
- Assign teams already marked BUSY
- Forget to update request status
- Dismiss victim concerns

---

### For Department Heads

✅ **DO:**
- Review team performance regularly
- Maintain accurate team availability
- Provide clear instructions to teams
- Escalate issues to admin when needed
- Document lessons learned

❌ **DON'T:**
- Delay team assignments
- Overwork specific teams
- Ignore utilization metrics
- Fail to communicate with other departments

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Chat | `Ctrl + M` (future) |
| Submit Form | `Enter` (in single-line fields) |
| Close Modal | `Esc` |
| Refresh Dashboard | `F5` |
| Focus Search | `/` (future) |

---

## System Availability

**Uptime Target**: 99.9%  
**Maintenance Windows**: Announced 24 hours in advance  
**Backup Systems**: Automatic database backups every 6 hours

---

## Version Information

**User Guide Version**: 1.0  
**System Version**: 2.0  
**Author**: Yash Vyas  
**Compatibility**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+

---

## Feedback

We value your feedback! Help us improve the system by:
- Reporting bugs
- Suggesting features
- Sharing use cases
- Providing training feedback

**Feedback Form**: Available in dashboard (future feature)  
**Email**: feedback@disastermanagement.local

---

**Thank you for using Disaster Management System V2!**  
**Together, we save lives. 🚨🚒🚑🚓**
