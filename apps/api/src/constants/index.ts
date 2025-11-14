// ============================
// CASE TYPES CONSTANTS
// ============================

export const CASE_TYPES = {
  BANKRUPTCY: {
    key: 'bankruptcy',
    displayName: 'Bankruptcy Filing',
    description: 'Personal or business bankruptcy proceedings'
  },
  DIVORCE: {
    key: 'divorce',
    displayName: 'Divorce Proceedings',
    description: 'Divorce and family law matters'
  },
  FORECLOSURE: {
    key: 'foreclosure',
    displayName: 'Foreclosure Defense',
    description: 'Property foreclosure defense and mitigation'
  },
  PROPERTY_TITLE: {
    key: 'property_title',
    displayName: 'Property Title Search',
    description: 'Property title research and verification'
  },
  PROBATE: {
    key: 'probate',
    displayName: 'Probate & Estate Filing',
    description: 'Estate and probate proceedings'
  },
  LOAN_MODIFICATION: {
    key: 'loan_modification',
    displayName: 'Loan Modification',
    description: 'Mortgage and loan modification requests'
  },
  EVICTION: {
    key: 'eviction',
    displayName: 'Eviction Defense',
    description: 'Tenant rights and eviction defense'
  },
  WILLS_TRUSTS: {
    key: 'wills_trusts',
    displayName: 'Wills & Trusts',
    description: 'Estate planning documents'
  },
  REAL_ESTATE_DEED: {
    key: 'real_estate_deed',
    displayName: 'Real Estate Deed Transfer',
    description: 'Property deed transfers and conveyances'
  },
  POWER_OF_ATTORNEY: {
    key: 'power_of_attorney',
    displayName: 'Power of Attorney',
    description: 'Legal authorization documents'
  },
  NAME_CHANGE: {
    key: 'name_change',
    displayName: 'Name Change Petition',
    description: 'Legal name change proceedings'
  }
} as const;

// Helper to get all case type keys
export const CASE_TYPE_KEYS = Object.values(CASE_TYPES).map(type => type.key);

// Helper to get all case type display names
export const CASE_TYPE_DISPLAY_NAMES = Object.values(CASE_TYPES).map(type => type.displayName);

// Helper to get case type by key
export const getCaseTypeByKey = (key: string) => {
  return Object.values(CASE_TYPES).find(type => type.key === key);
};

// Helper to get case type by display name
export const getCaseTypeByDisplayName = (displayName: string) => {
  return Object.values(CASE_TYPES).find(type => type.displayName === displayName);
};

// ============================
// CASE STATUS CONSTANTS
// ============================

export const CASE_STATUS = {
  INTAKE: {
    key: 'intake',
    displayName: 'Initial Intake',
    description: 'Case information gathering phase',
    order: 1
  },
  DOCUMENTS_SUGGESTED: {
    key: 'documents_suggested',
    displayName: 'Documents Suggested',
    description: 'Recommended documents have been identified',
    order: 2
  },
  AUTO_FILLED: {
    key: 'auto_filled',
    displayName: 'Auto-Filled',
    description: 'Documents have been automatically populated',
    order: 3
  },
  REVIEWING: {
    key: 'reviewing',
    displayName: 'Under Review',
    description: 'Documents are being reviewed by client',
    order: 4
  },
  ATTORNEY_REVIEW: {
    key: 'attorney_review',
    displayName: 'Attorney Review',
    description: 'Professional legal review in progress',
    order: 5
  },
  COMPLETED: {
    key: 'completed',
    displayName: 'Completed',
    description: 'Case has been completed successfully',
    order: 6
  },
  DELIVERED: {
    key: 'delivered',
    displayName: 'Delivered',
    description: 'Final documents have been delivered',
    order: 7
  }
} as const;

// Helper to get all status keys
export const CASE_STATUS_KEYS = Object.values(CASE_STATUS).map(status => status.key);

