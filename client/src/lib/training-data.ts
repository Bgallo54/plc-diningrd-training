export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: "video" | "pdf";
  url: string;
  loomEmbedId?: string;
  duration?: string;
  residentImpact?: string;
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  residentBenefit: string;
  lessons: Lesson[];
}

function loomId(url: string): string {
  return url.split("/share/")[1] || "";
}

export const modules: Module[] = [
  {
    id: "general",
    title: "Getting Started",
    icon: "Home",
    color: "hsl(183, 70%, 30%)",
    description: "Platform orientation, homepage navigation, and the DiningRD ecosystem overview.",
    residentBenefit: "A team that knows the platform inside and out can respond to resident needs faster — from dietary changes to menu preferences — because they spend less time searching and more time serving.",
    lessons: [
      {
        id: "homepage-intro",
        title: "DiningRD Homepage Intro",
        description: "Explore the new homepage features: personalized widgets, marketing carousel, training library, and role-based information designed to streamline your daily workflow.",
        type: "video",
        url: "https://www.loom.com/share/a75bd1cc6dc54bdd8b66e45499e2cefc",
        loomEmbedId: "a75bd1cc6dc54bdd8b66e45499e2cefc",
        duration: "7:57",
        residentImpact: "Quick access to menu and meal card widgets means staff can pull up resident-specific information in seconds during service."
      },
      {
        id: "dm-tour",
        title: "DiningManager Tour",
        description: "A quick overview of the entire Dining Manager platform — understand the core modules and how they connect to support your dining operations.",
        type: "video",
        url: "https://www.loom.com/share/f0ee3a39b64847049cf7d59ef9dd9123",
        loomEmbedId: "f0ee3a39b64847049cf7d59ef9dd9123",
        duration: "5:00",
        residentImpact: "Understanding the full ecosystem ensures no resident dietary requirement falls through the cracks between modules."
      },
      {
        id: "login-homescreen",
        title: "Login & Home Screen Guide",
        description: "Step-by-step guide for logging in and navigating the Dining Manager home screen, including all available resources and navigation paths.",
        type: "pdf",
        url: "https://healthtechdocs.blob.core.windows.net/trainingdocuments/Dining%20Manager%20%28v2%29%20How-To%20Guide_1339_1339_b91e8039-0fbb-4740-9e82-263f54abffd4.pdf",
        residentImpact: "Confident navigation means faster response to resident requests and smoother shift transitions."
      }
    ]
  },
  {
    id: "plateful",
    title: "PlateFul Menu Management",
    icon: "UtensilsCrossed",
    color: "hsl(142, 50%, 35%)",
    description: "Build, customize, and manage your community's menu cycles, substitutions, and reports.",
    residentBenefit: "PlateFul empowers your team to create menus that reflect resident preferences, seasonal availability, and dietary needs — giving every resident a dining experience that feels personal and thoughtful.",
    lessons: [
      {
        id: "menu-planner",
        title: "Menu Planner",
        description: "Learn how to make menu changes, build menus by day and meal period, and adjust items across your rotation cycle.",
        type: "video",
        url: "https://www.loom.com/share/58c8dd04ef4446aea456db698f4accbe",
        loomEmbedId: "58c8dd04ef4446aea456db698f4accbe",
        duration: "6:00",
        residentImpact: "A well-planned menu cycle reduces monotony and keeps residents excited about meals — directly impacting satisfaction and nutrition intake."
      },
      {
        id: "default-menu",
        title: "Setting Default Menu",
        description: "Manage your active menu using the default menu flag — assign start dates (must be Sunday), ensure reporting reflects the correct menu day.",
        type: "video",
        url: "https://www.loom.com/share/261ee345a47c47c7b6007020e2d038d6",
        loomEmbedId: "261ee345a47c47c7b6007020e2d038d6",
        duration: "3:51",
        residentImpact: "Accurate default menu settings mean reports and kitchen production align perfectly with what residents are actually being served."
      },
      {
        id: "printing-menu-reports",
        title: "Printing Menu Reports",
        description: "Customize report display — week at a glance, community diets, census numbers, layouts, sizes, and logos.",
        type: "video",
        url: "https://www.loom.com/share/f73f48389aba4e58a45477516f234ede",
        loomEmbedId: "f73f48389aba4e58a45477516f234ede",
        duration: "5:00",
        residentImpact: "Clear, professional menu reports help residents and families see exactly what's being offered, building trust in your dining program."
      },
      {
        id: "plateful-print-settings",
        title: "PlateFul Default Report Print Settings",
        description: "Configure and save default report settings for consistency across your team — diets, census, layouts, logos, and printing sizes.",
        type: "video",
        url: "https://www.loom.com/share/d758c4dbb39e4628acab72aed1b0c1c6",
        loomEmbedId: "d758c4dbb39e4628acab72aed1b0c1c6",
        duration: "6:20",
        residentImpact: "Standardized reporting means every team member produces the same quality output — no missed dietary requirements or formatting errors."
      },
      {
        id: "managing-substitutions",
        title: "Managing Substitutions in Menu Planner",
        description: "Define alternate items residents can choose from, giving your dining program the flexibility to accommodate preferences and restrictions.",
        type: "pdf",
        url: "https://healthtechdocs.blob.core.windows.net/trainingdocuments/Managing%20Substitution%20List%20%283%29_1644_6d6898e3-1b24-480e-a85a-6cfc2e017aac.pdf",
        residentImpact: "Substitution lists ensure that even when a resident can't have the daily special, they have quality alternatives that respect their dietary needs."
      }
    ]
  },
  {
    id: "mealcard",
    title: "MealCard Management",
    icon: "ClipboardList",
    color: "hsl(262, 50%, 45%)",
    description: "Manage individual resident meal profiles, dietary needs, preferences, and print configurations.",
    residentBenefit: "MealCard is where personalized dining comes to life. Each resident's unique dietary needs, preferences, and restrictions are captured and followed — ensuring every meal feels made just for them.",
    lessons: [
      {
        id: "updating-mealcard",
        title: "Updating MealCard",
        description: "Update meal cards with resident menu selections, dining room preferences, and dietary restrictions to keep profiles current.",
        type: "video",
        url: "https://www.loom.com/share/4166e6694fd8414b9ae38290eb30fe16",
        loomEmbedId: "4166e6694fd8414b9ae38290eb30fe16",
        duration: "5:00",
        residentImpact: "Up-to-date meal cards mean residents always receive the right food, prepared the right way — critical for safety and satisfaction."
      },
      {
        id: "adding-substitutions-residents",
        title: "Adding Substitutions to MealCards",
        description: "Navigate to a resident's profile and add their preferred substitution items for personalized dining options.",
        type: "pdf",
        url: "https://healthtechdocs.blob.core.windows.net/trainingdocuments/Adding%20Substitutions%20for%20Residents%20%284%29_1645_30063753-124c-46fd-a5d9-6e723a314869.pdf",
        residentImpact: "Personal substitutions honor each resident's individual taste and medical needs — it's the difference between institutional food and person-centered dining."
      },
      {
        id: "printing-mealcard-reports",
        title: "Printing MealCard Reports",
        description: "Print meal cards and adjust settings including reserve lists, dining areas, and highlighting features.",
        type: "video",
        url: "https://www.loom.com/share/1c788dc6d3d442608199e7d684689414",
        loomEmbedId: "1c788dc6d3d442608199e7d684689414",
        duration: "6:00",
        residentImpact: "Color-coded, well-organized meal cards help kitchen staff instantly identify dietary requirements — reducing errors and protecting residents."
      },
      {
        id: "mealcard-print-settings",
        title: "MealCard Default Print Settings",
        description: "Configure default print settings: resident names, sort order, meal card highlighting for efficient daily meal preparation.",
        type: "video",
        url: "https://www.loom.com/share/c1ebb49907294a6aa7c57cc91cbf8c88",
        loomEmbedId: "c1ebb49907294a6aa7c57cc91cbf8c88",
        duration: "3:04",
        residentImpact: "Streamlined print settings mean less prep time and more time for the kitchen team to focus on food quality."
      }
    ]
  },
  {
    id: "tableside",
    title: "TableSide Ordering",
    icon: "Tablet",
    color: "hsl(25, 70%, 45%)",
    description: "Digital tableside ordering — live and advance, allergy management, held orders, ticket printing, pricing, and employee meals.",
    residentBenefit: "TableSide transforms dining from institutional meal service into a restaurant-quality experience. Residents choose their meals at the table, feel heard, and enjoy the dignity of being served — not just fed.",
    lessons: [
      {
        id: "taking-orders",
        title: "Taking Orders on Tablet",
        description: "Complete walkthrough of the ordering process: resident selection, meal card review, daily specials, sub-recipes, special notes, custom charges, and ticket printing.",
        type: "video",
        url: "https://www.loom.com/share/c25f088eecaf46878a6cb04705fc36ed",
        loomEmbedId: "c25f088eecaf46878a6cb04705fc36ed",
        duration: "4:47",
        residentImpact: "Taking orders tableside gives residents choice and control — they can see options, ask questions, and customize their meal in real time."
      },
      {
        id: "live-vs-advance",
        title: "Live vs. In-Advance Ordering",
        description: "Switch between live and advance ordering modes. Take orders by meal or by resident — ideal for room visits and pre-planning.",
        type: "video",
        url: "https://www.loom.com/share/458523a4356a413aa45b84d92587562e",
        loomEmbedId: "458523a4356a413aa45b84d92587562e",
        duration: "4:00",
        residentImpact: "Advance ordering for residents who prefer to plan ahead, live ordering for those who decide in the moment — both are supported."
      },
      {
        id: "allergy-management",
        title: "Allergy Management on Tablet",
        description: "How the system manages and displays allergy information during the ordering process to protect resident safety.",
        type: "video",
        url: "https://www.loom.com/share/6b97539950e34c15811df7f20cfcc147",
        loomEmbedId: "6b97539950e34c15811df7f20cfcc147",
        duration: "4:00",
        residentImpact: "Allergy alerts at the point of ordering are a critical safety net — they prevent harmful food from ever reaching a resident's plate."
      },
      {
        id: "holding-orders",
        title: "Holding TableSide Orders",
        description: "Hold orders for restaurant-style table service. Filter by table number, submit combined tickets, and manage future meal holds.",
        type: "video",
        url: "https://www.loom.com/share/bdab4d3960644bfdb841c0584b34271b",
        loomEmbedId: "bdab4d3960644bfdb841c0584b34271b",
        duration: "4:03",
        residentImpact: "Holding orders means an entire table is served together — just like a restaurant — enhancing the social dining experience."
      },
      {
        id: "auto-meal-start",
        title: "Automatic Meal Start",
        description: "Set up automatic meal rotation: menu schedules, start dates, days ahead, and customizable meal times by day of week.",
        type: "video",
        url: "https://www.loom.com/share/0e9cc00ed9234afe9e1210380f2de73f",
        loomEmbedId: "0e9cc00ed9234afe9e1210380f2de73f",
        duration: "3:09",
        residentImpact: "Automated meal start ensures the right menu is always loaded — no manual errors that could serve the wrong day's menu."
      },
      {
        id: "ticket-printing-mealcard",
        title: "Printing TableSide Tickets in MealCard Format",
        description: "Print tableside orders from a regular printer as a backup. Filter by dining area, add portion sizes and highlighting.",
        type: "video",
        url: "https://www.loom.com/share/5825d90891084fb1ae6315a982837361",
        loomEmbedId: "5825d90891084fb1ae6315a982837361",
        duration: "3:00",
        residentImpact: "Backup printing ensures service never stops even when technology has a hiccup — residents always get their meal on time."
      },
      {
        id: "pricing-features",
        title: "TableSide Pricing Features",
        description: "Set meal prices, custom charges (to-go fees), and itemized pricing. Use copy feature for efficient pricing across menus.",
        type: "video",
        url: "https://www.loom.com/share/f737e10e5a334e0e8e7c79ccf7c8115e",
        loomEmbedId: "f737e10e5a334e0e8e7c79ccf7c8115e",
        duration: "5:11",
        residentImpact: "Transparent pricing supports guest and employee meals while keeping resident dining operations financially sustainable."
      },
      {
        id: "employee-ordering",
        title: "Employee Ordering",
        description: "Saved employee profiles with names and optional IDs — improved tracking and reporting for employee meals.",
        type: "video",
        url: "https://www.loom.com/share/a5c3c01d803e4caabe2c2479e8603689",
        loomEmbedId: "a5c3c01d803e4caabe2c2479e8603689",
        duration: "3:03",
        residentImpact: "Separating employee orders from resident orders provides cleaner data for food cost management and production planning."
      },
      {
        id: "pioneer-printer",
        title: "Pioneer Printer Settings",
        description: "Step-by-step configuration for the Pioneer STEP-5 ticket printer used with TableSide.",
        type: "pdf",
        url: "https://healthtechdocs.blob.core.windows.net/trainingdocuments/Printer%20settings%20for%20Pioneer%20STEP-5%20ticket%20printer_2581_4ea9f9bc-f4f3-413b-8f12-d139a8d78e9b.pdf",
        residentImpact: "A properly configured printer means tickets print reliably — no missed orders, no delayed meals."
      },
      {
        id: "epson-printer",
        title: "Epson Printer Settings",
        description: "Step-by-step configuration for the EPSON TM-U220 ticket printer used with TableSide.",
        type: "pdf",
        url: "https://healthtechdocs.blob.core.windows.net/trainingdocuments/Printer%20settings%20for%20EPSON%20TM-U220%20ticket%20printer_2582_de11d5b0-6624-430b-94d0-6fcba11093fe.pdf",
        residentImpact: "A properly configured printer means tickets print reliably — no missed orders, no delayed meals."
      }
    ]
  },
  {
    id: "dininghub",
    title: "DiningHub Resources",
    icon: "BookOpen",
    color: "hsl(210, 60%, 40%)",
    description: "Your gateway to community resources, consultant reports, diet manuals, and the in-service training library.",
    residentBenefit: "DiningHub keeps your team connected to the latest dietary guidelines, consultant feedback, and training resources — ensuring your program evolves with best practices and regulatory requirements.",
    lessons: [
      {
        id: "exploring-dininghub",
        title: "Exploring DiningHub",
        description: "Tour of DiningHub: community lists, consultant reports, upcoming visits, diet manual, guidelines, in-service library, and contact information.",
        type: "video",
        url: "https://www.loom.com/share/d948ead201ce41f5969d94796c1004fe",
        loomEmbedId: "d948ead201ce41f5969d94796c1004fe",
        duration: "4:36",
        residentImpact: "Access to current diet manuals and consultant reports means your team always has the most up-to-date guidance for resident care."
      }
    ]
  }
];

export function getTotalLessons(): number {
  return modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function getModuleLessonCount(moduleId: string): number {
  return modules.find(m => m.id === moduleId)?.lessons.length || 0;
}
