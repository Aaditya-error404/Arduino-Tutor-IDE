with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Extract sonar renderers block from the end
split_marker = '  // =========================================================================\n  // LAB 9: HC-SR04 ULTRASONIC SENSOR & RADAR INTERACTIVE RENDERERS'
if split_marker in text:
    parts = text.split(split_marker)
    main_code = parts[0]
    sonar_code = split_marker + parts[1]

    # Target right before initial app boot
    boot_marker = '  // --- Initial App Boot with Direct URL Parameter Support ---'
    if boot_marker in main_code:
        main_parts = main_code.split(boot_marker)
        # Reassemble with sonar_code placed before boot_marker, still inside DOMContentLoaded
        new_text = main_parts[0] + sonar_code + '\n\n' + boot_marker + main_parts[1]
        with open('js/app.js', 'w', encoding='utf-8') as f:
            f.write(new_text)
        print('Successfully moved sonar renderers inside DOMContentLoaded closure!')
    else:
        print('boot_marker not found!')
else:
    print('split_marker not found!')
