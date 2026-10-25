import { Page } from './types';

export const COMPANY_INFO = {
  name: "Prophete Universal, LLC",
  phone: "(786) 877-7635",
  email: "PropheteUniversal@gmail.com",
  website: "www.propheteuniversal.com",
  address: "11996 N. Miami Avenue, Miami, FL 33168",
  hours: "9:00 AM to 5:00 PM (EST)",
  tagline: "Protecting Your Family. Preserving Your Wealth.",
};

export const TAX_INFO_2026 = `
**Upcoming Tax Information for 2026 (Tax Season 2027)**
1. **Standard Deduction Increases**: Expected to adjust for inflation. Single filers approx $15,000; Married filing jointly approx $30,000.
2. **Child Tax Credit**: Currently set to revert to pre-2021 levels unless extended by Congress. We are monitoring this closely for families.
3. **BOI Reporting**: The Corporate Transparency Act requires most small businesses (LLCs, Corps) to file Beneficial Ownership Information reports. Failure to file carries heavy fines ($500/day).
4. **Energy Credits**: Solar and EV credits remain in effect but with stricter manufacturing requirements.
5. **Electronic Filing Threshold**: The IRS now requires businesses with 10+ information returns to file electronically.
`;

export const PAGE_CONTENT: Record<Page, { title: string; summary: string; details: string }> = {
  [Page.HOME]: {
    title: "Prophete Universal",
    summary: "Your one-stop location for life insurance, professional tax services, and asset protection.",
    details: "Prophete Universal is a one-stop location for life insurance, professional tax services, home & auto insurance. Our mission is to provide our community a trustworthy company with excellent customer service. There are many companies with similar products and services, however, we prioritized your family needs above everything else. We will be here to support you….year-round."
  },
  [Page.CONTACT]: {
    title: "Contact Us",
    summary: "Secure your family's future today. We are ready to help.",
    details: `Visit us at ${COMPANY_INFO.address}, Call ${COMPANY_INFO.phone}, or Email ${COMPANY_INFO.email}. Business Hours: ${COMPANY_INFO.hours}.`
  },
  [Page.LIFE_INSURANCE]: {
    title: "Life Insurance with Life Benefits",
    summary: "Insurance that pays you while you are alive, covering chronic, critical, and terminal illnesses.",
    details: `We specialize in Life & Living Benefits: benefits you can use while living!
    
    1. Chronic Illness: Pays a lump sum benefit for illnesses such as cancer, heart attack, stroke, ALS, blindness, kidney failure, or major organ transplant.
    2. Critical Illness: Pays a monthly benefit if you become diagnosed as chronically ill and unable to perform two daily activities (bathing, dressing, eating).
    3. Terminal Illness: Pays a benefit if diagnosed with a terminal illness (life expectancy < 12 months).
    4. Death Benefit: Pays lump sum to beneficiaries.
    
    Types Available: Income Replacement, Whole Life, Mortgage Protection, Final Expense, Term (20-30 Years), IUL, Children College Saving, Annuity.`
  },
  [Page.TAX_SERVICES]: {
    title: "Income Tax Services",
    summary: "Maximum refund guaranteed with year-round support. Ask Pandora about the new 2026 filing requirements!",
    details: `Don't leave hard-earned money to 'Uncle Sam'. We offer year-round support.
    
    ${TAX_INFO_2026}
    
    We handle personal and business taxes, offer drop-off or electronic filing, and ensure you understand your return. No waiting in long lines.`
  },
  [Page.AUTO_INSURANCE]: {
    title: "Auto Insurance",
    summary: "We find the best rates for Personal and Commercial drivers.",
    details: "Coverage provides peace of mind in the moment of an incident. We handle personal and commercial policies including State Minimum (PIP/PID), Full Coverage (Collision & Comp), and Commercial Auto. We compare top carriers to get you the best rate."
  },
  [Page.HOME_INSURANCE]: {
    title: "Home Insurance",
    summary: "Protecting your physical assets against the unexpected.",
    details: "One of your best investments is your home. We provide protection for HO3 (Standard Home), HO6 (Condo), Flood Coverage (Essential in Miami), Renter Coverage, and DP1/DP3 (Rental Properties)."
  },
  [Page.ABOUT_US]: {
    title: "About Us - Executive Director Rolin Prophete",
    summary: "Prophete Universal was established by Rolin Prophete with a mission of family protection and wealth preservation.",
    details: "Prophete Universal LLC, led by Rolin Prophete, is a premier one-stop firm for Life Insurance with Life Benefits, Tax Preparation, Home & Auto Insurance. Rolin Prophete and his team prioritize community trust, family security, and maximum tax savings with year-round dedicated support."
  },
  [Page.CLIENT_WISHLIST]: {
    title: "Client Wishlist",
    summary: "A direct line to send your requests and needs to the company.",
    details: "The Client Wishlist is a dedicated panel for you to communicate your needs. You can fill out the form to email us directly, or speak to Pandora to get answers immediately. We want to hear from you."
  },
  [Page.FAQ]: {
    title: "Frequently Asked Questions",
    summary: "Answers to common questions about Insurance, Taxes, and our services.",
    details: `Common Questions:
    1. **What documents do I need for taxes?** W-2s, 1099s, ID, and Social Security cards for dependents.
    2. **How does Living Benefits work?** It allows you to access your death benefit while alive if you get sick.
    3. **Do you offer Spanish services?** Yes, Se Habla Español.
    4. **Can I file remotely?** Yes, we have a secure electronic filing system.`
  },
  [Page.SCHEDULE_CALL]: {
    title: "Schedule a Consultation",
    summary: "Book a time with a licensed Agent.",
    details: "Select a date and time on the calendar to speak with a representative about your insurance or tax needs."
  },
  [Page.WEB_DESIGN]: {
    title: "Website Designer Jarvis-27",
    summary: "Slick Tech AI Design services for your website needs.",
    details: "Jarvis-27 designs front end UI web apps and sites for developers and everyday clients. Featuring high-tech aesthetics and modern AI-driven design. Contact via WhatsApp: 778-953-5496."
  },
  [Page.GAME_ROOM]: {
    title: "The Arcade Room",
    summary: "Relax and play while you wait.",
    details: "A collection of classic arcade games including Tic-Tac-Toe, Memory Match, and Rock Paper Scissors to pass the time."
  },
  [Page.APPLICATIONS]: {
    title: "Application Forms & Intake",
    summary: "Submit your information for Tax and Insurance services securely.",
    details: "Online forms for New Client Tax intake, Insurance Applications, and Call Back Requests. Pandora can guide you through what information is needed."
  },
  [Page.THEATER]: {
    title: "Prophete Theater",
    summary: "Video library, educational broadcasts, and media showcase.",
    details: "Watch informative videos on financial literacy, tax rules, insurance protection, and client testimonials in high definition."
  },
  [Page.VIP_GAMES]: {
    title: "VIP Arcade & Games Room",
    summary: "Interactive recreation and games lounge.",
    details: "Enjoy arcade games, checkers, and fun puzzles while visiting Prophete Universal."
  },
  [Page.PROJECTS_2027]: {
    title: "Prophete 2027 Projects & Vision",
    summary: "Future roadmaps, expansion milestones, and community development initiatives.",
    details: "Explore the upcoming 2026-2027 milestones, expansion into new communities, and upcoming client service innovations."
  }
};