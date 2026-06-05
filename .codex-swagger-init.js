
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/api": {
        "get": {
          "description": "Returns the static hello string. Useful as a smoke test that the API is reachable.",
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "string",
                    "example": "Hello World!"
                  }
                }
              }
            }
          },
          "summary": "Service banner",
          "tags": [
            "health"
          ]
        }
      },
      "/api/health": {
        "get": {
          "description": "Lightweight health check (no DB I/O). Safe to hit from load balancers and container probes.",
          "operationId": "AppController_health",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/HealthDto"
                  }
                }
              }
            }
          },
          "summary": "Liveness probe",
          "tags": [
            "health"
          ]
        }
      },
      "/api/auth/telegram": {
        "post": {
          "description": "Verifies the HMAC signature of the supplied `initData` against `TELEGRAM_BOT_TOKEN`, then upserts the corresponding user. This is the only endpoint that performs identity verification — call it once on Mini App load and persist the returned user ID.",
          "operationId": "AuthController_telegram",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/TelegramAuthDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/TelegramAuthResponseDto"
                  }
                }
              }
            },
            "401": {
              "description": "initData missing, malformed, or HMAC verification failed."
            }
          },
          "summary": "Authenticate a Telegram Mini App user",
          "tags": [
            "auth"
          ]
        }
      },
      "/api/user/{id}": {
        "get": {
          "description": "Returns the user record plus the joined `UserStats` (XP, level, streak, badges).",
          "operationId": "UsersController_get",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User ID (CUID)",
              "schema": {
                "example": "ckxk7g2v90000abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserWithStatsDto"
                  }
                }
              }
            },
            "404": {
              "description": "No user with the given ID."
            }
          },
          "summary": "Fetch a user profile",
          "tags": [
            "users"
          ]
        }
      },
      "/api/user/{id}/wallet": {
        "post": {
          "description": "Persists a wallet address against a user record without performing on-chain signature verification. For production-grade Web3 sign-in, use `POST /wallet/connect` instead.",
          "operationId": "UsersController_attachWallet",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "User ID (CUID)",
              "schema": {
                "example": "ckxk7g2v90000abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AttachWalletDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDto"
                  }
                }
              }
            }
          },
          "summary": "Attach a wallet to a user (Mini App bridge)",
          "tags": [
            "users"
          ]
        }
      },
      "/api/airdrops": {
        "get": {
          "description": "Returns airdrops aggregated from all upstream sources, newest first. Capped at 100 per page.",
          "operationId": "AirdropsController_list",
          "parameters": [
            {
              "name": "take",
              "required": false,
              "in": "query",
              "description": "Page size (max 100).",
              "schema": {
                "minimum": 1,
                "maximum": 100,
                "default": 50,
                "example": 50,
                "type": "number"
              }
            },
            {
              "name": "skip",
              "required": false,
              "in": "query",
              "description": "Offset for pagination.",
              "schema": {
                "minimum": 0,
                "default": 0,
                "example": 0,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/AirdropDto"
                    }
                  }
                }
              }
            }
          },
          "summary": "List airdrops",
          "tags": [
            "airdrops"
          ]
        }
      },
      "/api/airdrops/{id}": {
        "get": {
          "description": "Returns a single airdrop including its most recent SecurityReport (if any).",
          "operationId": "AirdropsController_get",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "description": "Airdrop ID (CUID)",
              "schema": {
                "example": "ckxk7g2v90100abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AirdropDto"
                  }
                }
              }
            },
            "404": {
              "description": "No airdrop with the given ID."
            }
          },
          "summary": "Fetch an airdrop by ID",
          "tags": [
            "airdrops"
          ]
        }
      },
      "/api/security/analyze-airdrop": {
        "post": {
          "description": "Combines domain reputation (WHOIS / SSL / phishing lists), contract checks (verified, holder distribution), and social-signal heuristics to produce a `SecurityReportOutput`. If `airdropId` is provided, the report is persisted and the cached `trustScore` on the parent `Airdrop` is updated. A high-risk verdict additionally emits `AIRDROP_FLAGGED` so the notifications module can warn affected users.",
          "operationId": "SecurityController_analyzeAirdrop",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnalyzeAirdropDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SecurityReportOutputDto"
                  }
                }
              }
            }
          },
          "summary": "Analyse an airdrop for scam risk",
          "tags": [
            "security"
          ]
        }
      },
      "/api/security/analyze-wallet": {
        "post": {
          "description": "Convenience wrapper around `GET /wallet/:address/analysis` that accepts a JSON body. Same response shape and caching.",
          "operationId": "SecurityController_analyzeWallet",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AnalyzeWalletDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/WalletAnalysisDto"
                  }
                }
              }
            }
          },
          "summary": "Analyse a wallet for risk",
          "tags": [
            "security"
          ]
        }
      },
      "/api/wallet/connect": {
        "post": {
          "description": "Persists the wallet address against the user. Production deployments should additionally verify a WalletConnect signature challenge before calling this endpoint; the hackathon trusts the Mini App-bridged address.",
          "operationId": "WalletController_connect",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/WalletConnectDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserDto"
                  }
                }
              }
            }
          },
          "summary": "Connect a wallet to a user",
          "tags": [
            "wallet"
          ]
        }
      },
      "/api/wallet/{address}/analysis": {
        "get": {
          "description": "Inspects token approvals, contract interactions and flagged-address lists to produce a wallet health score and actionable recommendations. Heavy upstream calls are cached; expect ~1-3s latency on cold lookups.",
          "operationId": "WalletController_analyze",
          "parameters": [
            {
              "name": "address",
              "required": true,
              "in": "path",
              "description": "EVM wallet address",
              "schema": {
                "example": "0x742d35Cc6634C0532925a3b844Bc9e7595f0BEb0",
                "type": "string"
              }
            },
            {
              "name": "chain",
              "required": false,
              "in": "query",
              "description": "Chain identifier; defaults to `eth`.",
              "schema": {
                "enum": [
                  "eth",
                  "bsc",
                  "polygon",
                  "arbitrum",
                  "optimism",
                  "base"
                ],
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/WalletAnalysisDto"
                  }
                }
              }
            }
          },
          "summary": "Analyse a wallet for risk",
          "tags": [
            "wallet"
          ]
        }
      },
      "/api/crypto/price/{coinId}": {
        "get": {
          "description": "Returns the spot price for `coinId` in the requested quote currency. Results are cached in-memory for 60s. Returns `value: null` if the upstream call fails; the request never errors.",
          "operationId": "CryptoController_price",
          "parameters": [
            {
              "name": "coinId",
              "required": true,
              "in": "path",
              "description": "CoinGecko coin id",
              "schema": {
                "example": "ethereum",
                "type": "string"
              }
            },
            {
              "name": "vs",
              "required": false,
              "in": "query",
              "description": "Quote currency (`usd`, `eur`, `btc`, …). Defaults to `usd`.",
              "schema": {
                "example": "usd",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/PriceResponseDto"
                  }
                }
              }
            }
          },
          "summary": "Fetch a coin price (CoinGecko)",
          "tags": [
            "crypto"
          ]
        }
      },
      "/api/crypto/trending": {
        "get": {
          "description": "Returns the top trending coins. Empty array on upstream failure — never errors.",
          "operationId": "CryptoController_trending",
          "parameters": [],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/TrendingCoinDto"
                    }
                  }
                }
              }
            }
          },
          "summary": "Currently trending coins (CoinGecko)",
          "tags": [
            "crypto"
          ]
        }
      },
      "/api/tasks/{userId}": {
        "get": {
          "description": "Returns every airdrop task assigned to a user across all airdrops, with the parent airdrop’s name and deadline joined in.",
          "operationId": "TasksController_list",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "description": "User ID (CUID)",
              "schema": {
                "example": "ckxk7g2v90000abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/AirdropTaskDto"
                    }
                  }
                }
              }
            }
          },
          "summary": "List a user’s tasks",
          "tags": [
            "tasks"
          ]
        }
      },
      "/api/tasks/update": {
        "post": {
          "description": "Either field is optional. Transitioning `status` to `completed` stamps `completedAt` and emits `TASK_COMPLETED` (which the gamification module listens to for XP grants).",
          "operationId": "TasksController_update",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateTaskDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/AirdropTaskDto"
                  }
                }
              }
            }
          },
          "summary": "Update a task’s status or progress",
          "tags": [
            "tasks"
          ]
        }
      },
      "/api/tasks/checklist": {
        "post": {
          "description": "Idempotent — if any tasks already exist for the (userId, airdropId) pair, the existing rows are returned unchanged. Otherwise the default task template is created.",
          "operationId": "TasksController_ensureChecklist",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/EnsureChecklistDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/AirdropTaskDto"
                    }
                  }
                }
              }
            }
          },
          "summary": "Provision the default checklist for a user/airdrop pair",
          "tags": [
            "tasks"
          ]
        }
      },
      "/api/user/stats": {
        "get": {
          "description": "Returns `UserStats` (xp, level, streak, badges, lastActiveAt). Returns 200 with `null` if the user has no stats row yet.",
          "operationId": "GamificationController_stats",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "query",
              "description": "User ID (CUID) to fetch stats for.",
              "schema": {
                "example": "ckxk7g2v90000abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "May be `null` if the user has not earned any XP yet.",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserStatsDto"
                  }
                }
              }
            }
          },
          "summary": "Fetch a user’s gamification stats",
          "tags": [
            "gamification"
          ]
        }
      },
      "/api/user/xp/update": {
        "post": {
          "description": "Adds (or subtracts) XP, recomputes level and streak, and awards badges as thresholds are crossed: `DAILY_GRINDER` (7-day streak), `SECURITY_EXPERT` (level 10), `VERIFIED_EXPLORER` (1 completed task), `AIRDROP_MASTER` (25 completed tasks). Typically called internally via the `TASK_COMPLETED` event listener — direct use is for admin/debug.",
          "operationId": "GamificationController_addXp",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddXpDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/UserStatsDto"
                  }
                }
              }
            }
          },
          "summary": "Grant XP to a user",
          "tags": [
            "gamification"
          ]
        }
      },
      "/api/leaderboard": {
        "get": {
          "description": "Top users by XP (descending), ties broken by streak. Each row includes a thin user summary (`username`, `referralCode`).",
          "operationId": "GamificationController_leaderboard",
          "parameters": [
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Max rows (default 20, max 200).",
              "schema": {
                "example": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "array",
                    "items": {
                      "$ref": "#/components/schemas/LeaderboardEntryDto"
                    }
                  }
                }
              }
            }
          },
          "summary": "XP leaderboard",
          "tags": [
            "gamification"
          ]
        }
      },
      "/api/notifications/send": {
        "post": {
          "description": "Creates a `Notification` row first (source of truth), then dispatches to Telegram. The row is updated to `status: sent` on success or `status: failed` with a reason on failure. Safe to retry on `ok: false`.",
          "operationId": "NotificationsController_send",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SendNotificationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/SendNotificationResponseDto"
                  }
                }
              }
            }
          },
          "summary": "Send a notification (persist-then-deliver)",
          "tags": [
            "notifications"
          ]
        }
      },
      "/api/referrals/{userId}": {
        "get": {
          "description": "Returns every `Referral` record where the user is the referrer, plus a total count. Each row hydrates a thin view of the referred user (`username`, `createdAt`).",
          "operationId": "ReferralsController_forUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "description": "User ID (CUID)",
              "schema": {
                "example": "ckxk7g2v90000abcd1234efgh",
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "",
              "content": {
                "application/json": {
                  "schema": {
                    "$ref": "#/components/schemas/ReferralsResponseDto"
                  }
                }
              }
            }
          },
          "summary": "List referrals attributed to a user",
          "tags": [
            "referrals"
          ]
        }
      }
    },
    "info": {
      "title": "SwiftyDrop Guard API",
      "description": "Backend API powering the SwiftyDrop Guard Telegram Mini App.\n\n**Modules:**\n- `auth` — Telegram WebApp initData verification\n- `users` — user profile & wallet attachment\n- `airdrops` — aggregated airdrop catalogue\n- `security` — airdrop & wallet risk analysis\n- `wallet` — health score, dangerous approvals, suspicious contracts\n- `tasks` — per-user airdrop checklist\n- `gamification` — XP, levels, streaks, badges, leaderboard\n- `referrals` — referral graph & reward grants\n- `crypto` — CoinGecko price & trending lookups\n- `notifications` — Telegram delivery with persist-then-send\n\n**Auth:** the only authenticated endpoint is `POST /auth/telegram` (validates Telegram WebApp `initData` HMAC). All other endpoints currently accept `userId`/`address` directly in the body or path; the frontend is expected to scope calls to the signed-in user.\n\n**Base URL:** all routes are prefixed with `/api`.",
      "version": "0.0.1",
      "contact": {}
    },
    "tags": [
      {
        "name": "auth",
        "description": "Telegram Mini App authentication"
      },
      {
        "name": "users",
        "description": "User profile & wallet"
      },
      {
        "name": "airdrops",
        "description": "Airdrop catalogue"
      },
      {
        "name": "security",
        "description": "Risk analysis for airdrops & wallets"
      },
      {
        "name": "wallet",
        "description": "Wallet health & approval analysis"
      },
      {
        "name": "tasks",
        "description": "Per-user airdrop task lists"
      },
      {
        "name": "gamification",
        "description": "XP, levels, streaks, badges"
      },
      {
        "name": "referrals",
        "description": "Referral graph"
      },
      {
        "name": "crypto",
        "description": "CoinGecko price feeds"
      },
      {
        "name": "notifications",
        "description": "Telegram notifications"
      },
      {
        "name": "health",
        "description": "Liveness probes"
      }
    ],
    "servers": [
      {
        "url": "http://localhost:10000",
        "description": "Local dev"
      }
    ],
    "components": {
      "schemas": {
        "HealthDto": {
          "type": "object",
          "properties": {
            "status": {
              "type": "string",
              "example": "ok"
            },
            "service": {
              "type": "string",
              "example": "swiftydrop-guard-backend"
            },
            "ts": {
              "type": "string",
              "description": "ISO-8601 timestamp",
              "example": "2026-05-27T21:42:00.000Z"
            }
          },
          "required": [
            "status",
            "service",
            "ts"
          ]
        },
        "TelegramAuthDto": {
          "type": "object",
          "properties": {
            "initData": {
              "type": "string",
              "description": "Raw `window.Telegram.WebApp.initData` string from the Mini App. The server verifies its HMAC against `TELEGRAM_BOT_TOKEN`.",
              "example": "query_id=AAH...&user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Satoshi%22%7D&auth_date=1716798000&hash=abc123..."
            }
          },
          "required": [
            "initData"
          ]
        },
        "UserDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Internal CUID",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "telegramId": {
              "type": "string",
              "description": "Telegram numeric user ID, stringified",
              "example": "123456789"
            },
            "username": {
              "type": "object",
              "description": "Telegram @username (without @)",
              "example": "satoshi",
              "nullable": true
            },
            "walletAddress": {
              "type": "object",
              "description": "EVM wallet address (lowercased)",
              "example": "0x742d35cc6634c0532925a3b844bc9e7595f0beb0",
              "nullable": true
            },
            "referralCode": {
              "type": "string",
              "description": "Short opaque referral code",
              "example": "A1B2C3D4"
            },
            "referredById": {
              "type": "object",
              "description": "ID of the user who referred this user, if any",
              "example": "ckxk7g2v90001abcd1234efgh",
              "nullable": true
            },
            "createdAt": {
              "type": "string",
              "description": "When the user was first seen (ISO-8601)",
              "example": "2026-05-20T10:00:00.000Z"
            }
          },
          "required": [
            "id",
            "telegramId",
            "referralCode",
            "createdAt"
          ]
        },
        "TelegramAuthResponseDto": {
          "type": "object",
          "properties": {
            "user": {
              "description": "The user record matching the Telegram identity (created on first sign-in).",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserDto"
                }
              ]
            }
          },
          "required": [
            "user"
          ]
        },
        "UserStatsDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "Foreign key to the owning user",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "xp": {
              "type": "number",
              "description": "Total XP earned",
              "example": 1250,
              "minimum": 0
            },
            "streak": {
              "type": "number",
              "description": "Current daily streak (consecutive days active)",
              "example": 7,
              "minimum": 0
            },
            "level": {
              "type": "number",
              "description": "Computed level from XP",
              "example": 4,
              "minimum": 1
            },
            "badges": {
              "description": "Badge keys earned by the user",
              "example": [
                "DAILY_GRINDER",
                "VERIFIED_EXPLORER"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "lastActiveAt": {
              "type": "string",
              "description": "Last time the user took an XP-earning action (ISO-8601)",
              "example": "2026-05-27T21:42:00.000Z"
            }
          },
          "required": [
            "userId",
            "xp",
            "streak",
            "level",
            "badges",
            "lastActiveAt"
          ]
        },
        "UserWithStatsDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Internal CUID",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "telegramId": {
              "type": "string",
              "description": "Telegram numeric user ID, stringified",
              "example": "123456789"
            },
            "username": {
              "type": "object",
              "description": "Telegram @username (without @)",
              "example": "satoshi",
              "nullable": true
            },
            "walletAddress": {
              "type": "object",
              "description": "EVM wallet address (lowercased)",
              "example": "0x742d35cc6634c0532925a3b844bc9e7595f0beb0",
              "nullable": true
            },
            "referralCode": {
              "type": "string",
              "description": "Short opaque referral code",
              "example": "A1B2C3D4"
            },
            "referredById": {
              "type": "object",
              "description": "ID of the user who referred this user, if any",
              "example": "ckxk7g2v90001abcd1234efgh",
              "nullable": true
            },
            "createdAt": {
              "type": "string",
              "description": "When the user was first seen (ISO-8601)",
              "example": "2026-05-20T10:00:00.000Z"
            },
            "stats": {
              "nullable": true,
              "type": "object",
              "allOf": [
                {
                  "$ref": "#/components/schemas/UserStatsDto"
                }
              ]
            }
          },
          "required": [
            "id",
            "telegramId",
            "referralCode",
            "createdAt"
          ]
        },
        "AttachWalletDto": {
          "type": "object",
          "properties": {
            "address": {
              "type": "string",
              "description": "EVM wallet address (0x-prefixed, 42 chars). Will be lowercased before persistence.",
              "example": "0x742d35Cc6634C0532925a3b844Bc9e7595f0BEb0"
            }
          },
          "required": [
            "address"
          ]
        },
        "AirdropDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "ckxk7g2v90100abcd1234efgh"
            },
            "externalId": {
              "type": "string",
              "description": "Source-scoped external identifier (unique)",
              "example": "cryptorank:zksync-launch"
            },
            "name": {
              "type": "string",
              "example": "zkSync Airdrop"
            },
            "description": {
              "type": "object",
              "example": "Long-form description of the campaign.",
              "nullable": true
            },
            "rewardEstimate": {
              "type": "object",
              "example": "$50-$500",
              "nullable": true
            },
            "deadline": {
              "type": "object",
              "example": "2026-06-30T23:59:59.000Z",
              "nullable": true
            },
            "category": {
              "type": "object",
              "example": "L2",
              "nullable": true
            },
            "trustScore": {
              "type": "object",
              "description": "Cached trust score (0-100) from the most recent SecurityReport",
              "example": 78,
              "minimum": 0,
              "maximum": 100,
              "nullable": true
            },
            "difficulty": {
              "type": "object",
              "example": "medium",
              "nullable": true
            },
            "socialLinks": {
              "type": "object",
              "description": "Free-form social/contract links (key ? URL)",
              "example": {
                "twitter": "https://x.com/zksync",
                "website": "https://zksync.io"
              },
              "additionalProperties": {
                "type": "string"
              }
            },
            "source": {
              "type": "string",
              "description": "Origin aggregator name",
              "example": "cryptorank"
            },
            "createdAt": {
              "type": "string",
              "example": "2026-05-20T10:00:00.000Z"
            }
          },
          "required": [
            "id",
            "externalId",
            "name",
            "socialLinks",
            "source",
            "createdAt"
          ]
        },
        "AnalyzeAirdropDto": {
          "type": "object",
          "properties": {
            "domain": {
              "type": "string",
              "description": "Project domain. Used for WHOIS / SSL / phishing-list checks.",
              "example": "zksync.io"
            },
            "contractAddress": {
              "type": "string",
              "description": "Token / project contract address.",
              "example": "0x32400084c286cf3e17e7b677ea9583e60a000324"
            },
            "chain": {
              "type": "string",
              "enum": [
                "eth",
                "bsc",
                "polygon",
                "arbitrum",
                "optimism",
                "base"
              ],
              "example": "eth",
              "description": "Chain hint for the contract lookup."
            },
            "tokenInfo": {
              "type": "object",
              "description": "Free-form token metadata (holder distribution, top-holder pct, etc.). Forwarded to GoPlus / heuristics.",
              "additionalProperties": true,
              "example": {
                "holders": 1240,
                "topHolderPct": 12.4
              }
            },
            "walletBehavior": {
              "type": "object",
              "description": "Optional on-chain behaviour summary for the contract deployer.",
              "additionalProperties": true,
              "example": {
                "txCount": 832,
                "ageDays": 412
              }
            },
            "socialLinks": {
              "type": "object",
              "description": "Project social links (key ? URL).",
              "additionalProperties": {
                "type": "string"
              },
              "example": {
                "twitter": "https://x.com/zksync",
                "discord": "https://discord.gg/zksync"
              }
            },
            "airdropId": {
              "type": "string",
              "description": "When provided, the SecurityReport is denormalized onto the Airdrop (`trustScore` field) and a high-risk verdict emits `AIRDROP_FLAGGED`.",
              "example": "ckxk7g2v90100abcd1234efgh"
            }
          }
        },
        "SecurityReportOutputDto": {
          "type": "object",
          "properties": {
            "trust_score": {
              "type": "number",
              "description": "Composite trust score 0-100.",
              "example": 78,
              "minimum": 0,
              "maximum": 100
            },
            "scam_probability": {
              "type": "number",
              "description": "Composite scam probability 0-100.",
              "example": 14,
              "minimum": 0,
              "maximum": 100
            },
            "risk_level": {
              "type": "string",
              "enum": [
                "low",
                "medium",
                "high"
              ],
              "example": "low"
            },
            "warnings": {
              "description": "Concrete red-flag findings.",
              "example": [
                "contract_not_verified"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "recommendation": {
              "type": "string",
              "description": "One-line guidance for the end user.",
              "example": "Looks legitimate. Proceed with caution; never approve unlimited spend."
            },
            "explanation": {
              "type": "string",
              "description": "Long-form explanation citing each signal.",
              "example": "Domain registered 412 days ago, contract verified on Etherscan, 12k+ unique holders…"
            }
          },
          "required": [
            "trust_score",
            "scam_probability",
            "risk_level",
            "warnings",
            "recommendation",
            "explanation"
          ]
        },
        "AnalyzeWalletDto": {
          "type": "object",
          "properties": {
            "address": {
              "type": "string",
              "description": "EVM wallet address to analyse.",
              "example": "0x742d35Cc6634C0532925a3b844Bc9e7595f0BEb0"
            },
            "chain": {
              "type": "string",
              "enum": [
                "eth",
                "bsc",
                "polygon",
                "arbitrum",
                "optimism",
                "base"
              ],
              "example": "eth",
              "default": "eth"
            }
          },
          "required": [
            "address"
          ]
        },
        "DangerousApprovalDto": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "description": "Token contract address",
              "example": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
            },
            "spender": {
              "type": "string",
              "description": "Spender address granted unlimited allowance",
              "example": "0xabcdef0123456789abcdef0123456789abcdef01"
            }
          },
          "required": [
            "token",
            "spender"
          ]
        },
        "WalletAnalysisDto": {
          "type": "object",
          "properties": {
            "wallet_health_score": {
              "type": "number",
              "description": "Composite wallet health (0-100). Higher is healthier.",
              "example": 72,
              "minimum": 0,
              "maximum": 100
            },
            "risk_indicators": {
              "description": "Human-readable risk indicators surfaced by heuristics.",
              "example": [
                "unlimited_approvals_detected"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dangerous_approvals": {
              "description": "Open infinite/large approvals.",
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DangerousApprovalDto"
              }
            },
            "suspicious_contracts": {
              "description": "Contract addresses present in a known phishing/exploit list.",
              "example": [],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "recommendations": {
              "description": "Actionable user-facing recommendations.",
              "example": [
                "Revoke unlimited approvals for token 0x1f98… on Etherscan"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "wallet_health_score",
            "risk_indicators",
            "dangerous_approvals",
            "suspicious_contracts",
            "recommendations"
          ]
        },
        "WalletConnectDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "User ID (CUID)",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "address": {
              "type": "string",
              "description": "EVM wallet address (0x-prefixed). Bridged from the Telegram Mini App; production deployments should also verify a WalletConnect signature.",
              "example": "0x742d35Cc6634C0532925a3b844Bc9e7595f0BEb0"
            }
          },
          "required": [
            "userId",
            "address"
          ]
        },
        "PriceResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "CoinGecko coin id (echoed back).",
              "example": "ethereum"
            },
            "vs": {
              "type": "string",
              "description": "Quote currency (echoed back).",
              "example": "usd"
            },
            "value": {
              "type": "number",
              "description": "Quoted price, or null on upstream failure.",
              "example": 3245.12,
              "nullable": true
            }
          },
          "required": [
            "id",
            "vs",
            "value"
          ]
        },
        "TrendingCoinDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "pepe"
            },
            "name": {
              "type": "string",
              "example": "Pepe"
            },
            "symbol": {
              "type": "string",
              "example": "PEPE"
            }
          },
          "required": [
            "id",
            "name",
            "symbol"
          ]
        },
        "AirdropTaskDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "ckxk7g2v90200abcd1234efgh"
            },
            "airdropId": {
              "type": "string",
              "description": "FK to Airdrop",
              "example": "ckxk7g2v90100abcd1234efgh"
            },
            "userId": {
              "type": "string",
              "description": "FK to User",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "label": {
              "type": "string",
              "example": "Bridge funds to L2"
            },
            "status": {
              "type": "string",
              "description": "Lifecycle status",
              "enum": [
                "pending",
                "in_progress",
                "completed"
              ],
              "example": "in_progress"
            },
            "progress": {
              "type": "number",
              "description": "Progress %, 0-100",
              "example": 40,
              "minimum": 0,
              "maximum": 100
            },
            "completedAt": {
              "type": "object",
              "example": "2026-05-25T12:34:56.000Z",
              "nullable": true
            },
            "createdAt": {
              "type": "string",
              "example": "2026-05-20T10:00:00.000Z"
            }
          },
          "required": [
            "id",
            "airdropId",
            "userId",
            "label",
            "status",
            "progress",
            "createdAt"
          ]
        },
        "UpdateTaskDto": {
          "type": "object",
          "properties": {
            "taskId": {
              "type": "string",
              "description": "Task ID",
              "example": "ckxk7g2v90200abcd1234efgh"
            },
            "status": {
              "type": "string",
              "description": "New lifecycle status. Setting to `completed` stamps `completedAt` and emits `TASK_COMPLETED`.",
              "enum": [
                "pending",
                "in_progress",
                "completed"
              ],
              "example": "completed"
            },
            "progress": {
              "type": "number",
              "description": "Progress percentage (0-100). Independent of `status`.",
              "example": 100,
              "minimum": 0,
              "maximum": 100
            }
          },
          "required": [
            "taskId"
          ]
        },
        "EnsureChecklistDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "airdropId": {
              "type": "string",
              "example": "ckxk7g2v90100abcd1234efgh"
            }
          },
          "required": [
            "userId",
            "airdropId"
          ]
        },
        "AddXpDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "amount": {
              "type": "number",
              "description": "XP to add (may be negative to deduct). Recomputes level, streak and badges.",
              "example": 50
            }
          },
          "required": [
            "userId",
            "amount"
          ]
        },
        "LeaderboardUserSummaryDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "object",
              "example": "satoshi",
              "nullable": true
            },
            "referralCode": {
              "type": "string",
              "example": "A1B2C3D4"
            }
          },
          "required": [
            "username",
            "referralCode"
          ]
        },
        "LeaderboardEntryDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "Foreign key to the owning user",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "xp": {
              "type": "number",
              "description": "Total XP earned",
              "example": 1250,
              "minimum": 0
            },
            "streak": {
              "type": "number",
              "description": "Current daily streak (consecutive days active)",
              "example": 7,
              "minimum": 0
            },
            "level": {
              "type": "number",
              "description": "Computed level from XP",
              "example": 4,
              "minimum": 1
            },
            "badges": {
              "description": "Badge keys earned by the user",
              "example": [
                "DAILY_GRINDER",
                "VERIFIED_EXPLORER"
              ],
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "lastActiveAt": {
              "type": "string",
              "description": "Last time the user took an XP-earning action (ISO-8601)",
              "example": "2026-05-27T21:42:00.000Z"
            },
            "user": {
              "$ref": "#/components/schemas/LeaderboardUserSummaryDto"
            }
          },
          "required": [
            "userId",
            "xp",
            "streak",
            "level",
            "badges",
            "lastActiveAt",
            "user"
          ]
        },
        "SendNotificationDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "string",
              "description": "Recipient user ID",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "type": {
              "type": "string",
              "description": "Notification category — drives styling/grouping in the client.",
              "enum": [
                "new_airdrop",
                "deadline_alert",
                "scam_warning",
                "wallet_risk",
                "task_update"
              ],
              "example": "deadline_alert"
            },
            "title": {
              "type": "string",
              "description": "Short headline (= 120 chars).",
              "example": "Bridge before midnight!",
              "maxLength": 120
            },
            "body": {
              "type": "string",
              "description": "Body text. Markdown rendered as Telegram MarkdownV2.",
              "example": "The zkSync campaign closes in 2 hours. Tap to finish your checklist.",
              "maxLength": 1000
            }
          },
          "required": [
            "userId",
            "type",
            "title",
            "body"
          ]
        },
        "SendNotificationResponseDto": {
          "type": "object",
          "properties": {
            "ok": {
              "type": "boolean",
              "description": "`true` when both persistence and Telegram delivery succeeded.",
              "example": true
            },
            "id": {
              "type": "string",
              "description": "Notification row ID.",
              "example": "ckxk7g2v90400abcd1234efgh"
            },
            "reason": {
              "type": "string",
              "description": "When `ok=false`, why it failed (e.g. `user_not_found`, `telegram_send_failed`).",
              "example": "telegram_send_failed"
            }
          },
          "required": [
            "ok"
          ]
        },
        "ReferredUserSummaryDto": {
          "type": "object",
          "properties": {
            "username": {
              "type": "object",
              "example": "satoshi",
              "nullable": true
            },
            "createdAt": {
              "type": "string",
              "example": "2026-05-20T10:00:00.000Z"
            }
          },
          "required": [
            "createdAt"
          ]
        },
        "ReferralDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "example": "ckxk7g2v90300abcd1234efgh"
            },
            "referrerId": {
              "type": "string",
              "description": "User who owns the referral code.",
              "example": "ckxk7g2v90000abcd1234efgh"
            },
            "referredUserId": {
              "type": "string",
              "description": "User who signed up via the code.",
              "example": "ckxk7g2v90001abcd1234efgh"
            },
            "rewardGranted": {
              "type": "boolean",
              "description": "Whether the XP reward for this referral has been granted.",
              "example": true
            },
            "createdAt": {
              "type": "string",
              "example": "2026-05-21T11:00:00.000Z"
            },
            "referredUser": {
              "$ref": "#/components/schemas/ReferredUserSummaryDto"
            }
          },
          "required": [
            "id",
            "referrerId",
            "referredUserId",
            "rewardGranted",
            "createdAt",
            "referredUser"
          ]
        },
        "ReferralsResponseDto": {
          "type": "object",
          "properties": {
            "count": {
              "type": "number",
              "description": "Number of referrals attributed to this user.",
              "example": 3,
              "minimum": 0
            },
            "referrals": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ReferralDto"
              }
            }
          },
          "required": [
            "count",
            "referrals"
          ]
        }
      }
    }
  },
  "customOptions": {
    "persistAuthorization": true
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}

