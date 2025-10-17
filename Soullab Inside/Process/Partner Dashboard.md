# Partner Dashboard

> *All active partnerships at a glance*

---

## Active Partners

```dataview
TABLE
  Status as "Status",
  Phase as "Phase",
  element_mix as "Elements"
FROM "Partners"
WHERE Status != "⚪ Archive"
SORT Status ASC, file.name ASC
```

---

## By Phase

### 🔸 Intake
```dataview
LIST
FROM "Partners"
WHERE contains(Status, "🔸")
SORT file.name
```

### 🟡 Listening
```dataview
LIST
FROM "Partners"
WHERE contains(Status, "🟡")
SORT file.name
```

### 🟢 Sketch
```dataview
LIST
FROM "Partners"
WHERE contains(Status, "🟢")
SORT file.name
```

### 🔵 Build
```dataview
LIST
FROM "Partners"
WHERE contains(Status, "🔵")
SORT file.name
```

### 🟣 Live
```dataview
LIST
FROM "Partners"
WHERE contains(Status, "🟣")
SORT file.name
```

---

## Recent Submissions

```dataview
TABLE
  submitted_at as "Submitted",
  element_mix as "Elements"
FROM "Partners"
WHERE submitted_at
SORT submitted_at DESC
LIMIT 5
```

---

## Archive

```dataview
LIST
FROM "Partners"
WHERE contains(Status, "⚪")
SORT file.name
```

---

**Note:** This dashboard requires the Dataview plugin to be installed and enabled.

To use:
1. Install Dataview from Community Plugins
2. Enable it in Settings
3. Refresh this note

The queries will automatically populate with your partner notes as you add them.