// Helper to get all status display names
export const CASE_STATUS_DISPLAY_NAMES = Object.values(CASE_STATUS).map(status => status.displayName);

// Helper to get status by key
export const getCaseStatusByKey = (key: string) => {
  return Object.values(CASE_STATUS).find(status => status.key === key);
};

// Helper to get ordered statuses
export const getOrderedCaseStatuses = () => {
  return Object.values(CASE_STATUS).sort((a, b) => a.order - b.order);
};

// ============================
// DOCUMENT STATUS CONSTANTS
// ============================

export const DOCUMENT_STATUS = {
  DRAFT: {
    key: 'draft',
    displayName: 'Draft',
    description: 'Document is in draft stage'
  },
  COMPLETED: {
    key: 'completed',
    displayName: 'Completed',
    description: 'Document has been completed'
  },
  PENDING_REVIEW: {
    key: 'pending_review',
    displayName: 'Pending Review',
    description: 'Document is awaiting review'
  },
  REVIEWED: {
    key: 'reviewed',
    displayName: 'Reviewed',
    description: 'Document has been reviewed'
  }
} as const;

// Helper to get all document status keys
export const DOCUMENT_STATUS_KEYS = Object.values(DOCUMENT_STATUS).map(status => status.key);

// ============================
// TIMELINE EVENT TYPES
// ============================

export const TIMELINE_EVENT_TYPES = {
  FILING_DEADLINE: {
    key: 'filing_deadline',
    displayName: 'Filing Deadline',
    description: 'Document filing deadline'
  },
  HEARING_DATE: {
    key: 'hearing_date',
    displayName: 'Hearing Date',
    description: 'Court hearing or appointment'
  },
  RESPONSE_DUE: {
    key: 'response_due',
    displayName: 'Response Due',
    description: 'Response or reply deadline'
  },
  PAYMENT_DUE: {
    key: 'payment_due',
    displayName: 'Payment Due',
    description: 'Fee or payment deadline'
  },
  DOCUMENT_REVIEW: {
    key: 'document_review',
    displayName: 'Document Review',
    description: 'Document review milestone'
  },
  CASE_MILESTONE: {
    key: 'case_milestone',
    displayName: 'Case Milestone',
    description: 'Important case progress marker'
  }
} as const;

// Helper to get all timeline event type keys
export const TIMELINE_EVENT_TYPE_KEYS = Object.values(TIMELINE_EVENT_TYPES).map(type => type.key);

// ============================
// US STATES CONSTANTS
// ============================

