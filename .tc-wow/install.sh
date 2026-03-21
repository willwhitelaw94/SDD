#!/usr/bin/env bash
# install.sh - Link tc-wow files to target project
# Usage: bash .tc-wow/install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_ROOT/.backup"

echo "Installing tc-wow to $PROJECT_ROOT..."

# Function to link files from source dir to target dir
# If target file exists and is not a symlink, back it up first
link_files() {
    local src_dir="$1"
    local target_dir="$2"
    local relative_src="$3"  # relative path from target_dir to .tc-wow

    mkdir -p "$target_dir"

    for src_file in "$src_dir"/*; do
        [ -e "$src_file" ] || continue  # skip if no files match

        local filename="$(basename "$src_file")"
        local target_file="$target_dir/$filename"

        # If target exists and is a real file (not a symlink), back it up
        if [ -e "$target_file" ] && [ ! -L "$target_file" ]; then
            mkdir -p "$BACKUP_DIR"
            echo "  Backing up $target_file to $BACKUP_DIR/$filename"
            mv "$target_file" "$BACKUP_DIR/$filename"
        fi

        # Remove existing symlink if present
        [ -L "$target_file" ] && rm -f "$target_file"

        # Create new symlink
        ln -s "$relative_src/$filename" "$target_file"
    done
}

# Function to clean orphaned symlinks pointing to tc-wow
# This ensures deleted commands/skills are removed from target directories
clean_orphaned_symlinks() {
    local target_dir="$1"
    local tc_wow_pattern=".tc-wow"

    [ -d "$target_dir" ] || return 0  # skip if dir doesn't exist

    for item in "$target_dir"/*; do
        [ -e "$item" ] || [ -L "$item" ] || continue  # handle broken symlinks too

        # Only remove if it's a symlink pointing to .tc-wow
        if [ -L "$item" ]; then
            local link_target="$(readlink "$item")"
            if [[ "$link_target" == *"$tc_wow_pattern"* ]]; then
                rm -f "$item"
            fi
        fi
    done
}

# Function to link skill directories (each skill folder is symlinked as a whole)
# Skills must be directories containing SKILL.md
link_skills() {
    local src_dir="$1"
    local target_dir="$2"
    local relative_src="$3"  # relative path from target_dir to .tc-wow

    mkdir -p "$target_dir"

    for skill_dir in "$src_dir"/*; do
        [ -d "$skill_dir" ] || continue  # skip if not a directory
        [ -f "$skill_dir/SKILL.md" ] || continue  # skip if no SKILL.md

        local skill_name="$(basename "$skill_dir")"
        local target_skill="$target_dir/$skill_name"

        # If target exists and is a real directory (not a symlink), back it up
        if [ -e "$target_skill" ] && [ ! -L "$target_skill" ]; then
            mkdir -p "$BACKUP_DIR/skills"
            echo "  Backing up $target_skill to $BACKUP_DIR/skills/$skill_name"
            mv "$target_skill" "$BACKUP_DIR/skills/$skill_name"
        fi

        # Remove existing symlink if present
        [ -L "$target_skill" ] && rm -f "$target_skill"

        # Create new symlink to the entire skill directory
        ln -s "$relative_src/$skill_name" "$target_skill"
        echo "  Linked skill: $skill_name"
    done
}

# Create necessary directories
mkdir -p "$PROJECT_ROOT/.specify/scripts"
mkdir -p "$PROJECT_ROOT/.specify/memory"
mkdir -p "$PROJECT_ROOT/.claude"

# Link files from each source directory
# Clean orphaned symlinks before linking to handle deleted files from tc-wow
echo "Cleaning and linking specify/scripts/bash..."
clean_orphaned_symlinks "$PROJECT_ROOT/.specify/scripts/bash"
link_files "$SCRIPT_DIR/specify/scripts/bash" "$PROJECT_ROOT/.specify/scripts/bash" "../../../.tc-wow/specify/scripts/bash"

echo "Cleaning and linking specify/templates..."
clean_orphaned_symlinks "$PROJECT_ROOT/.specify/templates"
link_files "$SCRIPT_DIR/specify/templates" "$PROJECT_ROOT/.specify/templates" "../.tc-wow/specify/templates"

# Note: We no longer use slash commands - skills are preferred.
# See: .tc-docs/content/ways-of-working/3.claude-code-advanced/01-extending-claude.md
# Clean up any orphaned command symlinks from previous installs
echo "Cleaning orphaned claude/commands symlinks..."
clean_orphaned_symlinks "$PROJECT_ROOT/.claude/commands"

# Link skills (each skill directory is symlinked as a whole)
# Skills live in .claude/skills/ per Claude Code documentation
echo "Cleaning and linking claude/skills..."
clean_orphaned_symlinks "$PROJECT_ROOT/.claude/skills"
if [ -d "$SCRIPT_DIR/claude/skills" ] && [ "$(ls -A "$SCRIPT_DIR/claude/skills" 2>/dev/null)" ]; then
    link_skills "$SCRIPT_DIR/claude/skills" "$PROJECT_ROOT/.claude/skills" "../../.tc-wow/claude/skills"
else
    echo "  No skills found to link"
fi

# Link agents (each agent .md file is symlinked individually)
echo "Cleaning and linking claude/agents..."
mkdir -p "$PROJECT_ROOT/.claude/agents"
clean_orphaned_symlinks "$PROJECT_ROOT/.claude/agents"
if [ -d "$SCRIPT_DIR/claude/agents" ] && [ "$(ls -A "$SCRIPT_DIR/claude/agents" 2>/dev/null)" ]; then
    link_files "$SCRIPT_DIR/claude/agents" "$PROJECT_ROOT/.claude/agents" "../../.tc-wow/claude/agents"
else
    echo "  No agents found to link"
fi

echo "Cleaning and linking claude/mcp..."
clean_orphaned_symlinks "$PROJECT_ROOT/.claude/mcp"
link_files "$SCRIPT_DIR/claude/mcp" "$PROJECT_ROOT/.claude/mcp" "../../.tc-wow/claude/mcp"

echo "✓ Symlinks created"

# Merge recommended plugins into .claude/settings.json
PLUGINS_FILE="$SCRIPT_DIR/claude/plugins.json"
SETTINGS_FILE="$PROJECT_ROOT/.claude/settings.json"

if [ -f "$PLUGINS_FILE" ]; then
    echo "Merging recommended plugins into settings.json..."

    # Create settings.json if it doesn't exist
    if [ ! -f "$SETTINGS_FILE" ]; then
        echo '{}' > "$SETTINGS_FILE"
    fi

    # Use node to merge plugins (available in all JS projects)
    node -e "
        const fs = require('fs');
        const settings = JSON.parse(fs.readFileSync('$SETTINGS_FILE', 'utf8'));
        const plugins = JSON.parse(fs.readFileSync('$PLUGINS_FILE', 'utf8'));
        settings.enabledPlugins = { ...settings.enabledPlugins, ...plugins };
        fs.writeFileSync('$SETTINGS_FILE', JSON.stringify(settings, null, 2) + '\n');
    " && echo "✓ Plugins merged into settings.json" || echo "  Warning: Could not merge plugins (node required)"
else
    echo "  No plugins.json found, skipping plugin merge"
fi

# Copy constitution.md template if it doesn't exist in target project
if [ ! -f "$PROJECT_ROOT/.specify/memory/constitution.md" ]; then
    mkdir -p "$PROJECT_ROOT/.specify/memory"
    cp "$SCRIPT_DIR/constitution.md" "$PROJECT_ROOT/.specify/memory/constitution.md"
    echo "✓ Copied constitution.md template to .specify/memory/"
else
    echo "✓ constitution.md already exists, skipping copy"
fi

echo "tc-wow installation complete!"
