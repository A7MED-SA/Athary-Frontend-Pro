# Quickstart: Dashboards + Secondary Features + Missing Backend Features

**Date**: 2026-06-23
**Feature**: 003-dashboards-secondary-features

## Prerequisites

- Node.js 18+
- Backend API running at configured `VITE_API_URL`
- MinIO storage running for media uploads
- SignalR hubs available at `/hubs/notifications` and `/hubs/messaging`

## Setup

```bash
# 1. Install dependencies (if not already)
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set:
#   VITE_API_BASE_URL=http://localhost:7001/api
#   VITE_SIGNALR_URL=http://localhost:7001/hubs

# 3. Start dev server
npm run dev
```

## Validation Scenarios

### Scenario 1: Student Dashboard

1. Log in as a student
2. Navigate to `/student/dashboard`
3. **Expected**: Dashboard loads with metrics (enrolled courses, completed, certificates, hours)
4. **Expected**: Recent courses listed with progress percentages
5. **Expected**: Weekly activity chart displays study hours
6. **Expected**: Certificates section shows earned certificates
7. **Expected**: Skeleton placeholders during loading
8. **Expected**: Error fallback with retry on API failure

### Scenario 2: Instructor Dashboard

1. Log in as an instructor
2. Navigate to `/instructor/dashboard`
3. **Expected**: Dashboard loads with revenue, students, courses metrics
4. **Expected**: Revenue trend chart shows 12-month data
5. **Expected**: Enrollment trend chart displays
6. **Expected**: Student level distribution pie chart shows
7. **Expected**: Courses listed with enrollment count, rating, revenue

### Scenario 3: Admin Dashboard

1. Log in as an admin
2. Navigate to `/admin/dashboard`
3. **Expected**: Dashboard loads with platform metrics
4. **Expected**: Revenue, user growth, enrollment trend charts display
5. **Expected**: Top courses listed by enrollment/revenue
6. **Expected**: Pending items counts shown (courses, edit requests, teacher requests, flagged reviews)
7. **Expected**: Course distribution pie chart displays

### Scenario 4: Admin Dashboard Tabs

1. Log in as an admin
2. Navigate to `/admin/dashboard`
3. Click "Coupons" tab
4. **Expected**: Coupons list loads with create/edit/toggle/delete actions
5. Create a new coupon
6. **Expected**: Coupon appears in list after creation
7. Toggle a coupon's active status
8. **Expected**: Status updates immediately
9. Click "Payment Methods" tab
10. **Expected**: Payment methods listed with create/toggle actions
11. Click "Refunds" tab
12. **Expected**: Refund requests listed with approve/reject actions
13. Click "Teacher Requests" tab
14. **Expected**: Pending instructor requests listed

### Scenario 5: Profile Settings

1. Log in as any user
2. Navigate to `/profile/settings`
3. **Expected**: Profile data loaded and displayed in editable form
4. Update firstName and bio
5. Click save
6. **Expected**: Success toast shown, profile updated
7. Click "Change Profile Picture"
8. Select an image file (<5MB)
9. **Expected**: Upload completes, profile picture updates
10. Navigate to phones section
11. Add a new phone number
12. **Expected**: Phone added to list
13. Navigate to addresses section
14. Add a new address
15. **Expected**: Address added to list
16. Click "Change Password"
17. Enter current and new password
18. **Expected**: Password changed, success toast shown

### Scenario 6: Public Instructor Profile

1. Navigate to `/instructor/{slug}`
2. **Expected**: Instructor profile loads with bio, nationality, profile image
3. **Expected**: Instructor's published courses listed
4. Navigate to non-existent slug
5. **Expected**: "Instructor not found" message displayed

### Scenario 7: Messaging Center

1. Log in as any user
2. Navigate to `/messages`
3. **Expected**: Conversations list loads with last message and unread count
4. Click a conversation
5. **Expected**: Messages load and display
6. Type a message and click send
7. **Expected**: Message appears in conversation
8. **Expected**: Real-time messages arrive via SignalR
9. **Expected**: Navbar badge updates with unread count

### Scenario 8: Wishlist

1. Log in as a student
2. Navigate to `/wishlist`
3. **Expected**: Wishlist items loaded and displayed
4. Click "Remove" on an item
5. **Expected**: Item removed from list

### Scenario 9: Refund Request

1. Log in as a student
2. Navigate to `/refunds`
3. Click "Request Refund"
4. Select a payment and enter reason
5. Submit the form
6. **Expected**: Refund request created, success toast shown

### Scenario 10: Instructor Apply

1. Log in as a student
2. Navigate to `/instructor-apply`
3. Fill the application form with message
4. Upload documents (CV, certificate)
5. Submit the form
6. **Expected**: Application submitted, success toast shown
7. **Expected**: Application status displayed with details

### Scenario 11: Error Handling

1. Disconnect network (or simulate backend down)
2. Navigate to any dashboard
3. **Expected**: Error fallback with retry button displayed
4. Click retry
5. **Expected**: Re-attempts to fetch data

### Scenario 12: Real-time Notifications

1. Log in as a user
2. Keep the dashboard open
3. Trigger a notification (e.g., another user sends a message)
4. **Expected**: Notification appears in real-time via SignalR
5. **Expected**: Browser notification shown if permission granted
