#!/usr/bin/env node
/**
 * NanoCAD MCP Server
 *
 * Model Context Protocol server for NanoCAD automation
 * Provides native Claude tool integration for CAD operations
 *
 * Usage: node server.js
 *
 * @author BACON-AI
 * @version 1.0.0
 */

const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

// MCP Protocol Constants
const JSONRPC_VERSION = '2.0';

// Path to the command executor
const CAD_EXEC_PATH = path.join(__dirname, 'cad_exec.js');

// Server info
const SERVER_INFO = {
    name: 'nanocad-mcp-server',
    version: '1.0.0',
    capabilities: {
        tools: {}
    }
};

// Available tools definition
const TOOLS = [
    // File Operations
    {
        name: 'nanocad_new',
        description: 'Create a new drawing (equivalent to Ctrl+N)',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_open',
        description: 'Open a DWG file',
        inputSchema: {
            type: 'object',
            properties: {
                filepath: { type: 'string', description: 'Path to the DWG file' }
            },
            required: ['filepath']
        }
    },
    {
        name: 'nanocad_save',
        description: 'Save the current drawing (equivalent to Ctrl+S)',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_save_as',
        description: 'Save the drawing to a new file',
        inputSchema: {
            type: 'object',
            properties: {
                filepath: { type: 'string', description: 'Path for the new DWG file' }
            },
            required: ['filepath']
        }
    },

    // Drawing Operations
    {
        name: 'nanocad_add_line',
        description: 'Draw a line between two points',
        inputSchema: {
            type: 'object',
            properties: {
                start: { type: 'array', items: { type: 'number' }, description: '[x, y, z] start point' },
                end: { type: 'array', items: { type: 'number' }, description: '[x, y, z] end point' }
            },
            required: ['start', 'end']
        }
    },
    {
        name: 'nanocad_add_circle',
        description: 'Draw a circle',
        inputSchema: {
            type: 'object',
            properties: {
                center: { type: 'array', items: { type: 'number' }, description: '[x, y, z] center point' },
                radius: { type: 'number', description: 'Circle radius' }
            },
            required: ['center', 'radius']
        }
    },
    {
        name: 'nanocad_add_rectangle',
        description: 'Draw a rectangle',
        inputSchema: {
            type: 'object',
            properties: {
                corner1: { type: 'array', items: { type: 'number' }, description: '[x, y] first corner' },
                corner2: { type: 'array', items: { type: 'number' }, description: '[x, y] opposite corner' }
            },
            required: ['corner1', 'corner2']
        }
    },
    {
        name: 'nanocad_add_text',
        description: 'Add text to the drawing',
        inputSchema: {
            type: 'object',
            properties: {
                text: { type: 'string', description: 'Text content' },
                position: { type: 'array', items: { type: 'number' }, description: '[x, y, z] position' },
                height: { type: 'number', description: 'Text height' }
            },
            required: ['text', 'position', 'height']
        }
    },
    {
        name: 'nanocad_add_arc',
        description: 'Draw an arc',
        inputSchema: {
            type: 'object',
            properties: {
                center: { type: 'array', items: { type: 'number' }, description: '[x, y, z] center point' },
                radius: { type: 'number', description: 'Arc radius' },
                startAngle: { type: 'number', description: 'Start angle in radians' },
                endAngle: { type: 'number', description: 'End angle in radians' }
            },
            required: ['center', 'radius', 'startAngle', 'endAngle']
        }
    },

    // 3D Solids
    {
        name: 'nanocad_add_box',
        description: 'Create a 3D box',
        inputSchema: {
            type: 'object',
            properties: {
                origin: { type: 'array', items: { type: 'number' }, description: '[x, y, z] origin point' },
                length: { type: 'number', description: 'Length (X)' },
                width: { type: 'number', description: 'Width (Y)' },
                height: { type: 'number', description: 'Height (Z)' }
            },
            required: ['origin', 'length', 'width', 'height']
        }
    },
    {
        name: 'nanocad_add_sphere',
        description: 'Create a sphere',
        inputSchema: {
            type: 'object',
            properties: {
                center: { type: 'array', items: { type: 'number' }, description: '[x, y, z] center point' },
                radius: { type: 'number', description: 'Sphere radius' }
            },
            required: ['center', 'radius']
        }
    },
    {
        name: 'nanocad_add_cylinder',
        description: 'Create a cylinder',
        inputSchema: {
            type: 'object',
            properties: {
                center: { type: 'array', items: { type: 'number' }, description: '[x, y, z] base center' },
                radius: { type: 'number', description: 'Cylinder radius' },
                height: { type: 'number', description: 'Cylinder height' }
            },
            required: ['center', 'radius', 'height']
        }
    },

    // View Operations
    {
        name: 'nanocad_zoom_extents',
        description: 'Zoom to fit all objects in view',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_zoom_all',
        description: 'Zoom to show entire drawing',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_regen',
        description: 'Regenerate the drawing',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // Edit Operations
    {
        name: 'nanocad_undo',
        description: 'Undo the last operation (equivalent to Ctrl+Z)',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_redo',
        description: 'Redo the last undone operation (equivalent to Ctrl+Y)',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // Layer Operations
    {
        name: 'nanocad_layer_add',
        description: 'Create a new layer',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Layer name' },
                color: { type: 'number', description: 'Layer color (1-255)' }
            },
            required: ['name']
        }
    },
    {
        name: 'nanocad_layer_set',
        description: 'Set the active layer',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Layer name' }
            },
            required: ['name']
        }
    },
    {
        name: 'nanocad_layer_list',
        description: 'List all layers in the drawing',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // Query Operations
    {
        name: 'nanocad_info',
        description: 'Get document information',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    {
        name: 'nanocad_count',
        description: 'Count entities in model space',
        inputSchema: {
            type: 'object',
            properties: {},
            required: []
        }
    },

    // Special: Send any command
    {
        name: 'nanocad_command',
        description: 'Send any NanoCAD command line command',
        inputSchema: {
            type: 'object',
            properties: {
                command: { type: 'string', description: 'Command to send (use \\n for newlines)' }
            },
            required: ['command']
        }
    }
];

// Map tool names to cad_exec commands
function mapToolToCommand(toolName, args) {
    const mapping = {
        'nanocad_new': () => ['New'],
        'nanocad_open': (a) => ['Open', a.filepath],
        'nanocad_save': () => ['Save'],
        'nanocad_save_as': (a) => ['SaveAs', a.filepath],
        'nanocad_add_line': (a) => ['AddLine', JSON.stringify(a.start), JSON.stringify(a.end)],
        'nanocad_add_circle': (a) => ['AddCircle', JSON.stringify(a.center), String(a.radius)],
        'nanocad_add_rectangle': (a) => ['AddRectangle', JSON.stringify(a.corner1), JSON.stringify(a.corner2)],
        'nanocad_add_text': (a) => ['AddText', a.text, JSON.stringify(a.position), String(a.height)],
        'nanocad_add_arc': (a) => ['AddArc', JSON.stringify(a.center), String(a.radius), String(a.startAngle), String(a.endAngle)],
        'nanocad_add_box': (a) => ['AddBox', JSON.stringify(a.origin), String(a.length), String(a.width), String(a.height)],
        'nanocad_add_sphere': (a) => ['AddSphere', JSON.stringify(a.center), String(a.radius)],
        'nanocad_add_cylinder': (a) => ['AddCylinder', JSON.stringify(a.center), String(a.radius), String(a.height)],
        'nanocad_zoom_extents': () => ['ZoomExtents'],
        'nanocad_zoom_all': () => ['ZoomAll'],
        'nanocad_regen': () => ['Regen'],
        'nanocad_undo': () => ['Undo'],
        'nanocad_redo': () => ['Redo'],
        'nanocad_layer_add': (a) => a.color ? ['LayerAdd', a.name, String(a.color)] : ['LayerAdd', a.name],
        'nanocad_layer_set': (a) => ['LayerSet', a.name],
        'nanocad_layer_list': () => ['LayerList'],
        'nanocad_info': () => ['Info'],
        'nanocad_count': () => ['Count'],
        'nanocad_command': (a) => ['SendCommand', a.command]
    };

    const mapFn = mapping[toolName];
    if (!mapFn) {
        throw new Error(`Unknown tool: ${toolName}`);
    }
    return mapFn(args);
}

// Execute cad_exec.js with the given arguments
function executeCADCommand(cmdArgs) {
    return new Promise((resolve, reject) => {
        const proc = spawn('node', [CAD_EXEC_PATH, ...cmdArgs], {
            cwd: __dirname,
            shell: true
        });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        proc.on('close', (code) => {
            if (code === 0) {
                resolve(stdout.trim());
            } else {
                reject(new Error(stderr.trim() || `Command failed with exit code ${code}`));
            }
        });

        proc.on('error', (err) => {
            reject(err);
        });
    });
}

// JSON-RPC response helpers
function success(id, result) {
    return JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        id,
        result
    });
}

