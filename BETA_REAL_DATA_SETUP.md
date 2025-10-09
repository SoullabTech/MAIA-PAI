# Beta Real Data Setup

This guide converts the beta monitoring dashboard from **mock data** to **real user tracking**.

## 🎯 What This Does

Transforms the dashboard from showing hardcoded examples (Alice, David, Sarah) to tracking actual beta testers and their spiral journeys in real-time.

## 🚀 Quick Setup

### 1. Run Database Schema
```sql
-- Apply the database schema
psql -d your_database < database/beta-tracking-schema.sql
```

### 2. Setup Real Beta System
```bash
# Install dependencies if needed
npm install

# Run the setup script
npm run setup:beta-real
```

### 3. Verify Setup
Visit `/beta/monitor` and check:
- Individual Journey Snapshots should show "Loading..." then real users
- All spiral data comes from database instead of mock
- User counts reflect actual registered beta testers

## 📊 What Becomes Real

### Before (Mock):
- ❌ Hardcoded Alice, David, Sarah examples
- ❌ Fake spiral intersections and patterns
- ❌ Static progress bars and user counts

### After (Real):
- ✅ Actual registered beta testers
- ✅ Real spiral journey tracking
- ✅ Live intersection detection
- ✅ Dynamic progress based on user sessions

## 🗃️ Database Tables Created

| Table | Purpose |
|-------|---------|
| `user_spiral_journeys` | Individual spiral progress tracking |
| `user_facet_progress` | 12-facet universal progress |
| `spiral_intersections` | Detected spiral intersections |
| `user_sessions` | Real-time session tracking |
| `collective_patterns` | Group field patterns |
| `beta_invitations` | Beta tester invitation management |

## 🔄 API Endpoints

### New Real Data APIs:
- `GET /api/beta/real-data` - Main dashboard data
- `POST /api/beta/setup-real-users` - Setup management
- `GET /api/beta/setup-real-users` - Check setup status

### Data Flow:
```
Dashboard → /api/beta/real-data → Database → Real User Journeys
```

## 🎮 Testing the System

### 1. Initial State (No Real Users):
- Dashboard shows "No journey data yet"
- Falls back to mock data for demo

### 2. With Beta Testers:
- Real user names appear in snapshots
- Actual spiral progress displays
- Live intersection detection works

### 3. Sample Data Creation:
The setup script creates sample journeys for existing users to demonstrate the system working.

## 🔧 Maintenance

### Adding New Beta Testers:
```bash
curl -X POST /api/beta/setup-real-users \
  -H "Content-Type: application/json" \
  -d '{
    "testers": [
      {
        "email": "newuser@example.com",
        "explorer_code": "MAIA-EXPLORER",
        "real_name": "New User"
      }
    ]
  }'
```

### Checking System Status:
```bash
curl /api/beta/setup-real-users
```

## 🎯 Journey Tracking

When beta testers use the system, Maya will automatically:
1. **Track spiral progress** through conversations
2. **Detect facet movements** (Innocence → Integration → Transcendence)
3. **Identify intersections** between life domains
4. **Generate collective patterns** across the user base

The dashboard updates in real-time to show this authentic consciousness exploration data.

## 🚨 Important Notes

- **Database Required**: Real data needs PostgreSQL with Supabase
- **Environment Variables**: Ensure Supabase keys are configured
- **Gradual Rollout**: System gracefully handles mix of real and mock data
- **Privacy**: Only stores aggregated patterns, not sensitive personal details

---

**Result**: Your beta monitoring dashboard now tracks genuine human consciousness journeys instead of static examples! 🌟