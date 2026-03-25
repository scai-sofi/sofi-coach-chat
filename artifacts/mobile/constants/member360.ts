/**
 * Member 360 Profile — Mock Data Layer
 *
 * INTEGRATION POINT: In production, this module would fetch the user's
 * verified profile from the SoFi Member 360 backend API. The Member 360
 * system is the authoritative source for verified member data including:
 *   - KYC-verified identity (name, DOB, SSN, address)
 *   - Linked SoFi products (Money, Invest, Loans, Credit Card, Relay)
 *   - Employment & income (from payroll direct deposit or stated income)
 *   - Credit data (score, bureau data from Relay/credit monitoring)
 *
 * This mock simulates a pre-populated profile to demonstrate conflict
 * detection when a user states something in chat that contradicts their
 * verified profile. In production, replace getMember360Profile() with
 * an API call to the Member 360 service.
 *
 * Conflict resolution flow:
 *   1. User says something in chat (e.g., "I make $130k")
 *   2. AI emits [MEMORY_SAVE]ABOUT_ME|Income is $130k/year
 *   3. Client checks incoming fact against Member 360 profile fields
 *   4. If a mismatch is found, a Member360ConflictCard is shown instead
 *      of auto-saving, presenting both values and letting the user choose
 *   5. If user picks "Use what I said" → memory is saved with user's value
 *      and a profile update request would be sent to Member 360
 *   6. If user picks "Keep profile" → the profile value is used as memory
 *   7. If user dismisses → neither value is persisted to chat memory
 */

export interface Member360Profile {
  income?: string;
  location?: string;
  age?: string;
  employer?: string;
  jobTitle?: string;
  creditScore?: string;
  rent?: string;
  mortgage?: string;
  maritalStatus?: string;
  dependents?: string;
  housingStatus?: string;
  sofiProducts?: string[];
}

export interface Member360Field {
  key: keyof Member360Profile;
  label: string;
  matchPatterns: RegExp[];
  extractValue: (content: string) => string | null;
}

const MEMBER_360_FIELDS: Member360Field[] = [
  {
    key: 'income',
    label: 'Annual income',
    matchPatterns: [/income|salary|make|earn/i, /\$[\d,]+k?/i],
    extractValue: (c) => {
      const m = c.match(/\$?([\d,]+)\s*k?\s*(?:\/?\s*(?:year|yr|annually))?/i);
      return m ? m[0].trim() : null;
    },
  },
  {
    key: 'location',
    label: 'Location',
    matchPatterns: [/lives?\s+in|located?\s+in|based\s+in|from/i],
    extractValue: (c) => {
      const m = c.match(/(?:lives?\s+in|located?\s+in|based\s+in|from)\s+(.+)/i);
      return m ? m[1].replace(/[.,;]+$/, '').trim() : null;
    },
  },
  {
    key: 'age',
    label: 'Age',
    matchPatterns: [/age\s*:?\s*\d+|\d+\s*(?:years?\s*old)/i],
    extractValue: (c) => {
      const m = c.match(/(\d{2})/);
      return m ? m[1] : null;
    },
  },
  {
    key: 'employer',
    label: 'Employer',
    matchPatterns: [/works?\s+(?:at|for)|employer|employed\s+(?:at|by)/i],
    extractValue: (c) => {
      const m = c.match(/works?\s+(?:at|for)\s+(.+)/i);
      return m ? m[1].replace(/[.,;]+$/, '').trim() : null;
    },
  },
  {
    key: 'creditScore',
    label: 'Credit score',
    matchPatterns: [/credit\s*score/i],
    extractValue: (c) => {
      const m = c.match(/(\d{3})/);
      return m ? m[1] : null;
    },
  },
  {
    key: 'rent',
    label: 'Monthly rent',
    matchPatterns: [/rent\s+(?:is|of|:)?\s*\$?[\d,]+/i],
    extractValue: (c) => {
      const m = c.match(/\$?([\d,]+)/);
      return m ? `$${m[1]}` : null;
    },
  },
  {
    key: 'maritalStatus',
    label: 'Marital status',
    matchPatterns: [/married|single|divorced|engaged|widowed/i],
    extractValue: (c) => {
      const m = c.match(/(married|single|divorced|engaged|widowed)/i);
      return m ? m[1].toLowerCase() : null;
    },
  },
];

const MOCK_PROFILE: Member360Profile = {
  income: '$115,000/year',
  location: 'Austin, TX',
  age: '31',
  employer: 'Stripe',
  creditScore: '742',
  rent: '$2,100',
  maritalStatus: 'single',
  housingStatus: 'renter',
  sofiProducts: ['SoFi Money', 'SoFi Invest', 'SoFi Credit Card'],
};

/**
 * INTEGRATION POINT: Replace with API call to Member 360 backend.
 *
 * Expected API contract:
 *   GET /api/member/360/profile
 *   Headers: { Authorization: Bearer <session_token> }
 *   Response: Member360Profile
 */
export function getMember360Profile(): Member360Profile {
  return { ...MOCK_PROFILE };
}

export interface ConflictResult {
  field: string;
  userValue: string;
  profileValue: string;
}

export function detectMember360Conflict(
  memoryContent: string,
  category: string,
): ConflictResult | null {
  if (category !== 'ABOUT_ME') return null;

  const profile = getMember360Profile();
  const contentLower = memoryContent.toLowerCase();

  for (const field of MEMBER_360_FIELDS) {
    const matchesAnyPattern = field.matchPatterns.some(re => re.test(contentLower));
    if (!matchesAnyPattern) continue;

    const profileValue = profile[field.key];
    if (!profileValue || Array.isArray(profileValue)) continue;

    const extractedValue = field.extractValue(contentLower);
    if (!extractedValue) continue;

    const normalizedProfileVal = profileValue.toLowerCase().replace(/[,$\/]/g, '').trim();
    const normalizedExtractedVal = extractedValue.toLowerCase().replace(/[,$\/]/g, '').trim();

    if (normalizedProfileVal === normalizedExtractedVal) continue;
    if (normalizedProfileVal.includes(normalizedExtractedVal) || normalizedExtractedVal.includes(normalizedProfileVal)) continue;

    return {
      field: field.label,
      userValue: memoryContent,
      profileValue: `${field.label}: ${profileValue}`,
    };
  }

  return null;
}