function error(id, code, message) {
    return JSON.stringify({
        jsonrpc: JSONRPC_VERSION,
        id,
        error: { code, message }
    });
}

// Handle incoming JSON-RPC requests
async function handleRequest(request) {
    const { id, method, params } = request;

    switch (method) {
        case 'initialize':
            return success(id, {
                protocolVersion: '2024-11-05',
                serverInfo: SERVER_INFO,
                capabilities: {
                    tools: {}
                }
            });

        case 'tools/list':
            return success(id, { tools: TOOLS });

        case 'tools/call':
            try {
                const { name, arguments: args } = params;
                const cmdArgs = mapToolToCommand(name, args || {});
                const result = await executeCADCommand(cmdArgs);
                return success(id, {
                    content: [{ type: 'text', text: result }]
                });
            } catch (err) {
                return success(id, {
                    content: [{ type: 'text', text: `Error: ${err.message}` }],
                    isError: true
                });
            }

        case 'notifications/initialized':
            // No response needed for notifications
            return null;

        default:
            return error(id, -32601, `Method not found: ${method}`);
    }
}

// Main server loop
async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    let buffer = '';

    rl.on('line', async (line) => {
        buffer += line;

        try {
            const request = JSON.parse(buffer);
            buffer = '';

            const response = await handleRequest(request);
            if (response) {
                process.stdout.write(response + '\n');
            }
        } catch (e) {
            // If JSON parse fails, might be multi-line input - wait for more
            if (e instanceof SyntaxError) {
                buffer += '\n';
            } else {
                console.error('Error:', e);
                buffer = '';
            }
        }
    });

    rl.on('close', () => {
        process.exit(0);
    });
}

main().catch(console.error);
