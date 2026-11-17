# -*- coding: utf-8 -*-
"""
Script to insert RFID_LESSONS_DATA into js/lessons.js
"""

rfid_lessons_code = '''
const RFID_LESSONS_DATA = [
  {
    id: 1,
    title: "Lesson 81: Near-Field Resonant Induction & The SPI 4-Wire Bus",
    shortTitle: "81. RFID Resonant Induction",
    subtitle: "13.56MHz Magnetic Flux: Batteryless Transponders & High-Speed SPI (10Mbps)",
    summary: "Discover contactless magic! Understand how the RC522 coil antenna emits a 13.56MHz alternating magnetic field that wirelessly powers up the chip inside passive cards through resonant inductive coupling, and how the Arduino reads card responses over the 4-wire SPI bus.",
    mascotMsg: "Tap to pay! 💳 Ever wonder how hotel keycards or Apple Pay work without batteries? The reader coil creates an invisible magnetic forcefield. When you bring your card close, its internal coil harvests electricity directly out of thin air! Let's explore the wireless physics!",
    difficulty: "Advanced",
    duration: "22 min",
    category: "Wireless & Security",
    labId: "rfid",
    analogy: {
      headline: "The Acoustic Tuning Fork Symphony",
      story: "If you strike a tuning fork tuned to 440Hz and hold it near an untouched tuning fork across the table, the second fork begins vibrating and singing on its own! That is resonance. The RC522 antenna vibrates magnetic waves at 13.56MHz; the tiny coil inside your card catches that exact magnetic frequency, charging an internal capacitor to boot up its microchip!",
      hardwareMetaphor: "LC resonant tank circuit tuned to 13.56MHz; full-wave diode bridge rectifies AC RF field into 3.3V DC to power MIFARE logic."
    },
    jargonBuster: [
      {
        word: "RFID / NFC (13.56MHz)",
        pronunciation: "AR-eff-eye-dee",
        analogy: "The Invisible Short-Range Wireless Wave",
        definition: "Radio Frequency Identification operating at High Frequency (HF 13.56MHz) with typical communication range under 5 cm."
      },
      {
        word: "Resonant Inductive Coupling",
        pronunciation: "REZ-uh-nunt in-DUK-tiv",
        analogy: "Wireless Energy Catching the Wave",
        definition: "Transfer of electrical energy between two matched LC coil antennas via high-frequency alternating magnetic fields."
      },
      {
        word: "SPI (4-Wire Serial Bus)",
        pronunciation: "Ess-Pee-Eye",
        analogy: "The 4-Lane High-Speed Highway",
        definition: "Synchronous Master-Slave bus using MOSI (Master Out), MISO (Master In), SCK (Clock), and SS (Slave Select) at up to 10Mbps."
      },
      {
        word: "Passive Transponder",
        pronunciation: "PASS-iv tran-SPON-dur",
        analogy: "The Batteryless Energy Harvester",
        definition: "A card or keyfob containing zero batteries that wakes up solely by rectifying power from the reader's RF field."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 81: RC522 RFID SPI Initialization & Card Detection
#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10  // Slave Select Pin
#define RST_PIN 9  // Reset Pin

MFRC522 rfid(SS_PIN, RST_PIN); // Create MFRC522 instance

void setup() {
  Serial.begin(115200);
  SPI.begin();      // Initialize 4-wire SPI bus
  rfid.PCD_Init();  // Initialize MFRC522 reader chip

  Serial.println(F("RC522 13.56MHz Reader Initialized."));
  Serial.println(F("Awaiting contactless transponder..."));
}

void loop() {
  // Check if a new RFID card is within magnetic resonance field
  if (!rfid.PICC_IsNewCardPresent()) return;

  // Read card serial number
  if (!rfid.PICC_ReadCardSerial()) return;

  Serial.print(F("Transponder Detected! UID: "));
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) Serial.print(F(" 0"));
    else Serial.print(F(" "));
    Serial.print(rfid.uid.uidByte[i], HEX);
  }
  Serial.println();

  // Halt PICC to stop repeated reads
  rfid.PICC_HaltA();
  delay(1000);
}`,
      human: `// Plain English Human Translation:
// 1. Include the SPI hardware bus library and the official MFRC522 RFID library.
// 2. Define Pin 10 as Slave Select (SS) and Pin 9 as Reset (RST).
// 3. In setup(), start the SPI bus at high speed and initialize the RC522 antenna coil.
// 4. In loop(), continuously ping the near-field zone: if a card arrives, wake it up!
// 5. Read the card's 4-byte Unique Identifier (UID) over the SPI bus and print in hexadecimal.
// 6. Put the card temporarily to sleep (Halt) so it doesn't trigger 1,000 times a second!`
    },
    stepCheck: {
      instruction: "Tap the RFID Card! Adjust the Carrier Flux Range to bring the card into the 13.56MHz resonant antenna zone, watch the harvested voltage power up the chip, and click 'Verify Resonant Induction'.",
      targetCondition: "inductionVerified"
    }
  },
  {
    id: 2,
    title: "Lesson 82: MIFARE Classic 1K Memory Architecture: Sectors, Blocks & Crypto-1",
    shortTitle: "82. MIFARE Memory Architecture",
    subtitle: "1,024-Byte EEPROM: 16 Sectors x 4 Blocks with Key A, Key B & Access Bits",
    summary: "Master the internal memory map of smart cards! Dive into the 1,024-byte EEPROM organized into 16 independent sectors, inspect the factory-locked Manufacturer Block 0 (4-byte UID), and understand Sector Trailers protected by the Crypto-1 authentication handshake.",
    mascotMsg: "A smart card is a miniature filing cabinet with 16 locked drawers (Sectors)! 🗄️ Drawer 0 holds your birth certificate (UID), while Drawer 1 holds your school lunch money. Each drawer has two secret keys (Key A & Key B). Let's unlock the memory map!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Cybersecurity & Storage",
    labId: "rfid",
    analogy: {
      headline: "The Bank Safe Deposit Vault",
      story: "In a bank vault with 16 safety deposit boxes, Box 0 is the public registry displaying the account number (UID). Boxes 1 through 15 hold private valuables. To open Box 1, you must present the bank's key (Key A) and your personal key (Key B). If the keys match, the access control bits allow you to read or deposit coins!",
      hardwareMetaphor: "1KB EEPROM structured as 16 sectors x 4 data blocks of 16 bytes each; Block 3 of each sector stores encryption keys."
    },
    jargonBuster: [
      {
        word: "UID (Unique Identifier)",
        pronunciation: "YOO-eye-dee",
        analogy: "The Factory Serial Number Inscribed on Stone",
        definition: "A read-only 4-byte or 7-byte serial number burned into Sector 0 Block 0 during factory manufacturing."
      },
      {
        word: "Sector Trailer (Block 3)",
        pronunciation: "SEK-tor TRAY-ler",
        analogy: "The Drawer's Master Keyhole",
        definition: "The 4th block of every sector containing Key A (6 bytes), Access Bits (4 bytes), and Key B (6 bytes)."
      },
      {
        word: "Crypto-1 Cipher",
        pronunciation: "KRIP-toh WUN",
        analogy: "The Secret Handshake Cipher",
        definition: "A proprietary 48-bit stream cipher algorithm implemented in hardware to authenticate MIFARE cards."
      },
      {
        word: "Access Control Bits",
        pronunciation: "AK-sess BITS",
        analogy: "The Read/Write Permission Stamp",
        definition: "3 bits per block that dictate whether data blocks can be read, written, incremented, or decremented."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 82: Reading MIFARE Classic 1K Sector 1 with Key A
#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);
MFRC522::MIFARE_Key key;

void setup() {
  Serial.begin(115200);
  SPI.begin();
  rfid.PCD_Init();

  // Factory default Key A: FF FF FF FF FF FF
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  byte blockAddr = 4; // Sector 1, Block 0 (Absolute Block 4)
  MFRC522::StatusCode status;

  // 1. Authenticate with Sector 1 using Key A
  status = rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, blockAddr, &key, &(rfid.uid));
  if (status != MFRC522::STATUS_OK) {
    Serial.println(F("Authentication Failed!"));
    rfid.PICC_HaltA();
    return;
  }

  // 2. Read 16 bytes of data from Block 4
  byte buffer[18];
  byte size = sizeof(buffer);
  status = rfid.MIFARE_Read(blockAddr, buffer, &size);
  if (status == MFRC522::STATUS_OK) {
    Serial.print(F("Sector 1 Data (Block 4): "));
    for (byte i = 0; i < 16; i++) {
      Serial.print(buffer[i], HEX); Serial.print(F(" "));
    }
    Serial.println();
  }

  rfid.PCD_StopCrypto1(); // Close encrypted session
  rfid.PICC_HaltA();
  delay(1500);
}`,
      human: `// Plain English Human Translation:
// 1. Create a 6-byte cryptographic key initialized to the factory default 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF.
// 2. Detect a card and target Block 4 (which is the first data drawer inside Sector 1).
// 3. Perform the Crypto-1 authentication handshake: present Key A to the card.
// 4. Once the card verifies the key, read all 16 bytes stored inside Block 4.
// 5. Print the 16 bytes in hexadecimal format to inspect stored user data!
// 6. Call StopCrypto1() to lock the sector back up safely before releasing the card.`
    },
    stepCheck: {
      instruction: "Inspect the MIFARE Memory Map! Click on Sector 0 (Manufacturer Block with UID) and Sector 1 (Data Block with Sector Trailer), observe the 16-byte hex dump and access bits, and click 'Verify Memory Structure'.",
      targetCondition: "memoryVerified"
    }
  },
  {
    id: 3,
    title: "Lesson 83: Access Control Security: UID Whitelist & Electronic Door Latch",
    shortTitle: "83. Smart Door Access Control",
    subtitle: "Cryptographic UID Matching: Active Verification, SG90 Servo Deadbolt & Tamper Deny",
    summary: "Build a commercial-grade smart security lock! Read card UIDs, compare against an authorized master whitelist, actuate an SG90 servo deadbolt for 3 seconds on valid credentials, and trigger visual/audio alarms on unauthorized access attempts.",
    mascotMsg: "Halt, who goes there? 🏰 We're building a real security access control system! Scan the authorized blue keyfob, and the servo deadbolt retracts with a happy double-beep. Scan an unknown stranger card, and the alarm sounds while the latch stays deadlocked!",
    difficulty: "Advanced",
    duration: "24 min",
    category: "Access Control & Actuators",
    labId: "rfid",
    analogy: {
      headline: "The Security Guard with the Guest Whitelist",
      story: "At an exclusive VIP club, the bouncer stands at the door with a VIP list. When you arrive, you flash your badge (UID). If your name is on the VIP list, the velvet rope opens for 3 seconds. If your name is absent, red buzzer flashes and the deadbolt remains firmly locked!",
      hardwareMetaphor: "Constant-time byte comparison memcmp(rfid.uid.uidByte, authorizedUID, 4) == 0 preventing timing attacks."
    },
    jargonBuster: [
      {
        word: "Whitelist Authentication",
        pronunciation: "WYTE-list aw-then-tih-KAY-shun",
        analogy: "The VIP Guest List",
        definition: "A security policy that explicitly authorizes designated identifiers while rejecting everything else by default."
      },
      {
        word: "Electronic Deadbolt",
        pronunciation: "DED-bohlt",
        analogy: "The Heavy Steel Locking Pin",
        definition: "A physical mechanical bolt rotated by a servo motor to latch or unlatch secure door frames."
      },
      {
        word: "Constant-Time Comparison",
        pronunciation: "KON-stunt TYME",
        analogy: "The Poker Face Verifier",
        definition: "A cryptographic comparison routine that always takes the exact same number of clock cycles to prevent timing attacks."
      },
      {
        word: "Tamper Lockout",
        pronunciation: "TAM-pur LOK-owt",
        analogy: "The Alarm Siren After 3 Wrong Passwords",
        definition: "Security cooldown logic locking the system and alerting operators after consecutive unauthorized attempts."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 83: RFID Door Access Control with Servo Deadbolt
#include <SPI.h>
#include <MFRC522.h>
#include <Servo.h>

MFRC522 rfid(10, 9);
Servo lockServo;

const byte MASTER_UID[4] = {0xA3, 0x7F, 0x4E, 0x12}; // Authorized Keyfob
const int GREEN_LED = 6;
const int RED_LED = 5;

void setup() {
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  lockServo.attach(3);
  lockServo.write(0); // 0° = Locked Deadbolt
  SPI.begin();
  rfid.PCD_Init();
  Serial.begin(115200);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  // Compare Scanned UID with Authorized Master UID
  bool accessGranted = true;
  for (byte i = 0; i < 4; i++) {
    if (rfid.uid.uidByte[i] != MASTER_UID[i]) {
      accessGranted = false;
      break;
    }
  }

  if (accessGranted) {
    Serial.println(F("ACCESS GRANTED! Unlocking door for 3 seconds..."));
    digitalWrite(GREEN_LED, HIGH);
    lockServo.write(90); // 90° = Unlocked
    delay(3000);
    lockServo.write(0);  // Relock
    digitalWrite(GREEN_LED, LOW);
  } else {
    Serial.println(F("ACCESS DENIED! Unauthorized card detected."));
    digitalWrite(RED_LED, HIGH);
    delay(1500);
    digitalWrite(RED_LED, LOW);
  }

  rfid.PICC_HaltA();
}`,
      human: `// Plain English Human Translation:
// 1. Define the authorized card UID as [0xA3, 0x7F, 0x4E, 0x12] (the blue keyfob).
// 2. Attach an SG90 servo motor on Pin 3 to control the physical door latch (0° = Locked, 90° = Open).
// 3. When a card is scanned, compare all 4 bytes of its UID against the authorized master array.
// 4. If all 4 bytes match: Flash Green LED, rotate servo to 90° to open the door, wait 3 seconds, and relock!
// 5. If bytes mismatch: Flash Red LED, keep the deadbolt locked at 0°, and log the security intrusion!`
    },
    stepCheck: {
      instruction: "Test Door Security! Click 'Scan Authorized Keyfob (A3 7F 4E 12)' to watch the servo deadbolt unlock with a green pass, then click 'Scan Stranger Card (D9 1C 88 5B)' to verify red denial, and click 'Verify Door Security'.",
      targetCondition: "accessVerified"
    }
  },
  {
    id: 4,
    title: "Lesson 84: Read/Write Sector Data & RFID Digital Wallet Studio",
    shortTitle: "84. Digital RFID Wallet",
    subtitle: "Value Blocks: Integer Balance Decrement, Cryptographic Key Authentication & Top-Up",
    summary: "Engineer a cashless digital wallet system! Authenticate with Sector 1 using Key A (0xFF 0xFF 0xFF 0xFF 0xFF 0xFF), format Block 4 as a MIFARE Value Block, and perform authenticated cashless balance deductions and top-ups directly on the smart card.",
    mascotMsg: "Tap your card to ride the metro or buy a juice! 🧃 We're not just reading a serial number anymore—we are writing encrypted money directly into the card's memory! Let's build a cashless digital wallet!",
    difficulty: "Advanced",
    duration: "25 min",
    category: "Fintech & Embedded Storage",
    labId: "rfid",
    analogy: {
      headline: "The Stamped Subway Token Card",
      story: "Instead of carrying bulky metal coins, you carry an electronic smart pass. When you tap the turnstile, the computer authenticates your card, subtracts $2.50 from Block 4, and writes the new balance back to the chip before opening the gates—in under 15 milliseconds!",
      hardwareMetaphor: "MIFARE Value Block commands: MIFARE_Decrement(), MIFARE_Increment(), and MIFARE_Transfer()."
    },
    jargonBuster: [
      {
        word: "Value Block",
        pronunciation: "VAL-yoo BLOK",
        analogy: "The Self-Checking Bank Account Ledger",
        definition: "A dedicated 16-byte block storing a 4-byte integer balance alongside its inverted complement to prevent fraud."
      },
      {
        word: "Atomic Transaction",
        pronunciation: "uh-TOM-ik tran-ZAK-shun",
        analogy: "The All-or-Nothing Guarantee",
        definition: "An operation that either completely finishes or completely aborts, preventing partial balance deductions."
      },
      {
        word: "Contactless POS",
        pronunciation: "PAY-ment TER-mi-nul",
        analogy: "The Tap-to-Pay Register",
        definition: "A Point-of-Sale terminal that charges electronic smart cards via RF fields."
      },
      {
        word: "Backup Block Mirroring",
        pronunciation: "BAK-up MIR-or-ing",
        analogy: "The Carbon Copy Receipt",
        definition: "Mirroring balances into a secondary backup block so power loss during write never corrupts the card."
      }
    ],
    defaultCode: {
      cplusplus: `// SparkByte K-12 ATL Robotics Curriculum
// Lab 21, Lesson 84: Cashless RFID Digital Wallet (Deduct & Top-Up)
#include <SPI.h>
#include <MFRC522.h>

MFRC522 rfid(10, 9);
MFRC522::MIFARE_Key key;

const byte WALLET_BLOCK = 4; // Sector 1, Block 0

void setup() {
  SPI.begin();
  rfid.PCD_Init();
  Serial.begin(115200);
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;
}

// Deduct fare from card Value Block
bool deductFare(int32_t amount) {
  rfid.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, WALLET_BLOCK, &key, &(rfid.uid));
  
  MFRC522::StatusCode status;
  status = rfid.MIFARE_Decrement(WALLET_BLOCK, amount);
  if (status != MFRC522::STATUS_OK) return false;

  status = rfid.MIFARE_Transfer(WALLET_BLOCK); // Commit to EEPROM
  return (status == MFRC522::STATUS_OK);
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  Serial.println(F("Card Tapped! Deducting $25 Metro Fare..."));
  if (deductFare(25)) {
    Serial.println(F("TRANSACTION SUCCESS! Remaining balance updated."));
  } else {
    Serial.println(F("Transaction Error or Insufficient Funds!"));
  }

  rfid.PCD_StopCrypto1();
  rfid.PICC_HaltA();
  delay(2000);
}`,
      human: `// Plain English Human Translation:
// 1. Authenticate with Sector 1 using the 6-byte cryptographic key.
// 2. Format Block 4 as a tamper-proof MIFARE Value Block.
// 3. When the card is tapped at the turnstile, call MIFARE_Decrement() to subtract $25.
// 4. Immediately call MIFARE_Transfer() to commit the new balance atomically to EEPROM.
// 5. If successful, display the updated balance and open the gate; if failed, halt with error!`
    },
    stepCheck: {
      instruction: "Operate the Cashless Digital Wallet! Click 'Tap to Pay (-$25)' to deduct fare from the smart card, or click 'Top-Up Balance (+$50)', observe the encrypted block write confirmation, and click 'Deploy RFID Digital Wallet'.",
      targetCondition: "walletDeployed"
    }
  }
];
'''

with open('js/lessons.js', 'r', encoding='utf-8') as f:
    lessons = f.read()

if "RFID_LESSONS_DATA" not in lessons:
    marker = "window.IMU_LESSONS_DATA = IMU_LESSONS_DATA;"
    lessons = lessons.replace(
        marker,
        rfid_lessons_code.strip() + "\n\n" + marker + "\nwindow.RFID_LESSONS_DATA = RFID_LESSONS_DATA;"
    )
    with open('js/lessons.js', 'w', encoding='utf-8') as f:
        f.write(lessons)
    print("RFID_LESSONS_DATA inserted into js/lessons.js successfully!")
else:
    print("RFID_LESSONS_DATA already in js/lessons.js.")

print("Done step 2.")
