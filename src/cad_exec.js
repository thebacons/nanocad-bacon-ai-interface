// Dynamic NanoCAD Command Executor v3.0
// Complete keyboard shortcut equivalents + drawing commands
//
// Usage: node cad_exec.js <command> [args...]

require('winax');

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('NanoCAD Command Executor v3.0');
    console.log('==============================');
    console.log('');
    console.log('FILE COMMANDS:');
    console.log('  New                         Ctrl+N    New drawing');
    console.log('  Open <file.dwg>             Ctrl+O    Open file');
    console.log('  Save                        Ctrl+S    Save');
    console.log('  SaveAs <file.dwg>           Ctrl+Shift+S  Save As');
    console.log('  Close                                 Close document');
    console.log('  CloseAll                              Close all documents');
    console.log('  Print                       Ctrl+P    Print dialog');
    console.log('  Export <file> <format>                Export drawing');
    console.log('');
    console.log('EDIT COMMANDS:');
    console.log('  Undo                        Ctrl+Z    Undo');
    console.log('  Redo                        Ctrl+Y    Redo');
    console.log('  Copy                        Ctrl+C    Copy (starts command)');
    console.log('  Paste                       Ctrl+V    Paste');
    console.log('  Cut                         Ctrl+X    Cut');
    console.log('  Delete                      Del       Delete selected');
    console.log('  SelectAll                   Ctrl+A    Select all');
    console.log('  Escape                      Esc       Cancel command');
    console.log('');
    console.log('VIEW COMMANDS:');
    console.log('  ZoomExtents                 Z+E       Zoom to fit all');
    console.log('  ZoomAll                     Z+A       Zoom all');
    console.log('  ZoomWindow <p1> <p2>        Z+W       Zoom to window');
    console.log('  ZoomPrevious                Z+P       Previous zoom');
    console.log('  ZoomIn                                Zoom in');
    console.log('  ZoomOut                               Zoom out');
    console.log('  Pan                                   Pan view');
    console.log('  Regen                                 Regenerate');
    console.log('  RegenAll                              Regenerate all');
    console.log('  Redraw                                Redraw screen');
    console.log('');
    console.log('TOGGLE COMMANDS:');
    console.log('  ToggleGrid                  F7        Toggle grid');
    console.log('  ToggleSnap                  F9        Toggle snap');
    console.log('  ToggleOrtho                 F8        Toggle ortho');
    console.log('  ToggleOsnap                 F3        Toggle object snap');
    console.log('  TogglePolar                 F10       Toggle polar');
    console.log('  ToggleLWT                             Toggle lineweight');
    console.log('');
    console.log('DRAWING COMMANDS:');
    console.log('  AddLine <p1> <p2>                     Line between points');
    console.log('  AddCircle <center> <radius>           Circle');
    console.log('  AddArc <center> <r> <start> <end>     Arc');
    console.log('  AddText <text> <point> <height>       Text');
    console.log('  AddMText <point> <width> <text>       Multiline text');
    console.log('  AddPoint <point>                      Point');
    console.log('  AddPolyline <points>                  Polyline');
    console.log('  AddRectangle <p1> <p2>                Rectangle');
    console.log('  AddEllipse <center> <maj> <ratio>     Ellipse');
    console.log('  AddSpline <points> <start> <end>      Spline');
    console.log('  AddHatch <type> <name> <assoc>        Hatch');
    console.log('');
    console.log('3D COMMANDS:');
    console.log('  AddBox <origin> <l> <w> <h>           3D Box');
    console.log('  AddSphere <center> <radius>           Sphere');
    console.log('  AddCylinder <center> <r> <h>          Cylinder');
    console.log('  AddCone <center> <r1> <r2> <h>        Cone');
    console.log('  AddWedge <center> <l> <w> <h>         Wedge');
    console.log('  AddTorus <center> <tr> <rr>           Torus');
    console.log('');
    console.log('MODIFY COMMANDS:');
    console.log('  Move                        M         Move objects');
    console.log('  Rotate                      RO        Rotate objects');
    console.log('  Scale                       SC        Scale objects');
    console.log('  Mirror                      MI        Mirror objects');
    console.log('  Offset                      O         Offset objects');
    console.log('  Trim                        TR        Trim objects');
    console.log('  Extend                      EX        Extend objects');
    console.log('  Fillet                      F         Fillet corners');
    console.log('  Chamfer                     CHA       Chamfer corners');
    console.log('  Array                       AR        Array objects');
    console.log('  Explode                     X         Explode objects');
    console.log('  Join                        J         Join objects');
    console.log('  Break                       BR        Break objects');
    console.log('  Stretch                     S         Stretch objects');
    console.log('');
    console.log('DIMENSION COMMANDS:');
    console.log('  DimLinear                   DLI       Linear dimension');
    console.log('  DimAligned                  DAL       Aligned dimension');
    console.log('  DimAngular                  DAN       Angular dimension');
    console.log('  DimRadius                   DRA       Radius dimension');
    console.log('  DimDiameter                 DDI       Diameter dimension');
    console.log('');
    console.log('LAYER COMMANDS:');
    console.log('  LayerAdd <name> [color]               Create layer');
    console.log('  LayerSet <name>                       Set active layer');
    console.log('  LayerList                             List all layers');
    console.log('  LayerOff <name>                       Turn layer off');
    console.log('  LayerOn <name>                        Turn layer on');
    console.log('  LayerFreeze <name>                    Freeze layer');
    console.log('  LayerThaw <name>                      Thaw layer');
    console.log('');
    console.log('UTILITY COMMANDS:');
    console.log('  Purge                                 Purge unused');
    console.log('  Audit                                 Audit drawing');
    console.log('  Recover <file>                        Recover drawing');
    console.log('  Units                                 Units dialog');
    console.log('  Limits                                Drawing limits');
    console.log('  Grid <spacing>                        Set grid spacing');
    console.log('  Snap <spacing>                        Set snap spacing');
    console.log('');
    console.log('QUERY COMMANDS:');
    console.log('  Info                                  Document info');
    console.log('  Count                                 Entity count');
    console.log('  Dist                                  Distance command');
    console.log('  Area                                  Area command');
    console.log('  List                                  List properties');
    console.log('');
    console.log('SPECIAL:');
    console.log('  SendCommand <cmd>           Send any command line command');
    console.log('  Cmd <cmd>                   Alias for SendCommand');
    console.log('');
    console.log('EXAMPLES:');
    console.log('  node cad_exec.js AddCircle [100,100,0] 50');
    console.log('  node cad_exec.js AddLine [0,0,0] [200,150,0]');
    console.log('  node cad_exec.js SaveAs C:\\drawings\\test.dwg');
    console.log('  node cad_exec.js SendCommand "MIRROR\\n"');
    process.exit(0);
}

