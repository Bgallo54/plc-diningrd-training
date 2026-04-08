export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSection {
  moduleId: string;
  title: string;
  color: string;
  questions: QuizQuestion[];
}

export const quizSections: QuizSection[] = [
  {
    moduleId: "general",
    title: "Getting Started",
    color: "hsl(183, 70%, 30%)",
    questions: [
      {
        id: "g1",
        moduleId: "general",
        question: "What is the primary purpose of the DiningRD homepage widgets?",
        options: [
          "To display company news and announcements only",
          "To provide personalized, role-based quick access to menus, meal cards, and daily tools",
          "To show employee schedules and shift assignments",
          "To manage billing and payment information"
        ],
        correctIndex: 1,
        explanation: "The homepage widgets are designed to give each user quick, role-based access to the tools they use most — including menus, meal cards, and training resources — so staff can pull up resident-specific information in seconds."
      },
      {
        id: "g2",
        moduleId: "general",
        question: "Which of the following are core modules within the DiningManager platform?",
        options: [
          "PlateFul, MealCard, TableSide, and DiningHub",
          "PlateFul, BillingPro, StaffTrack, and MealCard",
          "MenuMaster, OrderFlow, DietPlan, and ReportCenter",
          "TableSide, PayrollPlus, InventoryPro, and DiningHub"
        ],
        correctIndex: 0,
        explanation: "The four core modules of DiningManager are PlateFul (menu management), MealCard (resident meal profiles), TableSide (digital ordering), and DiningHub (resources and reports). Together they form the complete dining operations ecosystem."
      },
      {
        id: "g3",
        moduleId: "general",
        question: "Why is it important for all dining team members to understand how the DiningRD modules connect?",
        options: [
          "So they can troubleshoot IT issues independently",
          "So no resident dietary requirement falls through the cracks between modules",
          "So they can manage their own schedules more efficiently",
          "So they can create their own custom reports"
        ],
        correctIndex: 1,
        explanation: "When the team understands how data flows between PlateFul, MealCard, TableSide, and DiningHub, they can ensure that resident dietary needs, preferences, and restrictions are consistently honored across every touchpoint."
      },
      {
        id: "g4",
        moduleId: "general",
        question: "What resources are available on the DiningRD homepage training library?",
        options: [
          "Only PDF documents for download",
          "Video tutorials, PDF guides, and role-based training content",
          "Live webinar links only",
          "Equipment manuals and vendor catalogs"
        ],
        correctIndex: 1,
        explanation: "The training library on the homepage provides a mix of video tutorials (hosted on Loom), downloadable PDF guides, and role-based information so team members can learn at their own pace and access materials relevant to their role."
      },
    ]
  },
  {
    moduleId: "plateful",
    title: "PlateFul Menu Management",
    color: "hsl(142, 50%, 35%)",
    questions: [
      {
        id: "p1",
        moduleId: "plateful",
        question: "When setting the default menu flag in PlateFul, what day of the week must the start date fall on?",
        options: [
          "Monday",
          "Wednesday",
          "Friday",
          "Sunday"
        ],
        correctIndex: 3,
        explanation: "The default menu flag start date must always be set to a Sunday. This ensures the menu rotation aligns correctly with reporting periods and kitchen production schedules."
      },
      {
        id: "p2",
        moduleId: "plateful",
        question: "What is the primary benefit of building multi-week menu rotation cycles in PlateFul?",
        options: [
          "It reduces the cost of ingredients",
          "It prevents menu fatigue and keeps residents engaged with varied meal offerings",
          "It simplifies the ordering process for staff",
          "It automatically adjusts portion sizes"
        ],
        correctIndex: 1,
        explanation: "Multi-week rotation cycles prevent menu fatigue by ensuring residents experience variety over time. This directly impacts satisfaction and nutritional intake because residents are more likely to eat well when meals feel fresh and interesting."
      },
      {
        id: "p3",
        moduleId: "plateful",
        question: "What is the purpose of managing substitution lists in the Menu Planner?",
        options: [
          "To replace menu items that are too expensive",
          "To define alternate items residents can choose from to accommodate preferences and restrictions",
          "To remove unpopular items from the menu",
          "To create separate menus for each dining room"
        ],
        correctIndex: 1,
        explanation: "Substitution lists give your dining program flexibility. They ensure that when a resident cannot have the daily offering due to dietary needs or personal preference, quality alternatives are available — honoring their individual needs."
      },
      {
        id: "p4",
        moduleId: "plateful",
        question: "Why is it important to save default report print settings in PlateFul?",
        options: [
          "To save paper and ink costs",
          "To ensure every team member produces consistent, standardized reports with the correct diets, census, and formatting",
          "To limit who can print reports",
          "To automatically email reports to families"
        ],
        correctIndex: 1,
        explanation: "Saving default print settings ensures consistency across your team. Every person who prints a menu report will include the same dietary information, census numbers, logos, and formatting — eliminating errors from manual setup each time."
      },
      {
        id: "p5",
        moduleId: "plateful",
        question: "Which elements can be customized when printing menu reports in PlateFul?",
        options: [
          "Only the date range and font size",
          "Week at a glance view, community diets, census numbers, layouts, sizes, and logos",
          "Only the community name and logo",
          "Only dietary restriction filters"
        ],
        correctIndex: 1,
        explanation: "PlateFul offers robust report customization including week-at-a-glance views, community diet displays, census numbers, various layout options, paper sizes, and community logos — ensuring professional, informative reports for residents and families."
      },
    ]
  },
  {
    moduleId: "mealcard",
    title: "MealCard Management",
    color: "hsl(262, 50%, 45%)",
    questions: [
      {
        id: "m1",
        moduleId: "mealcard",
        question: "What information should be included in a resident's MealCard profile?",
        options: [
          "Only their room number and name",
          "Menu selections, dining room preferences, dietary restrictions, allergies, and substitution items",
          "Only their medical diet type",
          "Only their meal delivery schedule"
        ],
        correctIndex: 1,
        explanation: "A complete MealCard profile includes menu selections, preferred dining location, dietary restrictions, food allergies, texture modifications, and personal substitution items. This comprehensive profile is the foundation of personalized, safe dining."
      },
      {
        id: "m2",
        moduleId: "mealcard",
        question: "How does meal card highlighting help the kitchen team?",
        options: [
          "It makes the cards look more professional",
          "It provides instant visual identification of special diets and dietary requirements, reducing errors",
          "It organizes cards alphabetically",
          "It tracks meal costs per resident"
        ],
        correctIndex: 1,
        explanation: "Color-coded highlighting on meal cards gives kitchen staff an immediate visual cue about special dietary needs — such as diabetic, renal, or texture-modified diets. This quick identification reduces preparation errors and protects resident safety."
      },
      {
        id: "m3",
        moduleId: "mealcard",
        question: "Why is it critical to keep MealCard profiles up to date when a resident's dietary needs change?",
        options: [
          "To comply with state documentation requirements only",
          "To ensure residents always receive the right food prepared the right way — critical for both safety and satisfaction",
          "To reduce food waste in the kitchen",
          "To simplify the billing process"
        ],
        correctIndex: 1,
        explanation: "Up-to-date meal cards are the bridge between what a resident needs and what they receive. When profiles are current, allergies are flagged, diets are correct, and preferences are honored — at every single meal."
      },
      {
        id: "m4",
        moduleId: "mealcard",
        question: "What is the benefit of adding personal substitution items to individual resident MealCards?",
        options: [
          "It reduces the number of menu options the kitchen needs to prepare",
          "It honors each resident's individual taste and medical needs, moving from institutional to person-centered dining",
          "It simplifies the ordering process on TableSide",
          "It automatically adjusts the PlateFul menu"
        ],
        correctIndex: 1,
        explanation: "Personal substitutions are the difference between institutional food service and truly person-centered dining. When a resident has their preferred alternatives built into their profile, every meal reflects who they are and what they need."
      },
    ]
  },
  {
    moduleId: "tableside",
    title: "TableSide Ordering",
    color: "hsl(25, 70%, 45%)",
    questions: [
      {
        id: "t1",
        moduleId: "tableside",
        question: "What is the key difference between 'Live' and 'In-Advance' ordering modes in TableSide?",
        options: [
          "Live ordering is faster; advance ordering is more accurate",
          "Live ordering takes orders in real time at the table; advance ordering allows pre-planning meals ahead of time",
          "Live ordering is for residents; advance ordering is for employees",
          "Live ordering uses tablets; advance ordering uses paper"
        ],
        correctIndex: 1,
        explanation: "Live ordering captures meal choices in real time during service — ideal for residents who decide at the table. Advance ordering allows staff to take orders ahead of time, perfect for room visits or residents who prefer to plan their meals in advance."
      },
      {
        id: "t2",
        moduleId: "tableside",
        question: "How does TableSide protect residents with food allergies during the ordering process?",
        options: [
          "It removes all allergens from the menu automatically",
          "It displays allergy alerts at the point of ordering, preventing harmful food from being ordered",
          "It requires a supervisor to approve every order",
          "It only allows pre-set meal selections for residents with allergies"
        ],
        correctIndex: 1,
        explanation: "TableSide displays allergy information and alerts directly during the ordering process. When a staff member selects an item that conflicts with a resident's known allergies, the system warns them immediately — preventing dangerous food from reaching the resident's plate."
      },
      {
        id: "t3",
        moduleId: "tableside",
        question: "What is the purpose of the 'Hold Orders' feature in TableSide?",
        options: [
          "To pause the kitchen during equipment maintenance",
          "To hold orders so an entire table can be served together, creating a restaurant-style dining experience",
          "To delay orders until a resident finishes a previous meal",
          "To save incomplete orders for later editing"
        ],
        correctIndex: 1,
        explanation: "Holding orders allows staff to take orders from all residents at a table and then submit them together. This means everyone at the table is served at the same time — just like a restaurant — enhancing the social dining experience."
      },
      {
        id: "t4",
        moduleId: "tableside",
        question: "Why is the Automatic Meal Start feature important for daily operations?",
        options: [
          "It reduces the number of staff needed during meal service",
          "It ensures the correct menu is always loaded automatically, preventing manual errors that could serve the wrong day's menu",
          "It automatically prepares food in the kitchen",
          "It sends notifications to residents when meals are ready"
        ],
        correctIndex: 1,
        explanation: "Automatic Meal Start eliminates the risk of human error in loading the daily menu. By configuring meal schedules, start dates, and meal times, the system ensures the right menu appears on tablets every day — no manual intervention required."
      },
      {
        id: "t5",
        moduleId: "tableside",
        question: "Why should employee orders be tracked separately from resident orders in TableSide?",
        options: [
          "To prevent employees from eating resident food",
          "To provide cleaner data for food cost management and production planning",
          "To charge employees more for their meals",
          "To limit employee meal choices"
        ],
        correctIndex: 1,
        explanation: "Separating employee orders from resident orders gives your team accurate data for food cost analysis and production planning. When employee meals are tracked independently, you can better understand true resident dining costs and plan purchases accordingly."
      },
      {
        id: "t6",
        moduleId: "tableside",
        question: "What should your team do if the ticket printer is not working during meal service?",
        options: [
          "Cancel meal service until the printer is fixed",
          "Use the backup option to print TableSide tickets in MealCard format from a regular printer",
          "Write orders by hand and enter them later",
          "Switch to advance ordering mode only"
        ],
        correctIndex: 1,
        explanation: "TableSide includes a backup printing option that allows you to print orders in MealCard format from any regular printer. This ensures service never stops — residents always get their meals on time, even when the ticket printer has issues."
      },
    ]
  },
  {
    moduleId: "dininghub",
    title: "DiningHub Resources",
    color: "hsl(210, 60%, 40%)",
    questions: [
      {
        id: "d1",
        moduleId: "dininghub",
        question: "What types of resources can you find in DiningHub?",
        options: [
          "Only employee training videos",
          "Community lists, consultant reports, upcoming visit schedules, diet manuals, guidelines, and the in-service library",
          "Only dietary guidelines and regulations",
          "Only contact information for DiningRD support"
        ],
        correctIndex: 1,
        explanation: "DiningHub is a comprehensive resource center containing community lists, consultant reports, upcoming visit schedules, the diet manual, nutritional guidelines, an in-service training library, and contact information — everything your team needs for continuous improvement."
      },
      {
        id: "d2",
        moduleId: "dininghub",
        question: "How do consultant reports in DiningHub support resident care?",
        options: [
          "They provide marketing materials for families",
          "They offer dietary compliance feedback and clinical recommendations to improve your program",
          "They track employee performance metrics",
          "They generate financial reports for management"
        ],
        correctIndex: 1,
        explanation: "Consultant reports provide expert feedback on dietary compliance and clinical recommendations specific to your community. By reviewing and acting on this feedback, your team ensures the dining program meets the highest standards of resident care."
      },
      {
        id: "d3",
        moduleId: "dininghub",
        question: "Why is it important for dining teams to regularly access the in-service library in DiningHub?",
        options: [
          "To earn continuing education credits",
          "To stay current with best practices, dietary guidelines, and ongoing team education for continuous improvement",
          "To track attendance at training sessions",
          "To submit feedback on menu items"
        ],
        correctIndex: 1,
        explanation: "The in-service library provides ongoing education materials that keep your team current with best practices in senior living dining. A dining program that learns and adapts consistently delights residents and meets evolving regulatory requirements."
      },
    ]
  },
  {
    moduleId: "resident-customization",
    title: "Resident Customization & Person-Centered Dining",
    color: "hsl(183, 70%, 30%)",
    questions: [
      {
        id: "r1",
        moduleId: "resident-customization",
        question: "According to the Priority Life Care approach, what is the foundation of personalized dining?",
        options: [
          "A well-stocked kitchen with premium ingredients",
          "A complete resident profile in MealCard capturing dietary needs, preferences, allergies, and substitutions",
          "Having enough staff for one-on-one dining service",
          "Offering a large number of menu items each day"
        ],
        correctIndex: 1,
        explanation: "The MealCard profile is where personalized dining begins. When every resident's dietary restrictions, texture modifications, food allergies, preferred dining location, favorite selections, and personal substitutions are captured, every interaction reflects who they are."
      },
      {
        id: "r2",
        moduleId: "resident-customization",
        question: "How do PlateFul substitution options support the dignity of resident choice?",
        options: [
          "They allow the kitchen to use leftover ingredients",
          "They ensure residents always have alternatives, so they choose what they want rather than accepting what's available",
          "They reduce food costs by offering cheaper alternatives",
          "They simplify the kitchen workflow"
        ],
        correctIndex: 1,
        explanation: "When menus are designed with built-in substitution options, residents feel empowered at every meal. They are making choices — not just receiving food. This dignity of choice is fundamental to quality of life in senior living."
      },
      {
        id: "r3",
        moduleId: "resident-customization",
        question: "What role does TableSide play in the resident dining experience?",
        options: [
          "It replaces the need for kitchen staff",
          "It transforms dining from 'receiving food' to 'choosing your meal' — giving residents choice, control, and the dignity of being served",
          "It automates the entire meal preparation process",
          "It eliminates the need for printed menus"
        ],
        correctIndex: 1,
        explanation: "TableSide is where technology meets hospitality. Residents see their options, ask questions, customize their order in real time, and feel heard — transforming the dining experience from institutional meal delivery to restaurant-quality personal service."
      },
      {
        id: "r4",
        moduleId: "resident-customization",
        question: "How do DiningRD's allergy management features protect residents across the platform?",
        options: [
          "By removing all potential allergens from the community kitchen",
          "By flagging allergies in MealCard profiles and displaying alerts at the point of ordering in TableSide",
          "By requiring residents to sign allergy waivers",
          "By limiting the menu to hypoallergenic items only"
        ],
        correctIndex: 1,
        explanation: "DiningRD's safety system works across modules — allergies entered in MealCard profiles automatically trigger alerts when staff are ordering on TableSide. This two-layer protection prevents harmful food from ever reaching a resident's plate."
      },
      {
        id: "r5",
        moduleId: "resident-customization",
        question: "At Priority Life Care, what is the ultimate goal of the DiningRD training program?",
        options: [
          "To reduce food costs and improve operational efficiency",
          "To ensure every team member can deliver exceptional, person-centered dining experiences that honor individual preferences and the dignity of choice",
          "To achieve the highest regulatory compliance scores",
          "To standardize meals across all communities"
        ],
        correctIndex: 1,
        explanation: "While efficiency and compliance are important, the ultimate goal is person-centered dining. Every module, every feature, and every training lesson exists to help your team show residents they are seen, heard, and valued — at every meal, every day."
      },
    ]
  },
];

export function getTotalQuestions(): number {
  return quizSections.reduce((sum, s) => sum + s.questions.length, 0);
}

export function getPassingScore(): number {
  return 80;
}
