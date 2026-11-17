# -*- coding: utf-8 -*-
"""
Script to implement Lab 14: 3D Slicing & G-Code Studio (slicer)
"""

slicer_svg = '''
              <!-- LAB 14: 3D Slicing & G-Code Studio (slicer) -->
              <g id="slicer-circuit-view" style="display: none;">
                <!-- 3D Printer Gantry & Slicing Canvas Background -->
                <rect x="230" y="20" width="370" height="280" rx="8" fill="#0b1120" stroke="#1e293b" stroke-width="1.5" />

                <!-- Studio Top Header Badge -->
                <g transform="translate(242, 36)">
                  <rect x="0" y="0" width="195" height="20" rx="4" fill="#1e293b" stroke="#334155" stroke-width="1" />
                  <text x="10" y="14" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="9" font-weight="700">🖨️ Cura FDM Slicing Studio</text>
                  <text x="150" y="14" fill="#f59e0b" font-family="'JetBrains Mono', monospace" font-size="8">0.4mm Nozzle</text>
                </g>

                <!-- 3D Printer Heated Bed Platform -->
                <g id="slicer-gantry-group" transform="translate(260, 65)">
                  <!-- Heated Bed Base (Aluminum Plate) -->
                  <rect x="25" y="150" width="260" height="14" rx="3" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
                  <!-- Textured Gold PEI Magnetic Spring Steel Build Sheet -->
                  <rect x="30" y="146" width="250" height="6" rx="2" fill="#ca8a04" stroke="#eab308" stroke-width="1" />
                  <text x="155" y="158" fill="#fde047" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" text-anchor="middle">HEATED BED (60°C) • 220 x 220 mm BUILD VOLUME</text>

                  <!-- Dual Z-Axis Vertical Aluminum V-Slot Extrusion Pillars -->
                  <rect x="15" y="0" width="14" height="155" fill="#334155" stroke="#1e293b" stroke-width="1" />
                  <rect x="281" y="0" width="14" height="155" fill="#334155" stroke="#1e293b" stroke-width="1" />

                  <!-- Sliced 3D Layer Model on Bed -->
                  <g id="slicer-model-group" transform="translate(105, 55)">
                    <!-- Lower Solid Layers Block (Base) -->
                    <rect id="slicer-layer-stack" x="0" y="30" width="100" height="60" rx="2" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="1.5" />
                    
                    <!-- Internal Infill Pattern (Dynamic Grid / Gyroid / Honeycomb Lines) -->
                    <g id="slicer-infill-pattern">
                      <!-- Grid Infill Pattern -->
                      <path d="M 15 30 L 15 90 M 35 30 L 35 90 M 55 30 L 55 90 M 75 30 L 75 90
                               M 0 45 L 100 45 M 0 65 L 100 65 M 0 80 L 100 80"
                            stroke="#f59e0b" stroke-width="1" stroke-dasharray="2,2" opacity="0.75" />
                    </g>

                    <!-- Active Slicing Layer Highlight (Current Toolpath Plane) -->
                    <g id="slicer-active-layer" transform="translate(0, 30)">
                      <rect x="-2" y="-2" width="104" height="5" rx="1.5" fill="#38bdf8" opacity="0.85" filter="drop-shadow(0 0 6px #38bdf8)" />
                      <!-- Raster Extrusion Paths -->
                      <line x1="0" y1="0" x2="100" y2="0" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                    </g>
                  </g>

                  <!-- Direct-Drive Extruder Printhead Assembly -->
                  <g id="slicer-printhead" transform="translate(135, 62)">
                    <!-- Hotend Cooling Heat Sink (Black/Red Anodized) -->
                    <rect x="0" y="0" width="40" height="26" rx="3" fill="#dc2626" stroke="#991b1b" stroke-width="1" />
                    <!-- Cooling Fan Shroud -->
                    <circle cx="20" cy="13" r="8" fill="#1e293b" stroke="#cbd5e1" stroke-width="1" />
                    <line x1="20" y1="7" x2="20" y2="19" stroke="#94a3b8" stroke-width="1.5" />
                    <line x1="14" y1="13" x2="26" y2="13" stroke="#94a3b8" stroke-width="1.5" />

                    <!-- Brass Heater Block & 0.4mm Pointed Nozzle -->
                    <rect x="12" y="26" width="16" height="10" rx="1.5" fill="#ca8a04" stroke="#a16207" stroke-width="1" />
                    <polygon points="17,36 23,36 21,42 19,42" fill="#eab308" stroke="#ca8a04" stroke-width="0.8" />
                    <!-- Molten Plastic Extrusion Bead Point -->
                    <circle cx="20" cy="43" r="1.5" fill="#fde047" />

                    <!-- Yellow Filament Line feeding down from above -->
                    <line x1="20" y1="-40" x2="20" y2="0" stroke="#facc15" stroke-width="2" />
                  </g>
                </g>

                <!-- Floating Slicer Telemetry Card -->
                <g transform="translate(242, 255)">
                  <rect x="0" y="0" width="346" height="36" rx="5" fill="rgba(15, 23, 42, 0.9)" stroke="#334155" stroke-width="1" />
                  <text id="slicer-telemetry-layer" x="12" y="15" fill="#38bdf8" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700">Layer 45 / 100 (Z = 9.00mm) • Infill: 20% Grid</text>
                  <text id="slicer-telemetry-temps" x="12" y="27" fill="#94a3b8" font-family="'JetBrains Mono', monospace" font-size="7.5">Hotend: 205°C | Bed: 60°C | Est. Time: 42m | Filament: 4.8m (14g)</text>
                  <circle cx="332" cy="18" r="4" fill="#10b981" />
                </g>
              </g>
'''

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

if 'id="slicer-circuit-view"' not in html:
    target_marker = '              <!-- LAB 12: 3D CAD Modeling Studio (Tinkercad CSG Primitives) -->'
    html = html.replace(target_marker, slicer_svg.strip() + "\n\n" + target_marker)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("slicer-circuit-view SVG inserted into index.html!")
else:
    print("slicer-circuit-view already in index.html.")
