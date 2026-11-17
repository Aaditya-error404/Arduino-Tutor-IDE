/**
 * Unified 22-Lab Hardware Component Registry
 *
 * © 2026 SparkByte Studio · Engineered & Licensed by Aaditya Joshi
 */

import React from 'react';
import { LedLabView, ServoLabView, ButtonLabView, PotLabView, BuzzerLabView, DmmLabView } from './BasicsLabs';
import { LdrLabView, TempLabView, SonarLabView, IrLabView, DhtLabView, GasLabView, SoilLabView } from './SensorLabs';
import { RgbLabView, LcdLabView, OledLabView, MotorLabView } from './ActuatorDisplayLabs';
import { SlicerLabView, ImuLabView, RfidLabView, IotLabView } from './AdvancedLabs';
import { CadLabView } from './CadLabView';

interface LabStageRendererProps {
  labId: string;
}

export const LabStageRenderer: React.FC<LabStageRendererProps> = ({ labId }) => {
  switch (labId) {
    case 'led':
      return <LedLabView />;
    case 'servo':
      return <ServoLabView />;
    case 'button':
      return <ButtonLabView />;
    case 'pot':
      return <PotLabView />;
    case 'buzzer':
      return <BuzzerLabView />;
    case 'cad':
      return <CadLabView />;
    case 'dmm':
      return <DmmLabView />;
    case 'ldr':
      return <LdrLabView />;
    case 'rgb':
      return <RgbLabView />;
    case 'temp':
      return <TempLabView />;
    case 'sonar':
      return <SonarLabView />;
    case 'ir':
      return <IrLabView />;
    case 'slicer':
      return <SlicerLabView />;
    case 'dht':
      return <DhtLabView />;
    case 'gas':
      return <GasLabView />;
    case 'lcd':
      return <LcdLabView />;
    case 'oled':
      return <OledLabView />;
    case 'soil':
      return <SoilLabView />;
    case 'motor':
      return <MotorLabView />;
    case 'imu':
      return <ImuLabView />;
    case 'rfid':
      return <RfidLabView />;
    case 'iot':
      return <IotLabView />;
    default:
      return <LedLabView />;
  }
};
