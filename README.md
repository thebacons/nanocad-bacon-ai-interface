# NanoCAD BACON-AI Interface

AI-powered automation interface for NanoCAD 5, developed by BACON-AI.

## Overview

This project provides two integration methods for controlling NanoCAD from Claude AI:

1. **CLI Tool (`cad_exec.js`)** - Direct command-line execution with 70+ commands
2. **MCP Server (`server.js`)** - Native Model Context Protocol integration for Claude

Both methods use the Windows COM/ActiveX API to communicate with NanoCAD.

## Requirements

- Windows 10/11
- NanoCAD 5.0 installed
- Node.js 18+ (Windows)
- `winax` npm package

## Installation

```bash
# Clone the repository
git clone https://github.com/thebacon-ai/nanocad-bacon-ai-interface.git
cd nanocad-bacon-ai-interface

# Install dependencies (from Windows)
npm install
```

## Method 1: CLI Tool (cad_exec.js)

### Usage

```bash
# From Windows command prompt
cd C:\path\to\nanocad-bacon-ai-interface
node src/cad_exec.js <Command> [args...]

# Show all available commands
node src/cad_exec.js
```

### Command Categories

| Category | Commands |
|----------|----------|
| **File** | New, Open, Save, SaveAs, Close, Print |
| **Edit** | Undo, Redo, Copy, Paste, Cut, Delete, SelectAll |
| **View** | ZoomExtents, ZoomAll, ZoomWindow, Pan, Regen |
| **Toggle** | ToggleGrid (F7), ToggleSnap (F9), ToggleOrtho (F8) |
| **Draw** | AddLine, AddCircle, AddArc, AddText, AddRectangle |
| **3D** | AddBox, AddSphere, AddCylinder, AddCone, AddWedge, AddTorus |
| **Modify** | Move, Rotate, Scale, Mirror, Offset, Trim, Fillet, Chamfer |
| **Dimension** | DimLinear, DimAligned, DimAngular, DimRadius, DimDiameter |
| **Layer** | LayerAdd, LayerSet, LayerList, LayerOff, LayerOn |
| **Utility** | Purge, Audit, Units, Limits, Grid, Snap |
| **Query** | Info, Count, Dist, Area, List |
| **Special** | SendCommand, Cmd |

### Examples

```bash
# Draw a circle at (100, 100) with radius 50
node src/cad_exec.js AddCircle [100,100,0] 50

# Draw a line from origin to (200, 150)
node src/cad_exec.js AddLine [0,0,0] [200,150,0]

# Create a rectangle
node src/cad_exec.js AddRectangle [0,0] [100,50]

# Add text
node src/cad_exec.js AddText "Hello NanoCAD" [50,50,0] 10

# Create a new layer with red color (color index 1)
node src/cad_exec.js LayerAdd "MyLayer" 1

# Set active layer
node src/cad_exec.js LayerSet "MyLayer"

# Save the drawing
node src/cad_exec.js SaveAs "C:\\drawings\\test.dwg"

# Send any command (most powerful!)
node src/cad_exec.js SendCommand "MIRROR\n"
node src/cad_exec.js Cmd "CIRCLE\n0,0\n50\n"

# Zoom to fit all content
node src/cad_exec.js ZoomExtents
```

## Method 2: MCP Server

### Configuration

Add to your Claude configuration (`~/.claude.json`):

```json
{
  "mcpServers": {
    "nanocad": {
      "command": "node",
      "args": ["C:/path/to/nanocad-bacon-ai-interface/src/server.js"],
      "env": {}
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `nanocad_new` | Create a new drawing |
| `nanocad_open` | Open a DWG file |
| `nanocad_save` | Save current drawing |
| `nanocad_save_as` | Save as new file |
| `nanocad_add_line` | Draw a line |
| `nanocad_add_circle` | Draw a circle |
| `nanocad_add_rectangle` | Draw a rectangle |
| `nanocad_add_text` | Add text |
| `nanocad_add_arc` | Draw an arc |
| `nanocad_add_box` | Create 3D box |
| `nanocad_add_sphere` | Create sphere |
| `nanocad_add_cylinder` | Create cylinder |
| `nanocad_zoom_extents` | Zoom to fit |
| `nanocad_zoom_all` | Zoom all |
| `nanocad_regen` | Regenerate drawing |
| `nanocad_undo` | Undo last operation |
| `nanocad_redo` | Redo operation |
| `nanocad_layer_add` | Create layer |
| `nanocad_layer_set` | Set active layer |
| `nanocad_layer_list` | List all layers |
| `nanocad_info` | Get document info |
| `nanocad_count` | Count entities |
| `nanocad_command` | Send any command |

### MCP Usage Examples

From Claude:

```
"Draw a circle with radius 100 at the center of the drawing"
→ Claude uses nanocad_add_circle tool

"Create a floor plan with 4 walls"
→ Claude uses multiple nanocad_add_line tools

"Save the drawing to my documents folder"
→ Claude uses nanocad_save_as tool
```

## API Architecture

```
Claude AI → Node.js Script → winax → Windows COM → NanoCAD.Application → Drawing
```

### Key Objects

| Object | Access | Description |
|--------|--------|-------------|
| Application | `new ActiveXObject('NanoCAD.Application')` | Main NanoCAD application |
| Document | `ncApp.ActiveDocument` | Current drawing |
| ModelSpace | `doc.ModelSpace` | Drawing entities collection |
| Layers | `doc.Layers` | Layer collection |

### The SendCommand Method

The most powerful API method - sends any command line command to NanoCAD:

```javascript
doc.SendCommand('CIRCLE\n0,0\n50\n');  // Draw circle
doc.SendCommand('MIRROR\n');            // Start mirror command
doc.SendCommand('ZOOM\nE\n');           // Zoom extents
```

## Keyboard Shortcuts to API Mapping

| Shortcut | Command | API Equivalent |
|----------|---------|----------------|
| Ctrl+N | New | `SendCommand('QNEW\n')` |
| Ctrl+O | Open | `Documents.Open(path)` |
| Ctrl+S | Save | `doc.Save()` |
| Ctrl+Z | Undo | `SendCommand('UNDO\n')` |
| Ctrl+Y | Redo | `SendCommand('REDO\n')` |
| F7 | Grid | `SendCommand('GRIDMODE\n1\n')` |
| F8 | Ortho | `SendCommand('ORTHOMODE\n1\n')` |
| F9 | Snap | `SendCommand('SNAPMODE\n1\n')` |

## Development

### Project Structure

```
nanocad-bacon-ai-interface/
├── src/
│   ├── cad_exec.js    # CLI command executor
│   └── server.js      # MCP server
├── package.json
└── README.md
```

### Testing

```bash
# Test connection to NanoCAD
npm test

# Show help
npm run help
```

## NanoCAD Developer Resources

- [NanoCAD Developer Club](https://developer.nanocad.com/) (login required)
- [SDK Downloads](https://developer.nanocad.com/redmine/projects/ncadsdk/files)
- [AutoCAD ActiveX Reference](https://help.autodesk.com/cloudhelp/2018/PLK/AutoCAD-ActiveX-Reference/files/index.htm) (NanoCAD compatible)

## License

MIT License - See LICENSE file for details.

## Author

BACON-AI - [https://github.com/thebacon-ai](https://github.com/thebacon-ai)

---

*Built with Node.js, winax, and the NanoCAD COM/ActiveX API*
