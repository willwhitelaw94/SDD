---
title: "Inertia.js"
description: "Server-side rendering framework for Vue — v2 with deferred props, polling, prefetching, and modals"
---

## Overview

Inertia.js allows us to build single-page apps using classic server-side routing and controllers, without building an API.

## How We Use It

- Server-side rendering with Vue 3 (Composition API + `<script setup lang="ts">`)
- Seamless page transitions without full page reloads
- Shared data between Laravel and Vue
- Form handling with `useForm()` and automatic validation errors
- Modals via `Inertia::modal()` with `baseRoute()`

## Stack

- **Backend**: Laravel controllers return Inertia responses (`Inertia::render()`, `Inertia::modal()`)
- **Frontend**: Vue 3 components receive props from server
- **Routing**: Laravel routes, no client-side router needed
- **Version**: Inertia v2 (`inertiajs/inertia-laravel` v2 + `@inertiajs/vue3` v2)

## Key Patterns

### Controller Response

```php
return Inertia::render('Users/Index', [
    'users' => User::all()
]);
```

### Vue Component (Composition API)

```vue
<script setup lang="ts">
type Props = {
    users: App.Models.User[]
}

defineProps<Props>()
</script>
```

### Forms with useForm

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3'

const form = useForm({
    name: '',
    email: '',
})

const submit = () => {
    form.post(route('users.store'))
}
</script>
```

### Navigation

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
</script>

<template>
    <Link :href="route('users.index')">Users</Link>
</template>
```

## Inertia v2 Features

### Deferred Props

Load expensive data after the initial page render. Always pair with a skeleton/loading state.

```php
return Inertia::render('Dashboard', [
    'stats' => Inertia::defer(fn () => $this->getExpensiveStats()),
]);
```

```vue
<script setup lang="ts">
import { Deferred } from '@inertiajs/vue3'
</script>

<template>
    <Deferred data="stats">
        <template #fallback>
            <div class="animate-pulse h-20 bg-gray-200 rounded" />
        </template>

        <template #default>
            <StatsPanel :stats="stats" />
        </template>
    </Deferred>
</template>
```

### Polling

```vue
<script setup lang="ts">
import { usePoll } from '@inertiajs/vue3'

usePoll(5000) // refresh props every 5 seconds
</script>
```

### Prefetching

```vue
<template>
    <Link :href="route('users.index')" prefetch>Users</Link>
</template>
```

### Modals

```php
// Controller
return Inertia::modal('Users/EditModal')
    ->baseRoute('users.index');
```

## Resources

- [Inertia.js Documentation](https://inertiajs.com)
- [Inertia v2 Upgrade Guide](https://inertiajs.com/upgrade-guide)
- Use `search-docs` tool for version-specific documentation
