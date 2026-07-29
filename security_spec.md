# Security Specification & Test Suite

## 1. Data Invariants
- `users`: Users can read and write their own user profile document (`/users/{userId}`).
- `chats`: Users can read, create, update, and delete only chats where `userId` matches their authenticated user ID or email.

## 2. Dirty Dozen Test Payloads
1. Unauthenticated write to `/users/{userId}` -> REJECT
2. Unauthenticated create to `/chats/{chatId}` -> REJECT
3. User A updating User B's `/chats/{chatId}` document -> REJECT
4. Creating a chat document with oversized prompt (> 1000 chars) -> REJECT
5. Creating a chat document with an invalid or malicious document ID -> REJECT
6. Modifying another user's profile PII at `/users/{userId}` -> REJECT
7. User attempting to delete another user's chat -> REJECT
8. Creating a chat without required `userId` field -> REJECT
9. Modifying immutable `userId` on existing chat document -> REJECT
10. Unauthenticated list query across `/chats` without user filtering -> REJECT
11. Injecting arbitrary system fields into chat document -> REJECT
12. Creating a user document with mismatched `id` -> REJECT
