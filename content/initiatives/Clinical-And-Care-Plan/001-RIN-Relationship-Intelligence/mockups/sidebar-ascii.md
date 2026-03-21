# RIN Sidebar — ASCII Mockups

These mockups show the key states of the Relationship Intelligence sidebar. Reference alongside `design.md` and `spec.md`.

---

## 1. Full Three-Column Layout (Sidebar Expanded, Calling Client)

```
+------------------+----------------------------------------+--------------------+
| PACKAGE SIDEBAR  |              TAB CONTENT               |   RIN SIDEBAR      |
| (existing left)  |                                        |   (new right)      |
|                  |  [Overview] [Notes] [Bills] [Incidents] |                    |
|  Margaret Wilson |  [Risks] [Tasks] [Care Circle] [Comms] | [*] Margaret Wilson|
|  TC-2847         |  [Documents] [Timeline] [Needs]        |     (Client)   [+] |
|                  |                                        |                    |
|  Care Partner    | +------------------------------------+ | Calling: [Client v]|
|  Levi Thompson   | |                                    | |                    |
|                  | |        Currently viewing:           | |----- ALERTS ------+|
|  Package Level   | |        Bills tab content            | | ! 2 bills on hold  |
|  Level 4         | |                                    | | ! 1 complaint      |
|                  | |                                    | |                    |
|  Funding         | |                                    | |-- TALKING POINTS --+|
|  $52,428/yr      | |                                    | |                    |
|  ####-----  63%  | |                                    | | "How's the garden  |
|                  | |                                    | |  going — are the   |
|  MYOB: Linked    | |                                    | |  tomatoes coming    |
|                  | |                                    | |  along?"           |
|  Demographics    | |                                    | |                    |
|  DOB: 15/03/1941 | |                                    | | "Did the grandkids |
|  Age: 84         | |                                    | |  make it down on   |
|  State: NSW      | |                                    | |  the weekend?"     |
|  TZ: AEST        | |                                    | |                    |
|                  | |                                    | | + Add a talking    |
|  Contact         | |                                    | |   point            |
|  Ph: 02 9876 543 | |                                    | |                    |
|  Rep: John Wilson| |                                    | |-- PERSONAL --------+|
|                  | |                                    | |                    |
|  Actions         | |                                    | | Interests          |
|  [Edit Profile]  | |                                    | | [Gardening]        |
|  [View Care Plan]| |                                    | | [Swans supporter]  |
|                  | |                                    | |                    |
|                  | |                                    | | Family             |
|                  | |                                    | | [Grandkids Sun]    |
|                  | |                                    | | [Daughter: Sarah]  |
|                  | |                                    | |                    |
|                  | |                                    | | [+ Add]            |
|                  | |                                    | |                    |
|                  | |                                    | |-- NOTES -----------+|
|                  | |                                    | | > Discussed bill   |
|                  | |                                    | |   hold — waiting   |
|                  | |                                    | |   on provider...   |
|                  | |                                    | |   — Levi, 2 Mar    |
|                  | |                                    | |                    |
|                  | |                                    | | [Type a note...]   |
|                  | |                                    | |                    |
|                  | |                                    | |-- TOUCHPOINT ------+|
|                  | |                                    | | Last: 18 days ago  |
|                  | |                                    | | [*] Contacted      |
|                  | |                                    | |                    |
|                  | +------------------------------------+ | [Log Touchpoint]   |
+------------------+----------------------------------------+--------------------+
  ~240px                      flexible                          ~320px
```

---

## 2. Sidebar Collapsed (Trigger Strip)

```
+------------------+---------------------------------------------------+--+
| PACKAGE SIDEBAR  |              TAB CONTENT                          |  |
| (existing left)  |                                                   |  |
|                  |  [Overview] [Notes] [Bills] [Incidents] [Risks]   |[*]  <- green dot
|  Margaret Wilson |  [Tasks] [Care Circle] [Comms] [Documents]        | >|  <- expand arrow
|  TC-2847         |                                                   |  |
|                  | +-----------------------------------------------+ |  |
|  Care Partner    | |                                               | |  |
|  Levi Thompson   | |                                               | |  |
|                  | |        Full-width tab content                 | |  |
|  ...             | |        (more room when sidebar collapsed)     | |  |
|                  | |                                               | |  |
|                  | +-----------------------------------------------+ |  |
+------------------+---------------------------------------------------+--+
  ~240px                        flexible                             40px
```

**Badge colours:**
- `[*]` Green = contacted this month
- `[!]` Amber = day >20, not yet contacted
- `[!]` Red = missed this month AND previous month

---

## 3. Calling an Authorised Representative (Contact Toggle Switched)

