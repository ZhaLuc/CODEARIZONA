import type { Bill } from "@/lib/types";

const SESSION = "57th Legislature, 2nd Regular Session (2026)";
const VERIFIED = "2026-08-15";

export const bills: Bill[] = [
  {
    id: "hb-2316",
    number: "HB 2316",
    title: "Middle school students; CTE courses",
    status: "introduced",
    session: SESSION,
    topic: "career-technical",
    lastVerified: VERIFIED,
    officialUrl: "https://www.azleg.gov/legtext/57leg/2r/bills/hb2316p.htm",
    factSheetUrl: "https://apps.azleg.gov/BillStatus/BillOverview/84053",
    sourceNote:
      "Plain-language summary is based on the introduced bill text on azleg.gov. Later committee or floor actions should be checked on the official bill overview. This prototype cannot confirm actions after House second reading on January 21, 2026.",
    officialSummary:
      "The introduced bill would allow district and charter schools that serve middle school students to offer career technical education courses during the 2026-2027 through 2028-2029 school years. Credits could count toward both eighth-grade promotion and high school graduation. Schools would need an agreement with a CTE district, a State Board-approved CTE provider, or a community college offering Perkins-aligned CTE. CTE districts could help fund participating middle school students but could not raise property taxes for that purpose or count those students in CTE district ADM. The section would repeal after December 31, 2037.",
    plainLanguage:
      "This bill would let some Arizona middle schools (grades 6–8) offer career and technical classes that count for finishing 8th grade and for high school graduation. Schools that opt in would have to partner with an existing CTE provider. It would not automatically create a new program in every school, and it would not let CTE districts raise property taxes to pay for middle school students.",
    impactTeachers:
      "Science, CTE, and elective teachers in grades 6–8 could be asked to help staff or coordinate new CTE offerings if a school opts in. The bill does not itself fund teacher pay or classroom materials.",
    impactStudents:
      "Middle school students could earn CTE credit earlier, if their school offers the courses and they complete them with a passing grade.",
    impactFamilies:
      "Families would still depend on whether a local school actually offers the courses. The bill creates permission and a reporting structure, not a guarantee of a seat.",
    impactSchools:
      "Participating schools would need contracts with a CTE district, approved provider, or community college, plus annual reporting to ADE on courses, completions, and costs.",
    supportersArgue:
      "Supporters of earlier CTE generally argue that career exploration should start before high school and that dual-counting credit can keep students engaged.",
    opponentsArgue:
      "Questions raised around similar proposals often include staffing capacity, whether middle school CTE dilutes core academics, and whether the funding limits leave schools to cover costs locally.",
    timeline: [
      {
        date: "2026-01-20",
        label: "Introduced; House first reading (BillTrack50, citing House actions)",
        source: "https://www.billtrack50.com/billdetail/1934323",
      },
      {
        date: "2026-01-21",
        label: "House second reading",
        source: "https://www.billtrack50.com/billdetail/1934323",
      },
    ],
  },
  {
    id: "sb-1101",
    number: "SB 1101",
    title: "Pilot programs; STEM teachers; districts",
    status: "in-committee",
    session: SESSION,
    topic: "teacher-workforce",
    lastVerified: VERIFIED,
    officialUrl: "https://www.azleg.gov/legtext/57leg/2r/bills/sb1101p.htm",
    sourceNote:
      "Based on the prefiled/introduced bill text on azleg.gov. TrackBill lists referrals to Senate Education, Appropriations, Transportation and Technology, and Rules. This prototype cannot confirm later floor action.",
    officialSummary:
      "The introduced bill would create a STEM and vocational teacher capacity growth pilot program in ADE. Eligible teachers are high school teachers of science, technology, engineering, mathematics, and/or CTE. ADE could approve enough district applications for up to 50 teachers. A participating nonprofit would provide professional development and paid summer internships of at least $6,000 per summer in 2027–2029. The bill would appropriate $250,000 from the general fund in each of FY 2027–2029. District eligibility in the introduced text is tightly limited by size, location, program offerings, and student characteristics. The section would repeal after December 31, 2030.",
    plainLanguage:
      "This bill would fund a small, three-year pilot: up to 50 high school STEM and CTE teachers could get summer industry internships and training, with a stipend of at least $6,000 each summer. It is not a statewide teacher raise. The introduced text limits which districts can even apply.",
    impactTeachers:
      "A small number of high school STEM/CTE teachers in qualifying districts could receive paid summer internships and professional development that the State Board would count as continuing education.",
    impactStudents:
      "The bill's stated aim is better STEM/CTE instruction and teacher retention. It does not change graduation requirements or student funding formulas.",
    impactFamilies:
      "No direct family mandate. Any classroom effect would depend on whether a local district qualifies and is selected.",
    impactSchools:
      "Only districts matching the introduced eligibility rules could apply. Those selected would take on quarterly and annual reporting.",
    supportersArgue:
      "Supporters of teacher-industry pilots typically argue that paid summer work and coaching can keep STEM teachers in high-need schools.",
    opponentsArgue:
      "The narrow eligibility in the introduced text could be criticized as too tailored to a small set of districts, and $250,000 a year would not reach most Arizona STEM teachers.",
    timeline: [
      {
        date: "2026-01-07",
        label: "Prefiled",
        source: "https://www.azleg.gov/legtext/57leg/2r/bills/sb1101p.htm",
      },
      {
        date: "2026-01-12",
        label: "Senate first reading (third-party tracker)",
        source: "https://myreptracker.com/arizona/bills/az-57th-legislature-second-regular-session-sb-1101",
      },
      {
        date: "2026-01-14",
        label: "Senate second reading; referred to Education, Appropriations/T&T, and Rules (third-party tracker)",
        source: "https://trackbill.com/bill/arizona-senate-bill-1101-pilot-programs-stem-teachers-districts/2764879/",
      },
    ],
  },
  {
    id: "hb-4163",
    number: "HB 4163",
    title: "K-12 education; 2026-2027",
    status: "enacted",
    session: SESSION,
    topic: "school-funding",
    lastVerified: VERIFIED,
    officialUrl: "https://www.azleg.gov/legtext/57leg/2R/laws/0135.htm",
    factSheetUrl: "https://www.azleg.gov/legtext/57leg/2R/summary/S.1841ATT.DOCX.htm",
    sourceNote:
      "Enacted as Laws 2026, Chapter 135. Companion/related budget language also appears in SB 1841 fact sheets. Dollar figures below are from the Chapter 135 text on azleg.gov.",
    officialSummary:
      "Chapter 135 makes statutory and session-law changes needed to implement FY 2027 K-12 budget policy. Among other provisions, it sets the FY 2027 base level at $5,215.53 (up from $5,113.26) and raises charter additional assistance to $2,174.54 (K-8 / preschool disabilities) and $2,534.38 (grades 9-12). It also includes transportation support-level adjustments, ASDB property-proceeds procedures, and FY 2027 authorization for ADE to use Failing Schools Tutoring Fund monies for specified school-improvement uses, with a September 1, 2026 expenditure report.",
    plainLanguage:
      "This is the enacted FY 2027 K-12 budget-reconciliation bill. It updates the per-student base amount and several other school-finance figures used to calculate state aid. It is not a new classroom-supply program. It is the statute that implements the year's K-12 budget math.",
    impactTeachers:
      "Changes to the base level and related formulas affect district and charter operating budgets, which is where teacher pay and classroom materials are ultimately funded. The bill does not earmark classroom-supply dollars.",
    impactStudents:
      "Formula updates change how much state aid schools generate. Classroom-level effects depend on local budgeting.",
    impactFamilies:
      "Qualifying tax-rate and formula language can interact with local school taxes. Families should use official JLBC/ADE explanations for tax-rate questions.",
    impactSchools:
      "Districts and charters must budget using the new FY 2027 figures. ADE has specified FY 2027 tutoring-fund uses and a reporting deadline of September 1, 2026.",
    supportersArgue:
      "Budget-reconciliation supporters typically describe these bills as the legal mechanics required to implement an adopted budget, including inflation-related formula updates.",
    opponentsArgue:
      "School-finance debates often focus on whether formula increases keep pace with costs, and on how much of any increase reaches classrooms versus other operations.",
    timeline: [
      {
        date: "2026-04-24",
        label: "Related Senate fact sheet for SB 1841 (K-12 BRB language)",
        source: "https://www.azleg.gov/legtext/57leg/2R/summary/S.1841ATT.DOCX.htm",
      },
      {
        date: "2026-06-13",
        label: "Approved by the Governor; Chapter 135",
        source: "https://www.azleg.gov/legtext/57leg/2R/laws/0135.htm",
      },
    ],
  },
  {
    id: "hb-2621",
    number: "HB 2621",
    title: "Access; special education; public schools",
    status: "enacted",
    session: SESSION,
    topic: "special-education",
    lastVerified: VERIFIED,
    officialUrl: "https://www.azleg.gov/legtext/57leg/2R/laws/0102.htm",
    sourceNote:
      "Enacted as Laws 2026, Chapter 102. Summary based on the chaptered text on azleg.gov.",
    officialSummary:
      "Chapter 102 adds A.R.S. § 15-768 and amends related education statutes. A parent of a pupil who lives in unorganized territory may request a child-find screening, a special education evaluation, or enrollment in the adjoining school district geographically closest to the pupil's residence. That district is responsible for child-find activities for the pupil and, if the parent requests enrollment of a child with a disability, for providing a free appropriate public education. Related provisions address certificates of educational convenience and placements involving courts or state placing agencies.",
    plainLanguage:
      "This enacted law is about access, not a new statewide curriculum. If a child lives in an area with no organized school district, a parent can ask the nearest adjoining district for screening, a special education evaluation, or enrollment. That district has to handle child-find duties and, when the child is eligible and the parent enrolls, provide FAPE.",
    impactTeachers:
      "Special educators in districts that border unorganized territory may see additional child-find, evaluation, or enrollment work. The law is about district responsibility, not a change to IEP instructional methods.",
    impactStudents:
      "Eligible students who previously had an unclear district 'home' for special education access have a clearer statutory path to screening, evaluation, and FAPE.",
    impactFamilies:
      "Parents in unorganized territory have a defined district to contact — the geographically closest adjoining district — rather than being left without a process.",
    impactSchools:
      "The closest adjoining district must accept those child-find and, in specified cases, FAPE responsibilities, and may need to prepare certificate-of-educational-convenience paperwork.",
    supportersArgue:
      "Supporters describe the problem as children falling through a gap when no district is clearly responsible for child-find and special education access.",
    opponentsArgue:
      "Districts asked to serve additional pupils from unorganized territory may argue about cost, transportation, and capacity. Those arguments are not adjudicated in this prototype.",
    timeline: [
      {
        date: "2026-01-22",
        label: "Introduced (third-party tracker)",
        source: "https://www.billtrack50.com/billdetail/1938054",
      },
      {
        date: "2026-06-04",
        label: "Approved by the Governor; Chapter 102",
        source: "https://www.azleg.gov/legtext/57leg/2R/laws/0102.htm",
      },
    ],
  },
  {
    id: "hb-4005",
    number: "HB 4005",
    title: "Artificial intelligence; course; public schools",
    status: "vetoed",
    session: SESSION,
    topic: "curriculum",
    lastVerified: VERIFIED,
    officialUrl: "https://www.azleg.gov/legtext/57leg/2R/bills/HB4005H.htm",
    factSheetUrl: "https://www.azleg.gov/legtext/57leg/2R/summary/S.4005ED.DOCX.htm",
    sourceNote:
      "House action and purpose from the official Senate fact sheet (prepared March 20, 2026). Veto date reported by the Office of the Arizona Governor legislative-action update and contemporaneous reporting. Always confirm on azleg.gov / azgovernor.gov for the veto letter.",
    officialSummary:
      "As described in the Senate Education fact sheet, the bill would have required each school district, beginning in the 2027-2028 school year, to offer instruction on the ethical, moral, and educational uses of artificial intelligence, including basic prompt techniques and ethical considerations. Districts could use a separate course or fold equivalent time into existing curricula, and would report annually to ADE by October 15. ADE could provide guidelines, resources, and/or grants. House third reading was 31-25-3-0-1 on March 3, 2026. Governor Katie Hobbs vetoed the bill on June 19, 2026. Reporting on the veto letter states she objected that the final version treated district and charter schools differently and that instructional decisions should be left to experts.",
    plainLanguage:
      "This bill would have required district schools to teach AI uses and ethics starting in 2027-2028. It did not become law. The Governor vetoed it on June 19, 2026. Schools may still teach about AI on their own; this bill is not a current mandate.",
    impactTeachers:
      "Because the bill was vetoed, it does not create a new statewide teaching requirement. A future bill could look different.",
    impactStudents:
      "No new statewide AI-course requirement took effect from this bill.",
    impactFamilies:
      "There is no new family-facing mandate from HB 4005. Local schools may still offer AI-related lessons under existing authority.",
    impactSchools:
      "Districts are not required by this vetoed bill to add an AI course or file the October 15 report it described.",
    supportersArgue:
      "Supporters argued students need basic prompt skills and ethical grounding as AI becomes common in school and work.",
    opponentsArgue:
      "The veto letter, as reported, focused on uneven district/charter requirements and on whether the Legislature should prescribe this instruction rather than education experts. Other objections during House debate included capacity and unfunded mandates.",
    timeline: [
      {
        date: "2026-02-12",
        label: "House Artificial Intelligence & Innovation: do pass 4-2-1-0",
        source: "https://www.azleg.gov/legtext/57leg/2R/summary/S.4005ED.DOCX.htm",
      },
      {
        date: "2026-03-03",
        label: "House third reading 31-25-3-0-1",
        source: "https://www.azleg.gov/legtext/57leg/2R/summary/S.4005ED.DOCX.htm",
      },
      {
        date: "2026-03-20",
        label: "Senate Research fact sheet prepared",
        source: "https://www.azleg.gov/legtext/57leg/2R/summary/S.4005ED.DOCX.htm",
      },
      {
        date: "2026-06-19",
        label: "Vetoed by the Governor (Governor's office legislative-action update / contemporaneous reporting)",
        source: "https://azgovernor.gov/office-arizona-governor/news/2026/06/governor-katie-hobbs-legislative-action-update-0",
      },
    ],
  },
];

export const civicLinks = {
  findLegislator: "https://www.azleg.gov/findmylegislator/",
  memberRoster: "https://www.azleg.gov/MemberRoster/",
  billSearch: "https://apps.azleg.gov/BillStatus/BillOverview",
  cleanElections: "https://www.azcleanelections.gov/elected-officials",
};
