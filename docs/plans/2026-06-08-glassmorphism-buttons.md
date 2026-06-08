# Glassmorphism Buttons Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Update buttons to use glassmorphism effects (transparency + blur) while removing all shadows.

**Architecture:** Modify CSS utility classes in globals.css to use backdrop-filter and semi-transparent colors.

**Tech Stack:** CSS, Tailwind CSS (theming)

---

### Task 1: Update btn-primary in globals.css

**Files:**
- Modify: src/app/globals.css:118-137

**Step 1: Replace btn-primary styles**

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 28px;
  background: rgba(46, 236, 199, 0.1);
  backdrop-filter: blur(12px);
  color: var(--color-accent);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid var(--color-accent);
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}
.btn-primary:hover {
  background: rgba(46, 236, 199, 0.2);
  transform: translateY(-2px);
  border-color: #fff;
  color: #fff;
}
.btn-primary:active {
  transform: translateY(0);
  background: rgba(46, 236, 199, 0.3);
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "ui: update primary buttons to glassmorphism without shadows"
```

### Task 2: Update btn-secondary in globals.css

**Files:**
- Modify: src/app/globals.css:139-160

**Step 1: Replace btn-secondary styles**

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 11px 26px;
  background: rgba(123, 63, 191, 0.05);
  backdrop-filter: blur(12px);
  color: var(--color-text);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid rgba(123, 63, 191, 0.2);
  border-radius: 0px;
  cursor: pointer;
  transition: all 0.25s ease;
}
.btn-secondary:hover {
  border-color: var(--color-accent);
  background: rgba(123, 63, 191, 0.1);
  color: #fff;
}
.btn-secondary:active {
  background: rgba(123, 63, 191, 0.2);
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "ui: update secondary buttons to glassmorphism without shadows"
```

### Task 3: Update btn-ghost in globals.css

**Files:**
- Modify: src/app/globals.css:162-177

**Step 1: Replace btn-ghost styles**

```css
.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: transparent;
  color: var(--color-text-sub);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid transparent;
  border-radius: 0px;
  transition: all 0.2s ease;
}
.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--color-text);
  backdrop-filter: blur(8px);
}
.btn-ghost:active {
  background: rgba(255, 255, 255, 0.1);
}
```

**Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "ui: update ghost buttons with active state and glass effects"
```