```
+--------------------+
|  RIN SIDEBAR       |
|                    |
| [*] Margaret Wilson|
|     (Client)   [+] |
|                    |
| Calling:           |
| [ ] Client         |
| [x] John Wilson    |
|     (Auth Rep)     |
|                    |
|----- ALERTS -------+
| ! 2 bills on hold  |
| ! 1 complaint      |
|                    |
|-- NOTES -----------+
| > Discussed bill   |
|   hold — waiting   |
|   on provider...   |
|   — Levi, 2 Mar    |
|                    |
| [Type a note...]   |
|                    |
|-- TOUCHPOINT ------+
| Last: 18 days ago  |
| [!] Due soon       |
|                    |
| [Log Touchpoint]   |
+--------------------+

NOTE: Talking Points and Personal
Context sections are HIDDEN when
calling an auth rep. Only operational
content shows.
```

---

## 4. Empty State (New Client, No Personal Context)

```
+--------------------+
|  RIN SIDEBAR       |
|                    |
| [*] New Client     |
|                    |
| Calling: [Client v]|
|                    |
|----- ALERTS -------+
| No alerts          |
|                    |
|-- TALKING POINTS --+
|                    |
|  Add personal      |
|  context to unlock |
|  conversation      |
|  starters          |
|                    |
|  [+ Add Context]   |
|                    |
|-- PERSONAL --------+
|                    |
|  No personal       |
|  context yet —     |
|  add some to build |
|  rapport           |
|                    |
|  [+ Quick Add]     |
|                    |
|-- NOTES -----------+
| No notes yet       |
|                    |
| [Type a note...]   |
|                    |
|-- TOUCHPOINT ------+
| Never contacted    |
| [!] Overdue        |
|                    |
| [Log Touchpoint]   |
+--------------------+
```

---

## 5. Settings Popover (Gear Icon)

```
+--------------------+
|  RIN SIDEBAR  [*]  |
|                    |
| [*] Margaret Wilson|
|            +-------+--------+
|            | Sidebar Settings|
|            |                 |
|            | Section Order   |
|            | ( ) Personal    |
|            |     first       |
|            | (x) Operational |
|            |     first       |
|            |                 |
|            +-----------------+
```

---

## 6. Narrow Screen / Overlay Mode (<1280px)

```
+------------------+------------------------------------------+
| PACKAGE SIDEBAR  |              TAB CONTENT                 |
| (existing left)  |                                          |
|                  |  [Overview] [Notes] [Bills] [Incidents]  |
|  Margaret Wilson |                                          |
|                  | +--------------------------------------+ |
|                  | |                                      | |
|                  | |    Content area (full width)         | |
|                  | |                           +--------------------+
|                  | |                           |  RIN SIDEBAR       |
|                  | |                           |  (overlay/drawer)  |
|                  | |                           |                    |
|                  | |                           | Calling: [Client v]|
|                  | |                           |                    |
|                  | |                           | [same content as   |
|                  | |                           |  mockup #1 but     |
|                  | |                           |  as a slide-over   |
|                  | |                           |  drawer on top of  |
|                  | |                           |  the tab content]  |
|                  | |                           |                    |
|                  | |                           | [X] Close          |
|                  | +--------------------------------------+--------------------+
+------------------+------------------------------------------+
```

---

## 7. Log Touchpoint Form (Inline Expansion)

```
+--------------------+
|-- TOUCHPOINT ------+
| Last: 18 days ago  |
| [*] Contacted      |
|                    |
| v Log Touchpoint   |
| +----------------+ |
| | Date: [05/03]  | |
| |                | |
| | Type:          | |
| | (x) Phone Call | |
| | ( ) In-Person  | |
| | ( ) Video Call | |
| | ( ) Email      | |
| |                | |
| | Notes:         | |
| | [Discussed     | |
| |  garden reno,  | |
| |  grandkids     | |
| |  visiting...]  | |
| |                | |
| | [Save]  [Cancel]|
| +----------------+ |
+--------------------+
```

---

## 8. Compliance Dashboard (Separate Page)

```
+----------------------------------------------------------------------+
|  Touchpoint Compliance — March 2026                                  |
|                                                                       |
|  Coordinator: [All v]     Status: [All v]     Search: [_________]    |
|                                                                       |
+----------------------------------------------------------------------+
|  Client           | Last Contact  | Status         | Action          |
+-------------------+---------------+----------------+-----------------+
|  ! Dorothy Evans  | 14 Feb (19d)  | OVERDUE        | [Call] [Log]    |
|  ! Robert James   | 28 Feb (5d)   | NOT CONTACTED  | [Call] [Log]    |
|  ! Edna Walsh     | 01 Mar (4d)   | NOT CONTACTED  | [Call] [Log]    |
|  * Margaret Wilson| 15 Feb (18d)  | NOT CONTACTED  | [Call] [Log]    |
|    Patricia Chen  | 03 Mar (2d)   | CONTACTED      |                 |
|    William Hughes | 01 Mar (4d)   | CONTACTED      |                 |
|    ... 14 more    |               |                |                 |
+-------------------+---------------+----------------+-----------------+
|                                                                       |
|  Summary: 16/20 contacted (80%)  |  4 need attention                 |
+----------------------------------------------------------------------+

Legend:
  ! = Overdue (missed this + previous month) — RED
  * = Not contacted, day >20 — AMBER
  (blank) = Contacted this month — GREEN
```
