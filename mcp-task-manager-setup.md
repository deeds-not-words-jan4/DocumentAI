# MCP Task Manager Server Setup Guide

This document provides complete instructions for setting up MCP Task Manager Server on another device.

## 1. Prerequisites

- Node.js installed (v18 or higher recommended)
- Claude Code CLI installed
- Project directory exists

## 2. Package Installation

Run the following command in your project directory:

```bash
npm install --save-dev mcp-task-manager-server
```

Or add to package.json and then install:

```json
{
  "devDependencies": {
    "mcp-task-manager-server": "^0.1.0"
  }
}
```

Then run:
```bash
npm install
```

## 3. Create .mcp.json File

Create a `.mcp.json` file in your project root directory with the following content:

```json
{
  "mcpServers": {
    "task-manager": {
      "type": "stdio",
      "command": "node",
      "args": [
        "./node_modules/mcp-task-manager-server/dist/server.js"
      ]
    }
  }
}
```

## 4. Add to .gitignore (Recommended)

If you don't want to track task management data in Git, add to `.gitignore`:

```
# MCP Task Manager
.mcp-task-manager/
```

## 5. Verify Installation

Launch Claude Code CLI and verify with:

```bash
claude mcp list
```

If `task-manager` appears in the output, setup is successful.

## 6. Available MCP Tools

After setup, the following tools are available:

- `mcp__task-manager__createProject` - Create project
- `mcp__task-manager__addTask` - Add task
- `mcp__task-manager__listTasks` - List tasks
- `mcp__task-manager__showTask` - Show task details
- `mcp__task-manager__setTaskStatus` - Update task status
- `mcp__task-manager__expandTask` - Break task into subtasks
- `mcp__task-manager__getNextTask` - Get next task
- `mcp__task-manager__updateTask` - Update task
- `mcp__task-manager__deleteTask` - Delete task
- `mcp__task-manager__deleteProject` - Delete project
- `mcp__task-manager__exportProject` - Export project
- `mcp__task-manager__importProject` - Import project

## 7. Troubleshooting

### Error: Cannot find module

Re-run:
```bash
npm install
```

### Error: mcp-task-manager-server not found

Verify path:
```bash
ls node_modules/mcp-task-manager-server/dist/server.js
```

On Windows:
```cmd
dir node_modules\mcp-task-manager-server\dist\server.js
```

### MCP server not showing up

1. Restart Claude Code CLI
2. Verify `.mcp.json` JSON format is correct
3. Verify `node_modules` directory exists

## 8. First Use on New Device

1. Complete steps 1-3 above
2. Launch Claude Code CLI
3. Create a new project:
   ```
   @claude Please create a project for task management
   ```
4. Claude will use `mcp__task-manager__createProject` to create the project

## 9. Data Synchronization (Optional)

### Method 1: Export/Import
On original device:
```
@claude Please export the project
```

On new device:
```
@claude Please import this project data [exported JSON]
```

### Method 2: Copy Database File
MCP Task Manager stores data in:
- Linux/Mac: `~/.local/share/mcp-task-manager/`
- Windows: `%LOCALAPPDATA%\mcp-task-manager\`

Copy this directory to the same location on the new device.

## 10. References

- MCP Task Manager GitHub: https://github.com/modelcontextprotocol/servers
- Claude Code Documentation: https://docs.claude.com/claude-code

---

**Created**: 2025-10-24
**Version**: 1.0
