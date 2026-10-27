import type { QuizQuestion } from '../types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'quiz-01',
    topic: 'purpose',
    question: 'What is the primary function of the Central Processing Unit (CPU)?',
    options: [
      'To provide long-term storage for applications and files',
      'To execute program instructions and perform core system computations',
      'To convert AC household power into low-voltage DC power',
      'To directly render high-resolution 3D graphics frames'
    ],
    correctIndex: 1,
    explanation: 'The CPU acts as the brain of the computer, executing program instructions and orchestrating calculations across all system hardware.',
  },
  {
    id: 'quiz-02',
    topic: 'placement',
    question: 'Where should thermal paste be applied during standard PC assembly?',
    options: [
      'Between the bottom of the CPU pins and the motherboard socket',
      'On the top of the RAM memory modules',
      'Between the CPU integrated heat spreader (IHS) and the cooler cold plate',
      'Inside the PCIe x16 slot before seating the graphics card'
    ],
    correctIndex: 2,
    explanation: 'Thermal paste fills microscopic air gaps between the flat metal top of the CPU (the IHS) and the base of the CPU cooler heatsink to ensure optimal thermal conductivity.',
  },
  {
    id: 'quiz-03',
    topic: 'compatibility',
    question: 'Can a DDR4 RAM stick be installed into a DDR5 motherboard slot?',
    options: [
      'Yes, memory slots are backwards-compatible with all previous DDR generations',
      'Yes, but only if the memory speed is downclocked in the BIOS',
      'No, DDR generations have different physical notch positions and pin counts',
      'No, but an adapter cable can connect DDR4 to DDR5'
    ],
    correctIndex: 2,
    explanation: 'Different DDR generations (DDR4 vs DDR5) have unique physical notch locations and voltage requirements to prevent damaging physical mismatches.',
  },
  {
    id: 'quiz-04',
    topic: 'dependency',
    question: 'Why must the CPU be installed before mounting the CPU cooler?',
    options: [
      'The cooler covers and locks access to the CPU socket latch mechanism',
      'The cooler supplies electrical power to the motherboard',
      'Motherboards disable CPU detection if the cooler is mounted first',
      'The BIOS will flash an error code if the cooler bracket is fastened'
    ],
    correctIndex: 0,
    explanation: 'The CPU must be seated and secured by the socket retention arm before mounting the cooler directly on top of the CPU heat spreader.',
  },
  {
    id: 'quiz-05',
    topic: 'compatibility',
    question: 'What determines whether an AMD processor can be mounted on a specific motherboard?',
    options: [
      'The length of the PCIe expansion slot',
      'The motherboard CPU socket type (e.g., AM4 vs AM5)',
      'The maximum wattage rating of the power supply',
      'The display output ports on the rear I/O panel'
    ],
    correctIndex: 1,
    explanation: 'CPUs require an exact mechanical and electrical socket match on the motherboard (such as AM5 LGA1718 or Intel LGA1700).',
  },
  {
    id: 'quiz-06',
    topic: 'purpose',
    question: 'What role does the Power Supply Unit (PSU) serve in a computer build?',
    options: [
      'It stores the operating system firmware in non-volatile flash memory',
      'It converts high-voltage alternating current (AC) into regulated direct current (DC)',
      'It boosts CPU clock frequencies during heavy processing tasks',
      'It manages wireless internet signals and Bluetooth connections'
    ],
    correctIndex: 1,
    explanation: 'The PSU converts dangerous alternating current from the wall outlet into clean, regulated direct current voltages (+12V, +5V, +3.3V) used by PC parts.',
  },
  {
    id: 'quiz-07',
    topic: 'placement',
    question: 'Why are motherboard standoffs installed into the case tray before securing the motherboard?',
    options: [
      'To provide sound dampening from cooling fan vibrations',
      'To prevent the conductive solder joints underneath the motherboard from shorting against the metal chassis',
      'To convert analog ground signals to digital PWM signals',
      'To elevate the motherboard for cable storage underneath the PCB'
    ],
    correctIndex: 1,
    explanation: 'Standoffs raise the motherboard off the bare metal tray. Direct contact between the metal chassis and exposed solder pads would cause severe short circuits.',
  },
  {
    id: 'quiz-08',
    topic: 'placement',
    question: 'Into which motherboard slot is a dedicated high-performance graphics card (GPU) typically installed?',
    options: [
      'The bottom-most PCIe x1 expansion slot',
      'The top-most PCIe x16 slot with direct CPU PCIe lanes',
      'The M.2 NVMe Key-M slot',
      'The rear I/O bracket header'
    ],
    correctIndex: 1,
    explanation: 'The top PCIe x16 slot provides the highest bandwidth and direct communication lanes with the CPU, making it the proper placement for graphics cards.',
  },
  {
    id: 'quiz-09',
    topic: 'purpose',
    question: 'What distinguishes RAM (system memory) from an NVMe SSD (storage drive)?',
    options: [
      'RAM is volatile temporary working memory; SSD provides persistent long-term storage',
      'RAM holds saved games after powering off; SSD loses data when power is lost',
      'RAM connects directly to the power supply; SSD connects only to the monitor',
      'RAM performs graphics rendering; SSD performs physics calculations'
    ],
    correctIndex: 0,
    explanation: 'RAM is volatile memory holding active program data that clears when powered down; SSDs provide persistent non-volatile storage that retains files without power.',
  },
  {
    id: 'quiz-10',
    topic: 'dependency',
    question: 'Which power connection is required to supply dedicated supplementary power to the CPU on modern motherboards?',
    options: [
      'A 4/8-pin EPS 12V connector near the top of the motherboard',
      'A SATA power connector from the hard drive bay',
      'A front-panel USB 3.0 header cable',
      'A 12V 4-pin RGB lighting header'
    ],
    correctIndex: 0,
    explanation: 'The 8-pin (or 4+4 pin) EPS 12V cable connects near the top-left VRM area of the motherboard to supply dedicated high-current power to the processor.',
  },
  {
    id: 'quiz-11',
    topic: 'compatibility',
    question: 'What is the consequence of choosing an ATX power supply for a Mini-ITX small-form-factor case designed exclusively for SFX PSUs?',
    options: [
      'The power supply will supply twice the required voltage',
      'The ATX power supply will physically not fit into the smaller SFX chassis chamber',
      'The CPU will run at half its rated clock frequency',
      'The motherboard BIOS will reject the modular cables'
    ],
    correctIndex: 1,
    explanation: 'Chassis PSU bays have strict physical dimension tolerances; a full-sized ATX power supply cannot physically fit inside an SFX-only enclosure.',
  },
  {
    id: 'quiz-12',
    topic: 'placement',
    question: 'When installing dual-channel RAM with only two memory sticks on a four-slot motherboard, which slots are typically recommended by manufacturers?',
    options: [
      'Slots 1 and 2 (adjacent to each other next to the CPU)',
      'Slots 2 and 4 (A2 and B2, spaced apart)',
      'Slots 3 and 4 only',
      'Any random slots without preference'
    ],
    correctIndex: 1,
    explanation: 'Motherboard manufacturers optimize memory trace topology for slots A2 and B2 (slots 2 and 4), ensuring proper signal integrity for dual-channel operation.',
  },
  {
    id: 'quiz-13',
    topic: 'dependency',
    question: 'Before seating an M.2 NVMe SSD flat against the motherboard, what hardware component must be aligned underneath it?',
    options: [
      'A 24-pin ATX power bridge',
      'An M.2 standoff screw post or toolless EZ-latch',
      'An aluminum expansion bracket',
      'A PCIe x16 riser ribbon'
    ],
    correctIndex: 1,
    explanation: 'The M.2 standoff post supports the free end of the SSD PCB parallel to the motherboard before the retention screw or latch secures it.',
  },
  {
    id: 'quiz-14',
    topic: 'purpose',
    question: 'What is the purpose of the 24-pin ATX power connector on the motherboard?',
    options: [
      'To provide primary DC system power to the motherboard chipsets, PCIe slots, and onboard circuits',
      'To transmit high-definition audio to front-panel headphone jacks',
      'To supply power exclusively to external USB peripherals',
      'To regulate CPU fan speed curves'
    ],
    correctIndex: 0,
    explanation: 'The 24-pin main ATX cable is the primary power artery delivering +12V, +5V, +3.3V, and standby power to the motherboard and connected PCIe devices.',
  },
];
