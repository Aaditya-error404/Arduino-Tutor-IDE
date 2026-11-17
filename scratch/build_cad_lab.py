# -*- coding: utf-8 -*-
"""
Script to inject CAD_LESSONS_DATA into js/lessons.js
and update window exports.
"""

cad_lessons_code = '''
const CAD_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 45: The 3D World & The Workplane",
    shortTitle: "45. 3D Space & Workplane",
    subtitle: "Navigating 3D Cartesian Coordinates: Width (X), Depth (Y), and Height (Z)",
    summary: "Step out of flat 2D drawings into 3D isometric space! Learn how Tinkercad creates physical objects on a virtual build plate using millimeter coordinates.",
    mascotMsg: "Welcome to the 3D Maker Dimension! 🧊 In real life, physical objects don't just have width and height — they have DEPTH. Let's master the 3D coordinate system and build our first solid primitive!",
    difficulty: "Beginner",
    duration: "15 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The LEGO Gridded Construction Baseplate",
      story: "Imagine sitting down with a brand-new LEGO baseplate. You can build bricks to the left or right (X axis), toward you or away from you (Y axis), and stack bricks upward toward the ceiling (Z axis). Tinkercad's virtual Workplane is exactly like that LEGO plate, measured in precision metric millimeters! Every physical gadget you hold in your hands — your phone, a robot chassis, a game controller — started as simple geometric 3D shapes placed onto a workplane.",
      hardwareMetaphor: "The 3D Workplane is the build bed of a 3D printer; X is the printhead moving left-right, Y is the bed sliding front-back, and Z is the vertical gantry rising layer-by-layer!"
    },
    jargonBuster: [
      {
        word: "Workplane",
        pronunciation: "WURK-playn",
        analogy: "The Desktop Grid",
        definition: "The virtual ground surface where you place, align, and stack 3D objects."
      },
      {
        word: "Cartesian Axes",
        pronunciation: "kar-TEE-zhun AK-seez",
        analogy: "Three City Streets",
        definition: "Three perpendicular directions in space: X (Width/Red), Y (Depth/Green), and Z (Height/Blue)."
      },
      {
        word: "Primitive",
        pronunciation: "PRIM-ih-tiv",
        analogy: "Basic Wooden Building Blocks",
        definition: "Fundamental 3D shapes like cubes, cylinders, spheres, and wedges that form complex models."
      },
      {
        word: "Isometric",
        pronunciation: "eye-soh-MET-rik",
        analogy: "Video Game Bird's-Eye View",
        definition: "A 3D drawing angle where parallel lines never converge, keeping true proportions visible."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Define metric build environment in millimeters:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Set grid resolution to 1.0mm snap increments", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Spawn a Solid Geometric Cube on the Workplane:", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Set Width (X) = 20.0 mm (left-to-right)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Set Depth (Y) = 20.0 mm (front-to-back)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Set Height (Z) = 20.0 mm (vertical elevation)", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Calculate resulting solid volume:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Volume = 20 * 20 * 20 = 8,000 cubic millimeters (mm³)", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// OpenSCAD / Procedural C++ CAD Modeling", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "$fn = 64; // High-resolution polygon facets", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "module createSolidBox(x, y, z) {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  // Render parametric solid cube at origin", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "  cube(size = [x, y, z], center = true);", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "block-end" },
        { id: "c8", line: 8, text: "createSolidBox(20.0, 20.0, 20.0);", indent: 0, tag: "code" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Spatial Reasoning, Isometric Projection & Metric Scaling",
      pedagogy: "Transforms abstract Cartesian math (X, Y, Z coordinates) into tangible 3D engineering models. Students develop spatial intuition, volume computation, and metric system fluency.",
      misconceptions: [
        {
          title: "Misconception: 'Can you build a physical 3D object from a single flat 2D picture?'",
          detail: "A flat 2D picture only contains width and height. A 3D CAD model requires depth (Z) and watertight solid volume data (vertices, edges, and polygon face normals) so slicer software can calculate physical toolpaths."
        }
      ],
      discussionPrompts: [
        "Why do mechanical engineers worldwide use metric millimeters (mm) instead of inches for 3D printing and robotics?",
        "If you double all three dimensions of a cube from 10mm to 20mm, why does the volume multiply by 8 times instead of 2?"
      ],
      standards: [
        "CSTA 2-CS-02: Design and iteratively develop computational artifacts that model physical objects.",
        "NGSS MS-ETS1-2: Evaluate competing design solutions using a systematic process to determine how well they meet criteria and constraints.",
        "NITI Aayog ATL Curriculum Module 1: Introduction to 3D Design, Spatial Thinking, and Tinkercad Basics."
      ]
    }
  },
  {
    id: 2,
    title: "Lesson 46: The Magic of Holes & CSG Booleans",
    shortTitle: "46. Hole Cuts & CSG Booleans",
    subtitle: "Constructive Solid Geometry: Sculpting Real-World Parts with Negative Space",
    summary: "Discover how every complex mechanical component is born! By combining solid shapes with negative 'hole' shapes and grouping them, we carve holes, slots, and grooves.",
    mascotMsg: "Here is the coolest superpower in 3D design: a 'Hole' is a shape made of virtual anti-matter! When you group a solid shape with a hole shape, the hole bites away its exact volume like a cookie cutter! 🍪✨",
    difficulty: "Beginner",
    duration: "18 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Cookie Cutter & Apple Corer",
      story: "Think about making hollow donuts or coring an apple. You start with a solid ball of dough, take a sharp metal tube, and push it straight through the middle. When you pull the tube out, you're left with a perfect hole! In 3D CAD, this mathematical operation is called Constructive Solid Geometry (CSG) Boolean Difference: Shape A (Solid Dough) MINUS Shape B (Hole Cylinder) = Hollow Mechanical Bearing!",
      hardwareMetaphor: "Drilling a hole in a metal robot bracket on a drill press: the rotating drill bit removes solid aluminum chips, leaving an empty cylindrical shaft."
    },
    jargonBuster: [
      {
        word: "CSG",
        pronunciation: "SEE-ess-jee (Constructive Solid Geometry)",
        analogy: "Sculpting with Math",
        definition: "A method of creating complex 3D shapes by adding (Union) or subtracting (Difference) simple solids."
      },
      {
        word: "Boolean Difference",
        pronunciation: "BOO-lee-un DIF-er-ens",
        analogy: "A Cookie Cutter Bite",
        definition: "Subtracting a negative 'hole' shape from a solid shape: Solid A - Hole B."
      },
      {
        word: "Grouping",
        pronunciation: "GROOP-ing",
        analogy: "Melting Bricks Together",
        definition: "Locking multiple shapes together into a single permanent 3D object in Tinkercad."
      },
      {
        word: "Negative Space",
        pronunciation: "NEG-uh-tiv Spayss",
        analogy: "Empty Donut Hole",
        definition: "The hollow or empty volume carved out inside a physical solid."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Create Solid Base Object (Shape A):", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Spawn Solid Box: Width = 20mm, Depth = 20mm, Height = 20mm", indent: 1, tag: "code" },
        { id: "h3", line: 3, text: "STEP 2: Create Negative Cutting Tool (Shape B):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Spawn Hole Cylinder: Diameter = 10mm, Height = 30mm", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Pass cylinder through the center of the solid box", indent: 1, tag: "setup" },
        { id: "h6", line: 6, text: "STEP 3: Execute CSG Boolean Difference (Group):", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "Result = Solid Box MINUS Hole Cylinder = Bearing Block with Through-Hole!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// CSG Boolean Difference in Procedural CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "difference() {", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "  // Positive Solid: Base Box (20x20x20mm)", indent: 1, tag: "comment" },
        { id: "c4", line: 4, text: "  cube([20, 20, 20], center = true);", indent: 1, tag: "code" },
        { id: "c5", line: 5, text: "", indent: 1, tag: "empty" },
        { id: "c6", line: 6, text: "  // Negative Cutter: Through-Hole Cylinder", indent: 1, tag: "comment" },
        { id: "c7", line: 7, text: "  cylinder(r = 5.0, h = 32.0, center = true, $fn = 64);", indent: 1, tag: "code" },
        { id: "c8", line: 8, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Boolean Set Theory & Constructive Solid Geometry (CSG)",
      pedagogy: "Connects mathematical Venn diagrams and set subtraction ($A \\setminus B$) directly to physical computer-aided design and subtractive manufacturing.",
      misconceptions: [
        {
          title: "Misconception: 'If a hole cylinder is shorter than the solid cube, will it make a through-hole?'",
          detail: "No! A hole only cuts where it physically intersects the solid. If a 10mm tall hole is inside a 20mm cube, it creates a blind pocket/recess, not a through-hole. To guarantee a through-hole, always make the hole taller than the solid."
        }
      ],
      discussionPrompts: [
        "Can you name 3 everyday items in your classroom that were made using CSG Boolean subtraction? (e.g., coffee mug handle hole, pencil sharpener opening).",
        "How is CSG subtraction in 3D CAD similar to using an eraser on paper, and how is it different?"
      ],
      standards: [
        "NGSS MS-ETS1-4: Develop a model to generate data for iterative testing and modification of a proposed object.",
        "NITI Aayog ATL Curriculum Module 2: Grouping, Hole Properties, and CSG Modeling in Tinkercad."
      ]
    }
  },
  {
    id: 3,
    title: "Lesson 47: Precision Alignment & Ruler Tools",
    shortTitle: "47. Alignment & Ruler Guides",
    subtitle: "Eliminate Eyeball Guesswork with Center, Edge, and Concentric Alignment",
    summary: "Learn why professional engineers never 'eyeball' parts. Use Tinkercad's Alignment handles and Ruler guides to align screw holes to the exact micrometer center.",
    mascotMsg: "If a robot screw hole is off by even 1 millimeter, your motor screws won't fit through the chassis! Let's lock our shapes together with precision centerline alignment! 📐🎯",
    difficulty: "Intermediate",
    duration: "18 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Architect's Magnetic T-Square",
      story: "Try drawing two concentric circles on paper freehand without a compass. It is virtually impossible to get the centers to match! But when an architect uses a T-square and snap guides, lines click into place perfectly. In Tinkercad, the Align Tool shows you 9 alignment pins: left edge, exact center, and right edge across all three dimensions. With a single click, your hole snaps right to the true center of the solid block!",
      hardwareMetaphor: "Centering a drill press workpiece in a machine vise: using an edge finder and dial indicator to locate the exact center of rotation."
    },
    jargonBuster: [
      {
        word: "Align Tool",
        pronunciation: "uh-LYNE Tool",
        analogy: "Magnetic Guide Pins",
        definition: "A tool with 3 pins per axis that shifts objects to share a common center, top, or edge."
      },
      {
        word: "Snap Grid",
        pronunciation: "SNAP Grid",
        analogy: "Invisible Magnetic Pegs",
        definition: "Forces objects and measurements to jump in exact steps (e.g. 1.0mm, 0.5mm, 0.1mm)."
      },
      {
        word: "Concentric",
        pronunciation: "kun-SEN-trik",
        analogy: "Bullseye Rings on a Dartboard",
        definition: "Two or more circular objects that share the exact same center point."
      },
      {
        word: "Ruler Tool",
        pronunciation: "ROO-lur Tool",
        analogy: "Digital Caliper",
        definition: "Locks an origin point (0,0) and displays live numerical distances to every edge of a part."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Select multiple objects on the workplane:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Select Solid Box + Hole Cylinder together", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "STEP 2: Engage Precision Alignment tool (Shortcut: 'L'):", indent: 0, tag: "header" },
        { id: "h4", line: 4, text: "Click Center Pin along X axis (Width Centerline)", indent: 1, tag: "code" },
        { id: "h5", line: 5, text: "Click Center Pin along Y axis (Depth Centerline)", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "Keep Z axis through-hole elevation centered", indent: 1, tag: "code" },
        { id: "h7", line: 7, text: "STEP 3: Verify Zero-Offset Concentricity:", indent: 0, tag: "header" },
        { id: "h8", line: 8, text: "Both objects now share exact midpoint (X=0.0mm, Y=0.0mm)!", indent: 1, tag: "explanation" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Parametric Alignment Matrix in C++ CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "struct Vec3D { float x, y, z; };", indent: 0, tag: "block-start" },
        { id: "c3", line: 3, text: "", indent: 0, tag: "empty" },
        { id: "c4", line: 4, text: "Vec3D alignToCenter(const Vec3D& parent, const Vec3D& child) {", indent: 0, tag: "block-start" },
        { id: "c5", line: 5, text: "  // Calculate exact delta offset for concentric alignment", indent: 1, tag: "comment" },
        { id: "c6", line: 6, text: "  return { (parent.x - child.x)/2.0f, (parent.y - child.y)/2.0f, 0.0f };", indent: 1, tag: "code" },
        { id: "c7", line: 7, text: "}", indent: 0, tag: "block-end" },
        { id: "c8", line: 8, text: "// Offset = {0.0mm, 0.0mm} -> Perfectly Concentric!", indent: 0, tag: "comment" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Precision Metrology, Geometric Constraints & Symmetric Design",
      pedagogy: "Teaches geometric symmetry and coordinate constraints. Reinforces why robotic assemblies require strict mechanical tolerances rather than manual visual positioning.",
      misconceptions: [
        {
          title: "Misconception: 'If it looks centered on my screen, is it accurate enough for 3D printing?'",
          detail: "Screen perspective distortion can easily hide a 1mm misalignment that makes mating gears grind or screw threads bind. Always use numerical snap grids and the Align tool."
        }
      ],
      discussionPrompts: [
        "Why do 3D printers have snap grid resolutions down to 0.1mm or 0.05mm?",
        "If you are designing a wheel and an axle, what happens if the axle hole is 0.5mm off-center? (Eccentric wobble)."
      ],
      standards: [
        "CSTA 2-CS-02: Design computational models that reflect mechanical constraints.",
        "NITI Aayog ATL Curriculum Module 3: Alignment, Mirroring, and Metrology Tools in Tinkercad."
      ]
    }
  },
  {
    id: 4,
    title: "Lesson 48: Robot Bracket Engineering: Tolerances & Wall Thickness",
    shortTitle: "48. Robot Bracket & Tolerances",
    subtitle: "Real-World Digital Fabrication: Minimum 2mm Walls, Screw Clearances & STL Export",
    summary: "Design an actual 3D-printable mounting bracket for your SG90 Micro Servo from Lab 2! Factor in plastic thermal shrinkage (+0.3mm tolerance) and export for the 3D printer.",
    mascotMsg: "Awesome job, Maker! Now let's combine physical computing with digital fabrication by engineering a custom bracket for our SG90 servo motor! Let's make sure it's strong and fits like a glove! 🦾🛠️",
    difficulty: "Advanced",
    duration: "25 min",
    category: "3D CAD",
    labId: "cad",
    analogy: {
      headline: "The Tailored Shoe (Thermal Shrinkage & Clearance Fits)",
      story: "If your foot is exactly 25.0cm long and you buy a steel shoe that is exactly 25.000cm, you will never get your foot inside! You need a 2mm clearance so your foot can slip in comfortably. When a 3D printer lays down hot melted PLA plastic at 200°C, the plastic slightly contracts and shrinks as it cools down! An experienced ATL engineer always adds a 0.2mm to 0.4mm clearance tolerance to holes so screws and motors slide in smoothly without cracking.",
      hardwareMetaphor: "Engineering fit classes: Interference (press-fit), Transition, and Clearance (slide-fit) in mechanical robotics."
    },
    jargonBuster: [
      {
        word: "Clearance Tolerance",
        pronunciation: "KLEER-uns TOL-er-uns",
        analogy: "The Shoe Breathing Room",
        definition: "Intentional extra gap added to holes (+0.3mm) so physical parts fit together after printing."
      },
      {
        word: "Wall Thickness",
        pronunciation: "WAWL THIK-ness",
        analogy: "The Cardboard Box Sturdiness",
        definition: "The solid plastic perimeter thickness. Should always be at least 2.0mm to prevent breaking."
      },
      {
        word: "M3 Screw",
        pronunciation: "EM-three Skroo",
        analogy: "Standard Robot Screw",
        definition: "Metric 3mm screw. Clearance hole should be designed at Ø3.4mm so the screw slides through freely."
      },
      {
        word: "STL File",
        pronunciation: "ESS-tee-el",
        analogy: "A 3D PDF Blueprint",
        definition: "Standard Tessellation Language: 3D file format of triangular facets read by 3D printer slicers."
      }
    ],
    defaultCode: {
      human: [
        { id: "h1", line: 1, text: "STEP 1: Define SG90 Servo Pocket Specifications:", indent: 0, tag: "header" },
        { id: "h2", line: 2, text: "Motor Body: 22.8mm Width x 12.0mm Depth x 22.5mm Height", indent: 1, tag: "setup" },
        { id: "h3", line: 3, text: "Add +0.4mm 3D Printing Tolerance: 23.2mm x 12.4mm pocket", indent: 1, tag: "code" },
        { id: "h4", line: 4, text: "STEP 2: Define Structural Wall Thickness (Minimum 2.5mm):", indent: 0, tag: "header" },
        { id: "h5", line: 5, text: "Outer Bracket Shell: 28.2mm Width x 17.4mm Depth", indent: 1, tag: "code" },
        { id: "h6", line: 6, text: "STEP 3: Bore Dual M3 Chassis Mounting Flange Holes:", indent: 0, tag: "header" },
        { id: "h7", line: 7, text: "2x Cylinders at Ø3.4mm spaced 28.0mm center-to-center", indent: 1, tag: "code" },
        { id: "h8", line: 8, text: "STEP 4: Export Watertight STL Mesh for 3D Slicer!", indent: 0, tag: "header" }
      ],
      cpp: [
        { id: "c1", line: 1, text: "// Parametric SG90 Servo Bracket in C++ CAD", indent: 0, tag: "comment" },
        { id: "c2", line: 2, text: "const float TOLERANCE = 0.4; // 3D print thermal compensation", indent: 0, tag: "setup" },
        { id: "c3", line: 3, text: "const float WALL_THICKNESS = 2.5; // Structural rigidity", indent: 0, tag: "setup" },
        { id: "c4", line: 4, text: "", indent: 0, tag: "empty" },
        { id: "c5", line: 5, text: "module sg90Bracket() {", indent: 0, tag: "block-start" },
        { id: "c6", line: 6, text: "  difference() {", indent: 1, tag: "block-start" },
        { id: "c7", line: 7, text: "    // Solid Outer Bracket Housing", indent: 2, tag: "comment" },
        { id: "c8", line: 8, text: "    cube([22.8 + 2*WALL_THICKNESS, 12.0 + 2*WALL_THICKNESS, 20]);", indent: 2, tag: "code" },
        { id: "c9", line: 9, text: "    // Motor Pocket with Tolerance", indent: 2, tag: "comment" },
        { id: "c10", line: 10, text: "    translate([WALL_THICKNESS, WALL_THICKNESS, 0])", indent: 2, tag: "code" },
        { id: "c11", line: 11, text: "      cube([22.8 + TOLERANCE, 12.0 + TOLERANCE, 25]);", indent: 3, tag: "code" },
        { id: "c12", line: 12, text: "  }", indent: 1, tag: "block-end" },
        { id: "c13", line: 13, text: "}", indent: 0, tag: "block-end" }
      ]
    },
    teacherGuide: {
      pedagogyTitle: "Design for Additive Manufacturing (DFAM) & Engineering Tolerances",
      pedagogy: "Connects digital virtual CAD to physical reality. Introduces students to material properties, thermal expansion/contraction of thermoplastics, and standardized fasteners.",
      misconceptions: [
        {
          title: "Misconception: 'If a screw is M3 (3mm diameter), should the mounting hole in CAD be exactly 3.0mm?'",
          detail: "No! 3D printer slicers approximate circular arcs with straight polyline segments, and hot molten filament slightly squashes inward. An exact 3.0mm CAD hole will print at roughly 2.7mm, binding the screw! Designing it at 3.3mm to 3.4mm gives an effortless clearance fit."
        }
      ],
      discussionPrompts: [
        "Why is a minimum wall thickness of 2.0mm required for FDM 3D printing of robot parts?",
        "If you want to attach your SG90 servo to an aluminum robot chassis, what fastener is better: an M3 screw with a nylon locknut, or hot glue? Why?"
      ],
      standards: [
        "NGSS MS-ETS1-3: Analyze data from tests to determine similarities and differences among several design solutions.",
        "CSTA 2-AP-16: Incorporate existing code, media, and design libraries into original computational artifacts.",
        "NITI Aayog ATL Curriculum Module 4: 3D Printing Fundamentals, Slicing Preparation, and Rapid Prototyping."
      ]
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert CAD_LESSONS_DATA before window.LESSONS_DATA exports
target = "window.LESSONS_DATA = LESSONS_DATA;"
if "const CAD_LESSONS_DATA =" not in content:
    replacement = cad_lessons_code.strip() + "\n\n" + target
    new_content = content.replace(target, replacement)
    
    # Also append window export
    new_content = new_content.replace(
        "window.LCD_LESSONS_DATA = LCD_LESSONS_DATA;",
        "window.LCD_LESSONS_DATA = LCD_LESSONS_DATA;\nwindow.CAD_LESSONS_DATA = CAD_LESSONS_DATA;"
    )
    
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("CAD_LESSONS_DATA inserted successfully!")
else:
    print("CAD_LESSONS_DATA already present in js/lessons.js")
