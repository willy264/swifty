# API Endpoints Usage Documentation

**API Base URL:** `https://telegram-bot-backend-jy44.onrender.com/api`

---

## ✅ Endpoints Currently In Use

### Authentication

#### `POST /auth/telegram`
- **Function:** `authenticateTelegram(initData: string)`
- **File:** [src/components/TelegramProvider.tsx](src/components/TelegramProvider.tsx#L93)
- **Usage:** Authenticates Telegram Mini App users on app initialization
- **Purpose:** Verifies Telegram WebApp initData HMAC to establish user session

---

### User Profile & Wallet

#### `GET /user/{id}`
- **Function:** `getUser(userId: string)`
- **Files:** 
  - [src/components/TelegramProvider.tsx](src/components/TelegramProvider.tsx#L97) - Fetches user after Telegram auth
  - [src/components/TelegramProvider.tsx](src/components/TelegramProvider.tsx#L118) - Refreshes user from stored session
  - [src/lib/api.ts](src/lib/api.ts#L216) - Called in `getDashboardData()`
- **Usage:** Fetches user profile with stats (combines user + gamification data)
- **Cache:** 60 seconds ISR

#### `POST /wallet/connect`
- **Function:** `attachWallet(userId: string, address: string)`
- **File:** [src/components/TelegramProvider.tsx](src/components/TelegramProvider.tsx#L10)
- **Usage:** Connects a wallet to the authenticated user
- **Purpose:** Mini App bridge to attach wallet addresses

---

### Airdrops

#### `GET /airdrops`
- **Function:** `getAirdrops(take = 24, skip = 0)`
- **File:** [src/app/(dashboard)/airdrops/page.tsx](src/app/(dashboard)/airdrops/page.tsx#L7)
- **Usage:** Lists all available airdrops with pagination
- **Parameters:** `take` (limit, default 24), `skip` (offset)
- **Cache:** 300 seconds ISR

#### `GET /airdrops/{id}`
- **Function:** `getAirdropById(id: string)`
- **File:** [src/app/(dashboard)/airdrops/[id]/page.tsx](src/app/(dashboard)/airdrops/[id]/page.tsx#L15)
- **Usage:** Fetches detailed airdrop information by ID
- **Cache:** 300 seconds ISR

---

### Security & Wallet Analysis

#### `POST /security/analyze-wallet`
- **Function:** `analyzeWallet(address: string, chain: ApiChain = "eth")`
- **File:** [src/app/(dashboard)/wallet/page.tsx](src/app/(dashboard)/wallet/page.tsx#L16)
- **Usage:** Analyzes connected wallet for security risks
- **Parameters:** `address` (wallet address), `chain` (blockchain, default "eth")
- **Response:** `WalletAnalysis` with health score, dangerous approvals, suspicious contracts

---

### Tasks & Checklists

#### `GET /tasks/{userId}`
- **Function:** `getUserTasks(userId: string)`
- **Files:**
  - [src/app/(dashboard)/tasks/page.tsx](src/app/(dashboard)/tasks/page.tsx#L9) - Displays task list
  - [src/lib/api.ts](src/lib/api.ts#L220) - Called in `getDashboardData()`
- **Usage:** Lists all airdrop tasks for a user
- **Cache:** 30 seconds ISR

---

### Gamification & Leaderboard

#### `GET /leaderboard`
- **Function:** `getLeaderboard(limit = 20)`
- **Files:**
  - [src/app/(dashboard)/leaderboard/page.tsx](src/app/(dashboard)/leaderboard/page.tsx#L9) - Displays XP leaderboard
  - [src/lib/api.ts](src/lib/api.ts#L219) - Called in `getDashboardData()`
- **Usage:** Fetches XP leaderboard with top users
- **Parameters:** `limit` (max results, default 20)
- **Cache:** 120 seconds ISR

#### `GET /user/stats` (Alternative)
- **Function:** `getUserStats(userId: string)`
- **File:** [src/lib/api.ts](src/lib/api.ts#L118)
- **Usage:** Query parameter version for fetching user stats separately
- **Note:** Currently not used in UI; `getUser()` returns stats combined
- **Cache:** 60 seconds ISR

---

### Referrals

#### `GET /referrals/{userId}`
- **Function:** `getReferrals(userId: string)`
- **Files:**
  - [src/app/(dashboard)/profile/page.tsx](src/app/(dashboard)/profile/page.tsx#L12) - Shows referral count
  - [src/app/(dashboard)/leaderboard/page.tsx](src/app/(dashboard)/leaderboard/page.tsx#L9) - Displays referral stats
  - [src/lib/api.ts](src/lib/api.ts#L221) - Called in `getDashboardData()`
- **Usage:** Lists referrals attributed to the user
- **Cache:** 60 seconds ISR

---

### Crypto Prices

#### `GET /crypto/trending`
- **Function:** `getTrendingCoins()`
- **Files:**
  - [src/app/(dashboard)/airdrops/page.tsx](src/app/(dashboard)/airdrops/page.tsx) - Could display trending coins
  - [src/lib/api.ts](src/lib/api.ts#L219) - Called in `getDashboardData()`
- **Usage:** Fetches trending coins from CoinGecko
- **Cache:** 300 seconds ISR

#### `GET /crypto/price/{coinId}`
- **Function:** `getCoinPrice(coinId: string, vs = "usd")`
- **File:** [src/lib/api.ts](src/lib/api.ts#L106)
- **Usage:** Fetches individual coin price
- **Parameters:** `coinId` (CoinGecko ID), `vs` (currency, default "usd")
- **Note:** Defined but not currently used in UI components
- **Cache:** 60 seconds ISR

---

### Health & Monitoring

#### `GET /health`
- **Function:** `getHealth()`
- **File:** [src/lib/api.ts](src/lib/api.ts#L220) - Called in `getDashboardData()`
- **Usage:** Service liveness probe
- **Cache:** 60 seconds ISR
- **Fallback:** Returns degraded status if health check fails

---

## 📋 Defined But Unused Endpoints

These functions are implemented but not currently called from any UI component:

| Function | Endpoint | Purpose |
|----------|----------|---------|
| `analyzeAirdrop()` | `POST /security/analyze-airdrop` | Analyze airdrop for scam risk |
| `ensureChecklist()` | `POST /tasks/checklist` | Provision default checklist for user/airdrop pair |
| `updateTask()` | `POST /tasks/update` | Update task status or progress |
| `grantXp()` | `POST /user/xp/update` | Grant XP to user |
| `sendNotification()` | `POST /notifications/send` | Send Telegram notification |

---

## 📊 Dashboard Aggregation

The `getDashboardData(userId)` function in [src/lib/api.ts](src/lib/api.ts#L213) orchestrates multiple parallel requests:

```typescript
await Promise.allSettled([
  getHealth(),           // Service status
  getUser(userId),       // User profile + stats
  getAirdrops(18, 0),    // Airdrop feed
  getTrendingCoins(),    // Trending coins
  getLeaderboard(8),     // Top 8 leaderboard
  getUserTasks(userId),  // User's checklist
  getReferrals(userId)   // Referral info
])
```

**Pages Using `getDashboardData()`:**
- [src/app/(dashboard)/page.tsx](src/app/(dashboard)/page.tsx) - Main dashboard
- [src/app/(dashboard)/airdrops/page.tsx](src/app/(dashboard)/airdrops/page.tsx)
- [src/app/(dashboard)/leaderboard/page.tsx](src/app/(dashboard)/leaderboard/page.tsx)
- [src/app/(dashboard)/profile/page.tsx](src/app/(dashboard)/profile/page.tsx)
- [src/app/(dashboard)/tasks/page.tsx](src/app/(dashboard)/tasks/page.tsx)
- [src/app/(dashboard)/wallet/page.tsx](src/app/(dashboard)/wallet/page.tsx)

---

## 🔄 Data Flow Architecture

```
TelegramProvider (init)
  ├─ authenticateTelegram()
  ├─ getUser()
  └─ attachWallet() (on user action)

Dashboard Pages
  └─ getDashboardData()
      ├─ getHealth()
      ├─ getUser()
      ├─ getAirdrops()
      ├─ getTrendingCoins()
      ├─ getLeaderboard()
      ├─ getUserTasks()
      └─ getReferrals()

Route-Specific Calls
  ├─ Wallet Page: analyzeWallet()
  ├─ Airdrop Detail: getAirdropById()
```

---

## 🛡️ Error Handling

All endpoints use the `apiRequest()` wrapper which:
- Validates response status
- Throws `ApiError` with status code on failure
- Provides fallback data in dashboard aggregation
- Implements ISR caching with `next: { revalidate: N }`

See [src/lib/api.ts](src/lib/api.ts#L45-L64) for error handling implementation.

---

## 🚀 Next Steps for Unused Endpoints

To fully utilize implemented endpoints:

1. **`analyzeAirdrop()`** - Wire up when user views airdrop details
2. **`updateTask()`** - Add client-side task completion UI
3. **`grantXp()`** - Grant XP for milestone achievements
4. **`ensureChecklist()`** - Auto-provision checklist when opening airdrop
5. **`sendNotification()`** - Send alerts for important events
