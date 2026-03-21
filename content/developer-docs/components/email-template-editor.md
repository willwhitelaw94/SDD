---
title: "Email Template Editor"
description: "Reusable rich text email template editing system with live preview, template variables, and server-rendered previews"
---

A full-stack system for editing email templates with a rich text editor, template variable substitution, and live server-rendered previews. Currently used for statement notifications, designed to be reused across any domain that needs editable email templates.

---

## Architecture Overview

The system has three layers:

| Layer | Components | Purpose |
|-------|-----------|---------|
| **Frontend** | `CommonTiptapEditor`, `CommonTiptapToolbar`, `CommonEmailPreviewFrame` | Rich text editing and preview display |
| **Composable** | `useEmailEditor` | Wires editor state to server-side preview endpoint |
| **Backend** | `EmailTemplateRenderer` | Template variable substitution and mail rendering |

```
┌─────────────────────────────────────────────┐
│  CommonTiptapEditor + CommonTiptapToolbar    │
│  (rich text editing with markdown storage)   │
└──────────────────┬──────────────────────────┘
                   │ markdown string
                   ▼
          ┌────────────────┐
          │  useEmailEditor │ ◄── debounced POST to preview URL
          └────────┬───────┘
                   │ { html }
                   ▼
      ┌──────────────────────────┐
      │  CommonEmailPreviewFrame  │
      │  (sandboxed iframe)       │
      └──────────────────────────┘
                   ▲
                   │ rendered HTML
      ┌──────────────────────────┐
      │  EmailTemplateRenderer    │
      │  (variable substitution   │
      │   + MailMessage pipeline) │
      └──────────────────────────┘
```

---

## Backend: EmailTemplateRenderer

**Location:** `domain/Shared/Services/EmailTemplateRenderer.php`

A simple service that takes a map of placeholder variables and provides rendering methods.

### Basic Usage

```php
use Domain\Shared\Services\EmailTemplateRenderer;

$renderer = new EmailTemplateRenderer([
    '{statement_month}' => 'March 2026',
    '{statement_year}' => '2026',
]);

// Replace placeholders in a template string
$rendered = $renderer->render($template);

// Split into paragraph blocks (on double newlines)
$lines = $renderer->toBodyLines($template);

// Render a full email preview through the MailMessage pipeline
$html = $renderer->toPreviewHtml($template, 'Subject line', 'Hello [Client Name],');
```

### API

| Method | Returns | Description |
|--------|---------|-------------|
| `render(string $template)` | `string` | Replace all placeholders with values |
| `toBodyLines(string $template)` | `array<int, string>` | Render and split on double newlines (paragraphs) |
| `toPreviewHtml(string $template, string $subject, string $greeting)` | `string` | Full email HTML via `MailMessage::render()` |

### How Body Lines Work

Templates are split into "body lines" on double newlines (`\n\n`). Each body line becomes a `->line()` call on `MailMessage`, which renders it as a markdown paragraph.

Single newlines within a block are preserved — this is how list items stay together:

```
First paragraph about {statement_month}.        → line 1

- **Item one** — description                    → line 2 (entire list block)
- **Item two** — description
- **Item three** — description

Final paragraph.                                 → line 3
```

---

## Template Variables

Template variables use `{variable_name}` syntax and are defined per-domain.

### Statement Variables

| Variable | Example Output | Description |
|----------|---------------|-------------|
| `{statement_month}` | March 2026 | Full month name and year |
| `{statement_year}` | 2026 | Year only |

### Adding Variables for a New Domain

Each domain defines its own variables via a renderer factory:

```php
// In your notification or service class
public static function renderer(): EmailTemplateRenderer
{
    return new EmailTemplateRenderer([
        '{client_name}' => $this->client->full_name,
        '{due_date}' => $this->invoice->due_date->format('d M Y'),
    ]);
}
```

The frontend hint bar should list the available variables so editors know what to use.

---

## Frontend Components

All components live in `resources/js/Components/Common/` and have Storybook documentation.

### CommonTiptapEditor

