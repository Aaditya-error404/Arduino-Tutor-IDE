# -*- coding: utf-8 -*-
"""
Script to insert SLICER_LESSONS_DATA into js/lessons.js
"""

slicer_lessons_code = '''
const SLICER_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 53: From 3D Mesh to 2D Slices: Layer Height & Print Time",
    shortTitle: "53. Layer Heights & Slicing",
    subtitle: "The Slicer Engine: Chopping 3D Models into Hundreds of 0.2mm Horizontal Slices",
    summary: "Discover how a 3D printer actually works! Learn how slicer software (Cura, PrusaSlicer) slices a 3D STL mesh into micro-thin horizontal sheets, and balance layer height vs print speed.",
    mascotMsg: "Welcome to the 3D Slicing Studio! 🖨️ A 3D printer can't print a whole 3D shape all at once — it builds objects like a stack of pancakes! Let's slice our robot part into layers and discover the magic of layer heights!",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Deli Meat Slicer & The Stack of Post-it Notes",
      story: "Imagine buying a solid block of cheese at a grocery deli. The butcher adjusts a dial and runs the blade back and forth, slicing the block into 100 thin slices. If you stack those 100 slices back together on a plate, you have reconstructed the original 3D block! In 3D printing, a Slicer (like Ultimaker Cura or PrusaSlicer) cuts your virtual CAD model into horizontal slices (0.12mm to 0.28mm thick). The printer then draws slice #1 on the bed, steps up by 0.2mm, draws slice #2, and repeats until your physical part is complete!",
      hardwareMetaphor: "The Z-axis lead screw turns a precise fraction of a degree to elevate the printhead gantry by the exact slice height after every layer."
    },
    jargonBuster: [
      {
        word: "Slicer",
        pronunciation: "SLY-sur",
        analogy: "The Blueprint Translator",
        definition: "Software that converts 3D STL CAD models into layer-by-layer G-code machine instructions."
      },
      {
        word: "Layer Height",
        pronunciation: "LAY-er Hite",
        analogy: "Post-it Note Thickness",
        definition: "The vertical thickness of each deposited plastic layer (0.20mm standard, 0.12mm fine)."
      },
      {
        word: "G-Code",
        pronunciation: "JEE-kohd",
        analogy: "Robot GPS Coordinates",
        definition: "The universal programming language of CNC machines and 3D printers (e.g. G1 X50 Y100 E2.5)."
      },
      {
        word: "Nozzle Diameter",
        pronunciation: "NAH-zul Dye-AM-ih-ter",
        analogy: "Felt-Tip Marker Tip",
        definition: "The opening at the tip of the hotend where molten plastic squirts out (standard = 0.4mm)."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Import 3D CAD Mesh (STL file) into Slicer:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Model Total Height = 20.0 mm", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Select Slicing Resolution Profile:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Profile A: Fine (0.12mm layer height) -> 167 Layers -> 1 hr 18 min", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Profile B: Standard (0.20mm layer height) -> 100 Layers -> 42 min (Recommended)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Profile C: Draft (0.28mm layer height) -> 71 Layers -> 26 min", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Generate G-Code toolpaths for 0.4mm brass extrusion nozzle!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Engine G-Code Layer Initiation", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; LAYER: 45 / 100 (Z = 9.00mm)", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "G0 F7200 X105.000 Y105.000 Z9.000 ; Rapid travel to layer start", indent: 0, tag: "code" },
        { id: "c4", line: 4, text: "G1 F1800 E0.80000 ; Un-retract filament (+0.8mm)", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G1 F2400 X155.000 Y105.000 E2.15000 ; Extrude outer perimeter wall", indent: 0, tag: "code" },
        { id: "c6", line: 6, text: "G1 X155.000 Y155.000 E3.50000 ; Extrude right perimeter wall", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Differential Calculus Analogy: Approximating Volumes with Slices",
      pedagogy: "Introduces students to Riemann sums and numerical integration through physical 3D slicing. Demonstrates the engineering trade-off between surface finish (stair-stepping) and manufacturing time.",
      misconceptions: [
        {
          title: "Misconception: 'If you choose 0.1mm layer height instead of 0.2mm, does the part get twice as strong?'",
          detail: "Actually, parts printed with thinner layers can have slightly lower tensile strength between layers because smaller beads cool faster before bonding. 0.20mm is the sweet spot for structural robot parts."
        }
      ],
      discussionPrompts: [
        "Why can you never print a layer height thicker than your nozzle diameter? (A 0.4mm nozzle cannot lay down a 0.5mm bead without losing pressure).",
        "Look at a 3D printed part under a magnifying glass: why does a curved dome look like tiny miniature stair steps?"
      ],
      standards: [
        "NGSS HS-PS3-3: Design, build, and refine a device that works within given constraints to convert one form of energy into another.",
        "NITI Aayog ATL Equipment Package P4: FDM 3D Printer Operation, Slicer Profiles, and Quality Tuning."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 54: Infill Geometry & Strength-to-Weight Optimization",
    shortTitle: "54. Infill Patterns & Strength",
    subtitle: "Why 100% Solid is a Waste: Engineering Internal Lattice Structures (Grid, Gyroid, Honeycomb)",
    summary: "Look inside a 3D printed object! Learn why 3D prints are hollow honeycombs inside, saving 70% of filament weight while maintaining 90% of structural strength.",
    mascotMsg: "If you cut open an airplane wing or a bird's bone, it isn't solid rock inside — it's a hollow, super-strong honeycomb! Let's explore how internal infill patterns give robot parts maximum strength with minimum weight!",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Honeycomb Hive & The Cardboard Box Fluting",
      story: "If you tear open a shipping cardboard box, you see two flat sheets on the outside, and a wavy zig-zag accordion paper in the middle. That wavy middle takes up 80% air, but allows the box to hold heavy textbooks! In 3D printing, the outer walls are called 'Perimeters', and the internal scaffolding is called 'Infill'. Slicing with 20% infill creates a part that uses 1/5th the plastic of a solid block, prints 4x faster, but holds 85% of the payload!",
      hardwareMetaphor: "Internal lattice structures inspired by biomimicry (bird bone trabeculae and bee honeycombs)."
    },
    jargonBuster: [
      {
        word: "Infill Density",
        pronunciation: "IN-fil DEN-sih-tee",
        analogy: "Scaffolding Density",
        definition: "The percentage of solid plastic inside the part (15%-25% standard for robot parts)."
      },
      {
        word: "Perimeter Walls",
        pronunciation: "puh-RIM-ih-ter Walls",
        analogy: "The Castle Moat Walls",
        definition: "The outer solid plastic shells (usually 2 or 3 perimeters = 0.8mm to 1.2mm total)."
      },
      {
        word: "Gyroid Infill",
        pronunciation: "JYE-royd IN-fil",
        analogy: "Wavy Sea Sponges",
        definition: "A continuous 3D wave pattern that provides equal strength in all three directions (isotropic)."
      },
      {
        word: "Filament Consumption",
        pronunciation: "FIL-uh-munt kun-SUMP-shun",
        analogy: "Grams of Plastic Used",
        definition: "Total length (meters) and weight (grams) of plastic melted for the print."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Configure External Perimeters (Wall Count):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Set Wall Line Count = 3 (3 x 0.4mm nozzle = 1.2mm solid shell)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Select Internal Infill Pattern & Density:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Option A: 20% Grid (Fastest printing, high vertical crush strength)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Option B: 20% Gyroid (Isotropic strength, flexible, best for robot gears)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Option C: 20% Honeycomb (Maximum torsional rigidity)", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Material Savings Calculation:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Solid 100% = 68g filament | 20% Infill = 14g filament (79% Plastic Saved!)", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Infill Raster Generation", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; TYPE: INFILL (20% Gyroid)", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "G1 F3600 X115.200 Y120.400 E0.12500 ; Sinusoidal toolpath curve", indent: 0, tag: "code" },
        { id: "c4", line: 4, text: "G1 X125.600 Y124.800 E0.25000", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G1 X135.100 Y120.200 E0.37500", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Structural Mechanics, Weight Optimization & Biomimicry",
      pedagogy: "Teaches why more material does not automatically mean better design. Connects infill patterns to aerospace engineering where mass reduction saves fuel.",
      misconceptions: [
        {
          title: "Misconception: 'If my 3D printed robot bracket broke, should I increase infill from 20% to 100%?'",
          detail: "No! 80% of a part's stiffness comes from its outer perimeter walls. Adding 1 more wall perimeter (e.g. from 2 to 3 walls) makes a part 3x stronger than bumping infill from 20% to 80%, while using far less filament."
        }
      ],
      discussionPrompts: [
        "Why is Gyroid infill preferred over Grid infill for parts that hold liquids or get bent from multiple angles?",
        "If a 1kg spool of PLA plastic costs ₹1,200, how much money do you save per robot chassis by using 20% infill instead of 100%?"
      ],
      standards: [
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process.",
        "NITI Aayog ATL Curriculum Module 4: Infill Density Optimization and Rapid Prototyping."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 55: Overhang Physics: The 45° Rule & Support Structures",
    shortTitle: "55. Overhangs & Supports",
    subtitle: "Gravity vs Molten Plastic: Why 3D Printers Cannot Print on Thin Air",
    summary: "Master the fundamental physical constraint of FDM 3D printing! Learn why angles steeper than 45° sag into stringy spaghetti, and generate sacrificial tree supports.",
    mascotMsg: "Can you build the roof of a house before building the walls? Of course not — gravity would pull the bricks down! The same rule applies to hot 200°C melted plastic. Let's master the 45-Degree Rule!",
    difficulty: "Intermediate",
    duration: "20 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Roman Arch Scaffolding & The Snowman Metaphor",
      story: "When ancient Roman masons built a curved stone archway, they first erected temporary wooden scaffolding underneath. Once the center keystone was locked into place, they took the scaffolding away and the arch stood forever on its own! In 3D printing, each new layer must rest on the layer beneath it. If a feature juts out at less than 45°, each new bead rests on 70% of the previous bead. But at 90° (a horizontal ceiling), molten plastic will fall straight down like spaghetti without temporary supports!",
      hardwareMetaphor: "The 45-degree overhang threshold: determined by the surface tension and glass transition cooling rate of extruded thermoplastics."
    },
    jargonBuster: [
      {
        word: "45° Rule",
        pronunciation: "FOR-tee-fyve Dee-gree Rool",
        analogy: "The Safe Ski Slope",
        definition: "Angles up to 45° can be printed cleanly in mid-air without needing any support structures."
      },
      {
        word: "Tree Supports",
        pronunciation: "TREE Sup-ports",
        analogy: "Tree Branches Reaching In",
        definition: "Organic hollow branch structures that grow from the build plate to touch overhangs delicately."
      },
      {
        word: "Bridging",
        pronunciation: "BRIJ-ing",
        analogy: "A Tightrope Walk",
        definition: "Printing a horizontal line straight across two pillars with fast part-cooling fan at 100%."
      },
      {
        word: "Support Interface",
        pronunciation: "Sup-port IN-ter-fayss",
        analogy: "Perforated Tear-off Paper",
        definition: "A 0.2mm air gap layer that lets you snap supports off by hand without scarring the part."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Analyze Overhang Angles on CAD Geometry:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Green Faces (0° to 45° overhang) -> Printable without supports!", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "Red Faces (> 45° overhang) -> Will sag into molten noodles without support!", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 2: Generate Tree Support Scaffolding:", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Set Support Overhang Angle = 50°", indent: 1, tag: "setup" },
        { id: "h6", line: 6, text: "Set Support Z Distance = 0.2mm (Easy snap-off clearance)", indent: 1, tag: "setup" },
        { id: "h7", line: 7, text: "STEP 3: Slice and Verify Clean Breakaway Interface!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Cura Support Generation Routine", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "; TYPE: SUPPORT-INTERFACE", indent: 0, tag: "comment" },
        { id: "c3", line: 3, text: "M106 S255 ; Fan 100% cooling to freeze overhang", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "G1 F1500 X120.000 Y130.000 E1.12000 ; Dense breakaway roof layer", indent: 0, tag: "code" },
        { id: "c5", line: 5, text: "G0 Z9.200 ; Leave 0.2mm air gap before part layer", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Design for Additive Manufacturing (DFAM) & Orientation Optimization",
      pedagogy: "Teaches students how rotating a 3D model on the build plate by 90° can eliminate 100% of required supports, saving 50% print time and giving pristine surface quality.",
      misconceptions: [
        {
          title: "Misconception: 'Should I always use supports on every single model just in case?'",
          detail: "No! Supports waste plastic, increase print time by 30-50%, and leave rough scars when peeled off. A great CAD designer redesigns steep overhangs into 45° chamfers so no supports are ever needed."
        }
      ],
      discussionPrompts: [
        "If you want to 3D print the letter 'T', how would you orient it on the print bed to avoid supports? (Upside down!).",
        "What is the difference between normal blocky supports and organic tree supports?"
      ],
      standards: [
        "CSTA 2-AP-17: Systematically design and iteratively develop computational artifacts.",
        "NITI Aayog ATL Curriculum Module 4: Overhang Physics, Support Structures, and Part Orientation."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 56: Decoding G-Code & Heated Bed Adhesion",
    shortTitle: "56. G-Code & Bed Adhesion",
    subtitle: "Speaking Robot Language: G0/G1 Cartesian Moves, Nozzle Heat (205°C) & Bed Leveling",
    summary: "Become fluent in the universal language of 3D printers! Decode raw G-code machine commands, master heated bed adhesion physics (60°C), and achieve the perfect first layer squish.",
    mascotMsg: "Look under the hood of your 3D printer! 🤖 G-code is the secret robot code telling the stepper motors where to drive and how much hot plastic to pump. Let's run a full print sequence!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "3D Printing & Slicing",
    labId: "slicer",
    analogy: {
      headline: "The Etch-a-Sketch & The Hot Glue Gun",
      story: "Imagine an automated Etch-a-Sketch attached to a hot glue gun. To draw a square, you tell it: 'Drive to (0,0), heat to 200°C, drive to (50,0) while squeezing 2cm of glue, then drive to (50,50)'. That is G-code! Commands starting with 'G' control motion (G28 = Go to Home Origin, G1 = Extrude while moving). Commands starting with 'M' control machine settings (M104 = Heat Nozzle, M140 = Heat Bed).",
      hardwareMetaphor: "The A4988 / TMC2209 stepper motor drivers convert G-code pulses into magnetic micro-steps for the X, Y, Z axes and extruder."
    },
    jargonBuster: [
      {
        word: "G28 (Auto Home)",
        pronunciation: "JEE twenty-eight",
        analogy: "Returning to Home Base",
        definition: "Commands all 3 axes to hit their physical optical or mechanical limit switches to establish (0,0,0)."
      },
      {
        word: "G1 (Linear Move)",
        pronunciation: "JEE one",
        analogy: "Draw Line with Glue",
        definition: "Moves the nozzle in a straight line while simultaneously extruding plastic (E axis)."
      },
      {
        word: "First Layer Squish",
        pronunciation: "FURST LAY-er Skwish",
        analogy: "Spreading Butter on Toast",
        definition: "The slight flattening of the first plastic line against the heated bed to ensure strong adhesion."
      },
      {
        word: "Warping",
        pronunciation: "WORP-ing",
        analogy: "Curling Edges of Dried Mud",
        definition: "When cooling plastic shrinks unevenly, causing corners of the print to lift off the bed."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "3D PRINTER G-CODE START SEQUENCE:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "M140 S60 ; Set Heated Bed Temperature to 60°C (Prevents PLA warping)", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "M104 S205 ; Set Extruder Nozzle Temperature to 205°C (Melts PLA plastic)", indent: 1, tag: "setup" },
        { id: "h4", line: 4, text: "G28 ; Auto-Home all 3 axes to X=0, Y=0, Z=0 endstops", indent: 1, tag: "setup" },
        { id: "h5", line: 5, text: "G1 Z0.20 F1200 ; Lower nozzle to 0.20mm first layer height", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "G1 X100 Y50 E5.0 F1500 ; Extrude purge line to prime nozzle pressure", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "3D PRINT ENGINE RUNNING: First layer squish verified 100%!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "; Standard Marlin / RepRap Start G-Code", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "M190 S60 ; Wait for bed to reach 60C", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "M109 S205 ; Wait for nozzle to reach 205C", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "G28 ; Home all axes", indent: 0, tag: "setup" },
        { id: "c5", line: 5, text: "G92 E0 ; Reset Extruder position", indent: 0, tag: "code" },
        { id: "c6", line: 6, text: "G1 Z2.0 F3000 ; Move Z Axis up", indent: 0, tag: "code" },
        { id: "c7", line: 7, text: "G1 X10.1 Y20 Z0.28 F5000.0 ; Move to start position", indent: 0, tag: "code" },
        { id: "c8", line: 8, text: "G1 X10.1 Y200.0 Z0.28 F1500.0 E15 ; Draw first prime line", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Numerical Control (CNC), G-Code Syntax & Thermodynamic Adhesion",
      pedagogy: "Bridges software simulation to raw machine control. Demystifies G-code by showing students that industrial factory CNC mills, laser cutters, and 3D printers all obey the exact same motion vocabulary.",
      misconceptions: [
        {
          title: "Misconception: 'If my print comes off the bed halfway through, should I turn up print speed?'",
          detail: "No! That is caused by poor bed adhesion. The bed is either unlevel (nozzle too high), greasy from finger oils, or the heated bed is too cold. Clean the PEI sheet with isopropyl alcohol and level the bed."
        }
      ],
      discussionPrompts: [
        "Why does a 3D printer print a 'purge line' or 'skirt' around the part before starting the actual model?",
        "What happens if you command G1 X200 when your printer's build plate is only 150mm wide? (Limit crash)."
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that model physical objects.",
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification.",
        "NITI Aayog ATL Curriculum Module 4 Capstone: Digital G-Code Verification & Additive Manufacturing Execution."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

if "const SLICER_LESSONS_DATA =" not in content:
    target = "window.LESSONS_DATA = LESSONS_DATA;"
    new_content = content.replace(target, slicer_lessons_code.strip() + "\n\n" + target)
    new_content = new_content.replace(
        "window.DMM_LESSONS_DATA = DMM_LESSONS_DATA;",
        "window.DMM_LESSONS_DATA = DMM_LESSONS_DATA;\nwindow.SLICER_LESSONS_DATA = SLICER_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SLICER_LESSONS_DATA inserted successfully into js/lessons.js!")
else:
    print("SLICER_LESSONS_DATA already in js/lessons.js.")
