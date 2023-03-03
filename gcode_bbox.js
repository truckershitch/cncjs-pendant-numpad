#!/usr/bin/env node

const Toolpath = require("gcode-toolpath");

bbox = { min: { x:0, y:0 }, max: { x:0, y:0 } };

// from https://github.com/cncjs/cncjs-shopfloor-tablet
var bboxHandlers = {
    addLine: function(modal, start, end) {
        // Update units in case it changed in a previous line
        units = modal.units;

        bbox.min.x = Math.min(bbox.min.x, start.x, end.x);
        bbox.min.y = Math.min(bbox.min.y, start.y, end.y);
        bbox.max.x = Math.max(bbox.max.x, start.x, end.x);
        bbox.max.y = Math.max(bbox.max.y, start.y, end.y);

    },
  addArcCurve: function(modal, start, end, center) {
        // To determine the precise bounding box of a circular arc we
        // must account for the possibility that the arc crosses one or
        // more axes.  If so, the bounding box includes the "bulges" of
        // the arc across those axes.

        // Update units in case it changed in a previous line
        units = modal.units;

        if (modal.motion == 'G2') {  // clockwise
            var tmp = start;
            start = end;
            end = tmp;
        }

        // Coordinates relative to the center of the arc
        var sx = start.x - center.x;
        var sy = start.y - center.y;
        var ex = end.x - center.x;
        var ey = end.y - center.y;

        var radius = Math.hypot(sx, sy);

        // Axis crossings - plus and minus x and y
        var px = false;
        var py = false;
        var mx = false;
        var my = false;

        // There are ways to express this decision tree in fewer lines
        // of code by converting to alternate representations like angles,
        // but this way is probably the most computationally efficient.
        // It avoids any use of transcendental functions.  Every path
        // through this decision tree is either 4 or 5 simple comparisons.
        if (ey >= 0) {              // End in upper half plane
            if (ex > 0) {             // End in quadrant 0 - X+ Y+
                if (sy >= 0) {          // Start in upper half plane
                    if (sx > 0) {         // Start in quadrant 0 - X+ Y+
                        if (sx <= ex) {     // wraparound
                            px = py = mx = my = true;
                        }
                    } else {              // Start in quadrant 1 - X- Y+
                        mx = my = px = true;
                    }
                } else {                // Start in lower half plane
                    if (sx > 0) {         // Start in quadrant 3 - X+ Y-
                        px = true;
                    } else {              // Start in quadrant 2 - X- Y-
                        my = px = true;
                    }
                }
            } else {                  // End in quadrant 1 - X- Y+
                if (sy >= 0) {          // Start in upper half plane
                    if (sx > 0) {         // Start in quadrant 0 - X+ Y+
                        py = true;
                    } else {              // Start in quadrant 1 - X- Y+
                        if (sx <= ex) {     // wraparound
                            px = py = mx = my = true;
                        }
                    }
                } else {                // Start in lower half plane
                    if (sx > 0) {         // Start in quadrant 3 - X+ Y-
                        px = py = true;
                    } else {              // Start in quadrant 2 - X- Y-
                        my = px = py = true;
                    }
                }
            }
        } else {                    // ey < 0 - end in lower half plane
            if (ex > 0) {             // End in quadrant 3 - X+ Y+
                if (sy >= 0) {          // Start in upper half plane
                    if (sx > 0) {         // Start in quadrant 0 - X+ Y+
                        py = mx = my = true;
                    } else {              // Start in quadrant 1 - X- Y+
                        mx = my = true;
                    }
                } else {                // Start in lower half plane
                    if (sx > 0) {         // Start in quadrant 3 - X+ Y-
                        if (sx >= ex) {      // wraparound
                            px = py = mx = my = true;
                        }
                    } else {              // Start in quadrant 2 - X- Y-
                        my = true;
                    }
                }
            } else {                  // End in quadrant 2 - X- Y+
                if (sy >= 0) {          // Start in upper half plane
                    if (sx > 0) {         // Start in quadrant 0 - X+ Y+
                        py = mx = true;
                    } else {              // Start in quadrant 1 - X- Y+
                        mx = true;
                    }
                } else {                // Start in lower half plane
                    if (sx > 0) {         // Start in quadrant 3 - X+ Y-
                        px = py = mx = true;
                    } else {              // Start in quadrant 2 - X- Y-
                        if (sx >= ex) {      // wraparound
                            px = py = mx = my = true;
                        }
                    }
                }
            }
        }
        var maxX = px ? center.x + radius : Math.max(start.x, end.x);
        var maxY = py ? center.y + radius : Math.max(start.y, end.y);
        var minX = mx ? center.x - radius : Math.min(start.x, end.x);
        var minY = my ? center.y - radius : Math.min(start.y, end.y);

        bbox.min.x = Math.min(bbox.min.x, minX);
        bbox.min.y = Math.min(bbox.min.y, minY);
        bbox.max.x = Math.max(bbox.max.x, maxX);
        bbox.max.y = Math.max(bbox.max.y, maxY);

    }
};

const toolpath = new Toolpath(bboxHandlers);

function gcode_bbox(gcode) {
    toolpath.loadFromStringSync(gcode);
    return(bbox);
}

module.exports = { gcode_bbox }
