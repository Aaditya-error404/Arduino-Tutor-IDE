with open('js/simulation.js', 'r', encoding='utf-8') as f:
    text = f.read()

split_target = "      ctx.fillText('3-Channel 8-Bit PWM (490Hz Duty Cycles)', w - 215, h - 3);\n      });"
# If not matching exact text, let's find the 3-Channel 8-Bit PWM line
marker = "ctx.fillText('3-Channel 8-Bit PWM (490Hz Duty Cycles)', w - 215, h - 3);"
pos = text.find(marker)
if pos == -1:
    print('Marker not found!')
else:
    # Find next newline after marker
    end_of_rgb = text.find('\n', pos)
    # The clean rest of the file
    rest = """

    } else if (this.activeLab === 'sonar') {
      const trigY = h * 0.35;
      const echoY = h * 0.70;

      // Channel 1: Trigger Pin 12 (10µs pulse)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, trigY);
      const trigPulseStart = 30;
      const trigPulseWidth = 8;
      ctx.lineTo(trigPulseStart, trigY);
      ctx.lineTo(trigPulseStart, trigY - 30);
      ctx.lineTo(trigPulseStart + trigPulseWidth, trigY - 30);
      ctx.lineTo(trigPulseStart + trigPulseWidth, trigY);
      ctx.lineTo(w, trigY);
      ctx.stroke();

      // Channel 2: Echo Pin 11 (variable width pulse proportional to distance)
      const echoPulseStart = 45;
      const echoPulseWidth = Math.max(12, Math.min(140, (this.sonarDistanceCm / 200.0) * 140));
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, echoY);
      ctx.lineTo(echoPulseStart, echoY);
      ctx.lineTo(echoPulseStart, echoY - 35);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY - 35);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY);
      ctx.lineTo(w, echoY);
      ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('CH1 (Trig Pin 12): 10µs Pulse (5V)', 10, trigY - 36);

      ctx.fillStyle = '#f59e0b';
      ctx.fillText('CH2 (Echo Pin 11): ' + this.sonarDurationUs + 'µs Pulse (5V) -> ' + this.sonarDistanceCm.toFixed(1) + ' cm', 10, echoY - 42);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(echoPulseStart, echoY + 12);
      ctx.lineTo(echoPulseStart + echoPulseWidth, echoY + 12);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px "Inter", sans-serif';
      ctx.fillText('Flight Time: ' + this.sonarDurationUs + ' µs', echoPulseStart + 4, echoY + 24);

    } else if (this.activeLab === 'temp') {
      const v = this.tempVolts;
      const yLow = h * 0.78;
      const yHigh = h * 0.22;
      const yVal = yLow - ((v / 2.0) * (yLow - yHigh));

      ctx.lineWidth = 2.2;
      ctx.strokeStyle = this.tempAlarmActive ? '#ef4444' : '#22c55e';
      ctx.shadowColor = ctx.strokeStyle;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(0, yVal);
      ctx.lineTo(w, yVal);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('Pin A2: ' + v.toFixed(3) + 'V (' + Math.round(v * 1000) + 'mV) -> ' + this.tempC.toFixed(1) + '°C', 10, yVal - 8);

    } else {
      // Default: Servo 50Hz PWM pulse
      const yLow = h * 0.75;
      const yHigh = h * 0.25;
      const pulseWidthMs = 1.0 + (this.servoAngle / 180.0);
      const highPixels = (pulseWidthMs / 20.0) * w * 2.5;

      ctx.lineWidth = 2.0;
      ctx.strokeStyle = '#f97316';
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 5;

      ctx.beginPath();
      ctx.moveTo(0, yLow);
      ctx.lineTo(25, yLow);
      ctx.lineTo(25, yHigh);
      ctx.lineTo(25 + highPixels, yHigh);
      ctx.lineTo(25 + highPixels, yLow);
      ctx.lineTo(w, yLow);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#f97316';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('PWM: ' + pulseWidthMs.toFixed(2) + 'ms (50Hz / 20ms Frame) -> ' + this.servoAngle + '°', 10, yHigh - 8);
    }
  }

  stop() {
    this.isRunning = false;
    if (this.timerId) clearTimeout(this.timerId);
    if (this.scopeAnimId) cancelAnimationFrame(this.scopeAnimId);
  }
}

// Global Singleton Instance
window.circuitSimulation = new CircuitSimulation();
"""
    new_text = text[:end_of_rgb] + rest
    with open('js/simulation.js', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Successfully restored simulation.js!')