const command = args[0];
const params = args.slice(1);

// Parse parameter
function parseParam(str) {
    if (!str) return str;
    str = str.trim();
    if (str.startsWith('[') && str.endsWith(']')) {
        return JSON.parse(str);
    }
    if (!isNaN(str) && str !== '') {
        return parseFloat(str);
    }
    if ((str.startsWith('"') && str.endsWith('"')) ||
        (str.startsWith("'") && str.endsWith("'"))) {
        return str.slice(1, -1);
    }
    return str;
}

// Connect to NanoCAD
let ncApp, doc, ms;
try {
    ncApp = new ActiveXObject('NanoCAD.Application');
    ncApp.Visible = true;
    doc = ncApp.ActiveDocument;
    if (doc) {
        ms = doc.ModelSpace;
    }
    console.log('Connected to NanoCAD');
} catch (e) {
    console.error('Failed to connect:', e.message);
    process.exit(1);
}

// Execute command
try {
    let result;
    const p = params.map(parseParam);

    switch (command) {
        // ==================== FILE COMMANDS ====================

        case 'New':
            doc.SendCommand('QNEW\n');
            result = 'New drawing (QNEW)';
            break;

        case 'Open':
            if (!p[0]) throw new Error('Filename required');
            doc = ncApp.Documents.Open(p[0]);
            ms = doc.ModelSpace;
            result = 'Opened: ' + p[0];
            break;

        case 'Save':
            doc.Save();
            result = 'Saved: ' + doc.FullName;
            break;

        case 'SaveAs':
            if (!p[0]) throw new Error('Filename required');
            doc.SaveAs(p[0]);
            result = 'Saved as: ' + p[0];
            break;

        case 'Close':
            doc.SendCommand('CLOSE\n');
            result = 'Close command sent';
            break;

        case 'CloseAll':
            doc.SendCommand('CLOSEALL\n');
            result = 'CloseAll command sent';
            break;

        case 'Print':
            doc.SendCommand('PRINT\n');
            result = 'Print dialog opened';
            break;

        case 'Export':
            doc.SendCommand('EXPORT\n');
            result = 'Export command sent';
            break;

        // ==================== EDIT COMMANDS ====================

        case 'Undo':
            doc.SendCommand('UNDO\n');
            result = 'Undo';
            break;

        case 'Redo':
            doc.SendCommand('REDO\n');
            result = 'Redo';
            break;

        case 'Copy':
            doc.SendCommand('COPYCLIP\n');
            result = 'Copy to clipboard';
            break;

        case 'Paste':
            doc.SendCommand('PASTECLIP\n');
            result = 'Paste from clipboard';
            break;

        case 'Cut':
            doc.SendCommand('CUTCLIP\n');
            result = 'Cut to clipboard';
            break;

        case 'Delete':
            doc.SendCommand('ERASE\n');
            result = 'Erase command';
            break;

        case 'SelectAll':
            doc.SendCommand('SELECT\nALL\n');
            result = 'Select All';
            break;

        case 'Escape':
            doc.SendCommand('\x03'); // Ctrl+C / ESC
            result = 'Escape sent';
            break;

        // ==================== VIEW COMMANDS ====================

        case 'ZoomExtents':
            doc.Application.ZoomExtents();
            result = 'ZoomExtents';
            break;

        case 'ZoomAll':
            doc.SendCommand('ZOOM\nA\n');
            result = 'ZoomAll';
            break;

        case 'ZoomWindow':
            if (p[0] && p[1]) {
                doc.Application.ZoomWindow(p[0], p[1]);
                result = 'ZoomWindow';
            } else {
                doc.SendCommand('ZOOM\nW\n');
                result = 'ZoomWindow command';
            }
            break;

        case 'ZoomPrevious':
            doc.SendCommand('ZOOM\nP\n');
            result = 'ZoomPrevious';
            break;

        case 'ZoomIn':
            doc.SendCommand('ZOOM\n2X\n');
            result = 'ZoomIn 2x';
            break;

        case 'ZoomOut':
            doc.SendCommand('ZOOM\n0.5X\n');
            result = 'ZoomOut 0.5x';
            break;

        case 'Pan':
            doc.SendCommand('PAN\n');
            result = 'Pan command';
            break;

        case 'Regen':
            doc.Regen(1);
            result = 'Regenerated';
            break;

        case 'RegenAll':
            doc.SendCommand('REGENALL\n');
            result = 'RegenAll';
            break;

        case 'Redraw':
            doc.SendCommand('REDRAW\n');
            result = 'Redraw';
            break;

        // ==================== TOGGLE COMMANDS (F-Keys) ====================

        case 'ToggleGrid':
        case 'F7':
            doc.SendCommand('GRIDMODE\n' + (doc.GetVariable('GRIDMODE') ? '0' : '1') + '\n');
            result = 'Grid toggled';
            break;

        case 'ToggleSnap':
        case 'F9':
            doc.SendCommand('SNAPMODE\n' + (doc.GetVariable('SNAPMODE') ? '0' : '1') + '\n');
            result = 'Snap toggled';
            break;

        case 'ToggleOrtho':
        case 'F8':
            doc.SendCommand('ORTHOMODE\n' + (doc.GetVariable('ORTHOMODE') ? '0' : '1') + '\n');
            result = 'Ortho toggled';
            break;

        case 'ToggleOsnap':
        case 'F3':
            doc.SendCommand('OSMODE\n');
            result = 'Osnap settings';
            break;

        case 'TogglePolar':
        case 'F10':
            doc.SendCommand('POLARMODE\n');
            result = 'Polar toggled';
            break;

        case 'ToggleLWT':
            doc.SendCommand('LWDISPLAY\n' + (doc.GetVariable('LWDISPLAY') ? '0' : '1') + '\n');
            result = 'Lineweight display toggled';
            break;

        // ==================== DRAWING COMMANDS ====================

        case 'AddLine':
            result = ms.AddLine(p[0], p[1]);
            break;

        case 'AddCircle':
            result = ms.AddCircle(p[0], p[1]);
            break;

        case 'AddArc':
            result = ms.AddArc(p[0], p[1], p[2], p[3]);
            break;

        case 'AddText':
            result = ms.AddText(p[0], p[1], p[2]);
            break;

        case 'AddMText':
            result = ms.AddMText(p[0], p[1], p[2]);
            break;

        case 'AddPoint':
            result = ms.AddPoint(p[0]);
            break;

        case 'AddLightWeightPolyline':
        case 'AddPolyline':
            result = ms.AddLightWeightPolyline(p[0]);
            break;

        case 'Add3DPolyline':
            result = ms.Add3DPolyline(p[0]);
            break;

        case 'AddRectangle':
            // Rectangle via RECTANG command (more reliable)
            if (p[0] && p[1]) {
                doc.SendCommand('RECTANG\n' + p[0][0] + ',' + p[0][1] + '\n' + p[1][0] + ',' + p[1][1] + '\n');
                result = 'Rectangle created';
            }
            break;

        case 'AddEllipse':
            result = ms.AddEllipse(p[0], p[1], p[2]);
            break;

        case 'AddSpline':
            result = ms.AddSpline(p[0], p[1], p[2]);
            break;

        case 'AddHatch':
            result = ms.AddHatch(p[0], p[1], p[2]);
            break;

        // ==================== 3D SOLIDS ====================

        case 'AddBox':
            result = ms.AddBox(p[0], p[1], p[2], p[3]);
            break;

        case 'AddSphere':
            result = ms.AddSphere(p[0], p[1]);
            break;

        case 'AddCylinder':
            result = ms.AddCylinder(p[0], p[1], p[2]);
            break;

        case 'AddCone':
            result = ms.AddCone(p[0], p[1], p[2], p[3]);
            break;

        case 'AddWedge':
            result = ms.AddWedge(p[0], p[1], p[2], p[3]);
            break;

        case 'AddTorus':
            result = ms.AddTorus(p[0], p[1], p[2]);
            break;

        // ==================== MODIFY COMMANDS ====================

        case 'Move':
            doc.SendCommand('MOVE\n');
            result = 'Move command';
            break;

        case 'Rotate':
            doc.SendCommand('ROTATE\n');
            result = 'Rotate command';
            break;

        case 'Scale':
            doc.SendCommand('SCALE\n');
            result = 'Scale command';
            break;

        case 'Mirror':
            doc.SendCommand('MIRROR\n');
            result = 'Mirror command';
            break;

        case 'Offset':
            doc.SendCommand('OFFSET\n');
            result = 'Offset command';
            break;

        case 'Trim':
            doc.SendCommand('TRIM\n');
            result = 'Trim command';
            break;

        case 'Extend':
            doc.SendCommand('EXTEND\n');
            result = 'Extend command';
            break;

        case 'Fillet':
            doc.SendCommand('FILLET\n');
            result = 'Fillet command';
            break;

        case 'Chamfer':
            doc.SendCommand('CHAMFER\n');
            result = 'Chamfer command';
            break;

        case 'Array':
            doc.SendCommand('ARRAY\n');
            result = 'Array command';
            break;

        case 'Explode':
            doc.SendCommand('EXPLODE\n');
            result = 'Explode command';
            break;

        case 'Join':
            doc.SendCommand('JOIN\n');
            result = 'Join command';
            break;

        case 'Break':
            doc.SendCommand('BREAK\n');
            result = 'Break command';
            break;

        case 'Stretch':
            doc.SendCommand('STRETCH\n');
            result = 'Stretch command';
            break;

        // ==================== DIMENSION COMMANDS ====================

        case 'DimLinear':
            doc.SendCommand('DIMLINEAR\n');
            result = 'DimLinear command';
            break;

        case 'DimAligned':
            doc.SendCommand('DIMALIGNED\n');
            result = 'DimAligned command';
            break;

        case 'DimAngular':
            doc.SendCommand('DIMANGULAR\n');
            result = 'DimAngular command';
            break;

        case 'DimRadius':
            doc.SendCommand('DIMRADIUS\n');
            result = 'DimRadius command';
            break;

        case 'DimDiameter':
            doc.SendCommand('DIMDIAMETER\n');
            result = 'DimDiameter command';
            break;

        case 'AddDimAligned':
            result = ms.AddDimAligned(p[0], p[1], p[2]);
            break;

        case 'AddDimRotated':
            result = ms.AddDimRotated(p[0], p[1], p[2], p[3]);
            break;

        // ==================== LAYER COMMANDS ====================

        case 'LayerAdd':
            if (!p[0]) throw new Error('Layer name required');
            const newLayer = doc.Layers.Add(p[0]);
            if (p[1]) newLayer.Color = parseInt(p[1]);
            result = 'Layer created: ' + p[0];
            break;

        case 'LayerSet':
            if (!p[0]) throw new Error('Layer name required');
            doc.SendCommand('CLAYER\n' + p[0] + '\n');
            result = 'Active layer set to: ' + p[0];
            break;

        case 'LayerList':
            const layers = [];
            for (let i = 0; i < doc.Layers.Count; i++) {
                layers.push(doc.Layers.Item(i).Name);
            }
            result = 'Layers: ' + layers.join(', ');
            break;

        case 'LayerOff':
            if (!p[0]) throw new Error('Layer name required');
            doc.SendCommand('LAYOFF\n' + p[0] + '\n');
            result = 'Layer off: ' + p[0];
            break;

        case 'LayerOn':
            if (!p[0]) throw new Error('Layer name required');
            doc.SendCommand('LAYON\n' + p[0] + '\n');
            result = 'Layer on: ' + p[0];
            break;

        case 'LayerFreeze':
            if (!p[0]) throw new Error('Layer name required');
            doc.SendCommand('LAYFRZ\n' + p[0] + '\n');
            result = 'Layer frozen: ' + p[0];
            break;

        case 'LayerThaw':
            if (!p[0]) throw new Error('Layer name required');
            doc.SendCommand('LAYTHW\n' + p[0] + '\n');
            result = 'Layer thawed: ' + p[0];
            break;

        // ==================== UTILITY COMMANDS ====================

        case 'Purge':
            doc.SendCommand('PURGE\nA\n\nN\n');
            result = 'Purge executed';
            break;

        case 'Audit':
            doc.SendCommand('AUDIT\nY\n');
            result = 'Audit executed';
            break;

        case 'Recover':
            if (!p[0]) throw new Error('Filename required');
            doc.SendCommand('RECOVER\n' + p[0] + '\n');
            result = 'Recover: ' + p[0];
            break;

        case 'Units':
            doc.SendCommand('UNITS\n');
            result = 'Units dialog';
            break;

        case 'Limits':
            doc.SendCommand('LIMITS\n');
            result = 'Limits command';
            break;

        case 'Grid':
            if (p[0]) {
                doc.SendCommand('GRID\n' + p[0] + '\n');
                result = 'Grid spacing: ' + p[0];
            } else {
                doc.SendCommand('GRID\n');
                result = 'Grid command';
            }
            break;

        case 'Snap':
            if (p[0]) {
                doc.SendCommand('SNAP\n' + p[0] + '\n');
                result = 'Snap spacing: ' + p[0];
            } else {
                doc.SendCommand('SNAP\n');
                result = 'Snap command';
            }
            break;

        // ==================== QUERY COMMANDS ====================

        case 'Info':
            result = 'Document: ' + doc.Name + '\n' +
                     'Path: ' + doc.Path + '\n' +
                     'Saved: ' + doc.Saved + '\n' +
                     'Active Layer: ' + doc.ActiveLayer.Name;
            break;

        case 'Count':
            result = 'Entities in ModelSpace: ' + ms.Count;
            break;

        case 'Dist':
            doc.SendCommand('DIST\n');
            result = 'Distance command';
            break;

        case 'Area':
            doc.SendCommand('AREA\n');
            result = 'Area command';
            break;

        case 'List':
            doc.SendCommand('LIST\n');
            result = 'List command';
            break;

        // ==================== SEND ANY COMMAND ====================

        case 'SendCommand':
        case 'Cmd':
            if (!p[0]) throw new Error('Command string required');
            // Handle escaped newlines
            const cmdStr = p[0].replace(/\\n/g, '\n');
            doc.SendCommand(cmdStr);
            result = 'Sent: ' + p[0];
            break;

        // ==================== FALLBACK ====================

        default:
            if (ms && typeof ms[command] === 'function') {
                result = ms[command].apply(ms, p);
            } else if (doc && typeof doc[command] === 'function') {
                result = doc[command].apply(doc, p);
            } else if (ncApp && typeof ncApp[command] === 'function') {
                result = ncApp[command].apply(ncApp, p);
            } else {
                // Try as direct command
                doc.SendCommand(command.toUpperCase() + '\n');
                result = 'Command sent: ' + command;
            }
    }

    console.log('OK: ' + command);
    if (result) {
        if (typeof result === 'string') {
            console.log(result);
        } else if (result.ObjectName) {
            console.log('Created: ' + result.ObjectName);
        }
    }

} catch (e) {
    console.error('FAIL:', e.message);
    process.exit(1);
}