export const US_STATES = {
  AL: { key: 'AL', name: 'Alabama', fullName: 'Alabama' },
  AK: { key: 'AK', name: 'Alaska', fullName: 'Alaska' },
  AZ: { key: 'AZ', name: 'Arizona', fullName: 'Arizona' },
  AR: { key: 'AR', name: 'Arkansas', fullName: 'Arkansas' },
  CA: { key: 'CA', name: 'California', fullName: 'California' },
  CO: { key: 'CO', name: 'Colorado', fullName: 'Colorado' },
  CT: { key: 'CT', name: 'Connecticut', fullName: 'Connecticut' },
  DE: { key: 'DE', name: 'Delaware', fullName: 'Delaware' },
  FL: { key: 'FL', name: 'Florida', fullName: 'Florida' },
  GA: { key: 'GA', name: 'Georgia', fullName: 'Georgia' },
  HI: { key: 'HI', name: 'Hawaii', fullName: 'Hawaii' },
  ID: { key: 'ID', name: 'Idaho', fullName: 'Idaho' },
  IL: { key: 'IL', name: 'Illinois', fullName: 'Illinois' },
  IN: { key: 'IN', name: 'Indiana', fullName: 'Indiana' },
  IA: { key: 'IA', name: 'Iowa', fullName: 'Iowa' },
  KS: { key: 'KS', name: 'Kansas', fullName: 'Kansas' },
  KY: { key: 'KY', name: 'Kentucky', fullName: 'Kentucky' },
  LA: { key: 'LA', name: 'Louisiana', fullName: 'Louisiana' },
  ME: { key: 'ME', name: 'Maine', fullName: 'Maine' },
  MD: { key: 'MD', name: 'Maryland', fullName: 'Maryland' },
  MA: { key: 'MA', name: 'Massachusetts', fullName: 'Massachusetts' },
  MI: { key: 'MI', name: 'Michigan', fullName: 'Michigan' },
  MN: { key: 'MN', name: 'Minnesota', fullName: 'Minnesota' },
  MS: { key: 'MS', name: 'Mississippi', fullName: 'Mississippi' },
  MO: { key: 'MO', name: 'Missouri', fullName: 'Missouri' },
  MT: { key: 'MT', name: 'Montana', fullName: 'Montana' },
  NE: { key: 'NE', name: 'Nebraska', fullName: 'Nebraska' },
  NV: { key: 'NV', name: 'Nevada', fullName: 'Nevada' },
  NH: { key: 'NH', name: 'New Hampshire', fullName: 'New Hampshire' },
  NJ: { key: 'NJ', name: 'New Jersey', fullName: 'New Jersey' },
  NM: { key: 'NM', name: 'New Mexico', fullName: 'New Mexico' },
  NY: { key: 'NY', name: 'New York', fullName: 'New York' },
  NC: { key: 'NC', name: 'North Carolina', fullName: 'North Carolina' },
  ND: { key: 'ND', name: 'North Dakota', fullName: 'North Dakota' },
  OH: { key: 'OH', name: 'Ohio', fullName: 'Ohio' },
  OK: { key: 'OK', name: 'Oklahoma', fullName: 'Oklahoma' },
  OR: { key: 'OR', name: 'Oregon', fullName: 'Oregon' },
  PA: { key: 'PA', name: 'Pennsylvania', fullName: 'Pennsylvania' },
  RI: { key: 'RI', name: 'Rhode Island', fullName: 'Rhode Island' },
  SC: { key: 'SC', name: 'South Carolina', fullName: 'South Carolina' },
  SD: { key: 'SD', name: 'South Dakota', fullName: 'South Dakota' },
  TN: { key: 'TN', name: 'Tennessee', fullName: 'Tennessee' },
  TX: { key: 'TX', name: 'Texas', fullName: 'Texas' },
  UT: { key: 'UT', name: 'Utah', fullName: 'Utah' },
  VT: { key: 'VT', name: 'Vermont', fullName: 'Vermont' },
  VA: { key: 'VA', name: 'Virginia', fullName: 'Virginia' },
  WA: { key: 'WA', name: 'Washington', fullName: 'Washington' },
  WV: { key: 'WV', name: 'West Virginia', fullName: 'West Virginia' },
  WI: { key: 'WI', name: 'Wisconsin', fullName: 'Wisconsin' },
  WY: { key: 'WY', name: 'Wyoming', fullName: 'Wyoming' }
} as const;

// Helper to get all state keys
export const US_STATE_KEYS = Object.values(US_STATES).map(state => state.key);

// Helper to get all state names
export const US_STATE_NAMES = Object.values(US_STATES).map(state => state.name);

// Helper to get state by key
export const getStateByKey = (key: string) => {
  return Object.values(US_STATES).find(state => state.key === key);
};

// Helper to get state by name
export const getStateByName = (name: string) => {
  return Object.values(US_STATES).find(state => state.name === name);
};

// ============================
// TYPE DEFINITIONS
// ============================

export type CaseTypeKey = typeof CASE_TYPE_KEYS[number];
export type CaseStatusKey = typeof CASE_STATUS_KEYS[number];
export type DocumentStatusKey = typeof DOCUMENT_STATUS_KEYS[number];
export type TimelineEventTypeKey = typeof TIMELINE_EVENT_TYPE_KEYS[number];
export type USStateKey = typeof US_STATE_KEYS[number];
