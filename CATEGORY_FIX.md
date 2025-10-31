# Category Assignment Fix

## ✅ Issue Fixed

### **🐛 Original Problem**

The category lookup logic had a critical flaw:

```typescript
// ❌ BEFORE - Dangerous!
let defaultCategory = await db.category.findFirst();
```

**Issues**:
1. No `where` clause - returns ANY category
2. Could return an inactive category
3. Could return wrong category type
4. No guarantee it's the "General" category
5. New resources could be assigned to random categories

**Scenario that would break**:
```
Database has:
- "Premium" category (inactive) - created first
- "General" category (active) - created second

Result:
- findFirst() returns "Premium" (inactive)
- New resources assigned to inactive "Premium" category ❌
```

---

### **✅ Fixed Implementation**

```typescript
// ✅ AFTER - Robust!
let defaultCategory = await db.category.findFirst({
  where: {
    slug: 'general',
    isActive: true
  }
});

if (!defaultCategory) {
  // Try to find General category (even if inactive)
  defaultCategory = await db.category.findFirst({
    where: {
      slug: 'general'
    }
  });
  
  // If found but inactive, activate it
  if (defaultCategory && !defaultCategory.isActive) {
    defaultCategory = await db.category.update({
      where: { id: defaultCategory.id },
      data: { isActive: true }
    });
  }
  
  // If still not found, create it
  if (!defaultCategory) {
    defaultCategory = await db.category.create({
      data: {
        name: 'General',
        slug: 'general',
        description: 'General resources and digital products',
        isActive: true
      }
    });
  }
}
```

**Benefits**:
1. ✅ Always looks for 'general' slug first
2. ✅ Ensures category is active
3. ✅ Reactivates if found but inactive
4. ✅ Creates if doesn't exist
5. ✅ Guarantees resources go to correct category

---

## 🔍 Logic Flow

```
1. Try to find active General category
   ↓
2. If not found, try to find any General category (even inactive)
   ↓
3. If found but inactive, activate it
   ↓
4. If still not found, create new General category
   ↓
5. Return the category (guaranteed to be General and active)
```

---

## 🧪 Test Scenarios

### Scenario 1: Active General Exists
```
Database: General (active)
Result: Uses existing General category ✅
```

### Scenario 2: Inactive General Exists  
```
Database: General (inactive)
Result: Activates and uses it ✅
```

### Scenario 3: No General Category
```
Database: Premium, Featured (no General)
Result: Creates new General category ✅
```

### Scenario 4: Multiple Categories
```
Database: 
  - Premium (inactive, created first)
  - General (active, created second)
  
Old Code: Returns Premium (wrong!) ❌
New Code: Returns General (correct!) ✅
```

---

## 💡 Why This Matters

**Without the fix**:
- Resources could be assigned to wrong categories
- Inactive categories could be used
- Category type could be random
- User experience would be inconsistent

**With the fix**:
- All resources go to active "General" category
- Consistent categorization
- Inactive General categories are reactivated
- New category created only when truly needed

---

## 📝 Code Changes

**File**: `src/app/api/resources/route.ts`
**Lines**: 179-214

**Changes**:
- Added `where` clause to filter by slug and isActive
- Added fallback to find General even if inactive
- Added logic to reactivate inactive General category
- Improved comments for clarity

---

## ✅ Verification

The fix ensures:
- ✅ Only active categories are used
- ✅ Always uses "General" category
- ✅ Reactivates if needed
- ✅ Creates if missing
- ✅ Foreign key constraint always satisfied

---

## 🚀 Deployed

**Status**: ✅ Fixed and pushed to GitHub

**Commit**: `fix: Ensure resources use active General category`

**Repository**: https://github.com/Mirxa27/sourcekom-app

Ready for Vercel deployment with the fix applied!