A rich text editor built on [tiptap](https://tiptap.dev/) with a slot-based toolbar.

```vue
<CommonTiptapEditor v-if="editor" :editor="editor">
    <template #toolbar>
        <CommonTiptapToolbar :editor="editor" />
    </template>
</CommonTiptapEditor>
```

| Prop | Type | Description |
|------|------|-------------|
| `editor` | `Editor` | tiptap editor instance (required) |

| Slot | Description |
|------|-------------|
| `toolbar` | Toolbar content rendered above the editor |

Uses a flex layout strategy: toolbar is `flex-shrink-0`, editor content is `flex-1 min-h-0 overflow-y-auto`. This keeps the toolbar pinned at the top while the editor scrolls.

### CommonTiptapToolbar

Formatting toolbar with bold, italic, underline, strikethrough, bullet list, ordered list, and link.

```vue
<CommonTiptapToolbar :editor="editor">
    <!-- Optional: extra buttons via default slot -->
</CommonTiptapToolbar>
```

| Prop | Type | Description |
|------|------|-------------|
| `editor` | `Editor` | tiptap editor instance (required) |

| Slot | Description |
|------|-------------|
| `default` | Appended after built-in buttons (add custom actions) |

### CommonEmailPreviewFrame

Sandboxed iframe for displaying rendered HTML email previews with full CSS isolation.

```vue
<CommonEmailPreviewFrame :html="previewHtml" />
```

| Prop | Type | Description |
|------|------|-------------|
| `html` | `string` | Full HTML string to render (required) |

---

## Composable: useEmailEditor

**Location:** `resources/js/composables/useEmailEditor.ts`

Manages tiptap editor lifecycle, extracts markdown on changes, and fetches server-rendered previews via a debounced POST request.

### Usage

```typescript
import { useEmailEditor } from '@/composables/useEmailEditor';

const { editor, previewHtml, isLoadingPreview, refreshPreview } = useEmailEditor({
    initialContent: props.config.email_body_template || props.default_body_template,
    previewUrl: route('finance.statements.preview-email'),
    previewPayloadKey: 'email_body_template',  // optional, this is the default
    placeholder: 'Write your email body...',    // optional
    onUpdate: (markdown) => {
        form.email_body_template = markdown;
    },
});
```

### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `initialContent` | `string` | Yes | — | Markdown to load into the editor |
| `previewUrl` | `string` | Yes | — | POST endpoint returning `{ html: string }` |
| `previewPayloadKey` | `string` | No | `'email_body_template'` | Key in the POST body |
| `placeholder` | `string` | No | `'Write your email body template here...'` | Editor placeholder |
| `onUpdate` | `(markdown: string) => void` | No | — | Called on every content change |

### Return Values

| Value | Type | Description |
|-------|------|-------------|
| `editor` | `Ref<Editor \| undefined>` | The tiptap editor instance |
| `previewHtml` | `Ref<string>` | Server-rendered HTML (debounced 500ms) |
| `isLoadingPreview` | `Ref<boolean>` | Preview request in flight |
| `refreshPreview` | `() => void` | Manually trigger a preview refresh |

---

## Adding to a New Domain

To add editable email templates to another area of the app:

### 1. Backend: Define Variables and Preview Endpoint

```php
// In your controller
public function previewEmail(Request $request): JsonResponse
{
    $template = $request->input('email_body_template') ?: YourNotification::DEFAULT_BODY_TEMPLATE;
    $renderer = YourNotification::renderer();

    return response()->json([
        'html' => $renderer->toPreviewHtml($template, 'Your subject line'),
    ]);
}
```

### 2. Backend: Use Renderer in Notification

```php
class YourNotification extends Notification
{
    public const DEFAULT_BODY_TEMPLATE = <<<'TEMPLATE'
    Your content for {variable_name} goes here.
    TEMPLATE;

    public static function renderer(): EmailTemplateRenderer
    {
        return new EmailTemplateRenderer([
            '{variable_name}' => 'resolved value',
        ]);
    }

    public static function buildBodyLines(): array
    {
        $config = YourConfig::resolve();
        $template = $config->email_body_template ?: self::DEFAULT_BODY_TEMPLATE;

        return self::renderer()->toBodyLines($template);
    }
}
```

### 3. Frontend: Wire Up the Editor

```vue
<script setup>
import CommonTiptapEditor from '@/Components/Common/CommonTiptapEditor.vue';
import CommonTiptapToolbar from '@/Components/Common/CommonTiptapToolbar.vue';
import CommonEmailPreviewFrame from '@/Components/Common/CommonEmailPreviewFrame.vue';
import { useEmailEditor } from '@/composables/useEmailEditor';

const { editor, previewHtml, isLoadingPreview } = useEmailEditor({
    initialContent: props.config.email_body_template || props.default_body_template,
    previewUrl: route('your-domain.preview-email'),
    onUpdate: (markdown) => { form.email_body_template = markdown; },
});
</script>
```

### 4. Database: Add Template Column

```php
// Migration
$table->text('email_body_template')->nullable();
```

---

## Reference Implementation

The statement email template is the reference implementation:

| File | Purpose |
|------|---------|
| `domain/Statement/Notifications/YourMonthlyStatementNotification.php` | Notification with `DEFAULT_BODY_TEMPLATE`, `renderer()`, `buildBodyLines()` |
| `domain/Statement/Http/Controllers/StatementRunController.php` | `settings()`, `updateSettings()`, `previewEmail()` endpoints |
| `domain/Statement/Models/StatementConfig.php` | Singleton config model storing `email_body_template` |
| `resources/js/Pages/Finance/Statements/Settings.vue` | Full page with thumbnail preview card, reka-ui dialog editor |

### Storybook

All frontend components have stories and documentation:

- `stories/Common/CommonTiptapEditor.stories.js` + `.mdx`
- `stories/Common/CommonTiptapToolbar.stories.js` + `.mdx`
- `stories/Common/CommonEmailPreviewFrame.stories.js` + `.mdx`
