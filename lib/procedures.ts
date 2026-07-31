// Source of truth for what each procedure requires. The AI validator is
// grounded against this list (not free-form knowledge) so results stay
// consistent with what's actually official — update this file when Spain
// changes a requirement, not the prompt.

export type RequiredDocument = {
  id: string;
  label: string;
  description: string;
};

export const NIE_REQUIREMENTS: RequiredDocument[] = [
  {
    id: "passport",
    label: "Valid passport",
    description:
      "Full passport, all pages, must not be expired. Photo page must be clearly legible.",
  },
  {
    id: "ex15",
    label: "EX-15 form",
    description:
      "Official NIE application form, fully completed. Name and passport number must exactly match the passport.",
  },
  {
    id: "fee",
    label: "Fee 790-012 payment proof",
    description:
      "Stamped or digitally validated proof of payment of the 790-012 fee at an authorized bank.",
  },
  {
    id: "justification",
    label: "Justification for the request",
    description:
      "A document proving the reason for the NIE request: employment contract, property purchase paperwork, bank account opening letter, or similar. Must be an original or certified copy, not a photo of a screen.",
  },
];

export const EMPADRONAMIENTO_REQUIREMENTS: RequiredDocument[] = [
  {
    id: "id_document",
    label: "Passport, NIE/TIE, or DNI",
    description:
      "Valid identity document for every person being registered. If a foreign document doesn't state place/date of birth, some town halls require a consular certificate supplying it.",
  },
  {
    id: "housing_proof",
    label: "Proof of the address (title or contract)",
    description:
      "Property deed (escritura) or current rental contract in the applicant's name, showing the exact address being registered.",
  },
  {
    id: "owner_authorization",
    label: "Owner/leaseholder authorization (if not on the title)",
    description:
      "Required only if the applicant is not the owner or the named tenant: a signed authorization from an adult who is, plus a copy of that person's ID and the housing proof above. Some town halls also require a signed 'declaración de residencia' from a co-resident adult.",
  },
  {
    id: "padron_form",
    label: "Municipal padrón application form",
    description:
      "The specific form (hoja padronal) supplied by the town hall (ayuntamiento) handling the registration — every adult being registered must sign it.",
  },
];

export const AUTONOMO_REQUIREMENTS: RequiredDocument[] = [
  {
    id: "id_document",
    label: "Valid DNI or NIE",
    description:
      "Non-EU applicants must already hold valid work authorization before registering — Import@ss will not accept the alta without it.",
  },
  {
    id: "modelo_036",
    label: "Modelo 036 (AEAT tax registration)",
    description:
      "Declaración censal de alta filed with the Agencia Tributaria (Sede Electrónica), stating the IAE/CNAE activity code, tax domicile, and VAT/IRPF details. Must be filed before starting activity or before the tax obligation arises. (Modelo 037, the simplified version, has been discontinued — everything goes through 036 now.)",
  },
  {
    id: "reta_form",
    label: "RETA registration (TA.0521, via Import@ss)",
    description:
      "Self-employment registration with the Tesorería General de la Seguridad Social. Needs the same IAE/CNAE code and start date as the 036, an estimated annual net income (to pick a contribution base/bracket), and a chosen collaborating mutua. Must be filed on or before the first day of activity (can be filed up to 60 days in advance).",
  },
  {
    id: "bank_account",
    label: "Bank account (IBAN)",
    description:
      "Used to direct-debit the monthly RETA quota once registered.",
  },
];

export const SEGURIDAD_SOCIAL_REQUIREMENTS: RequiredDocument[] = [
  {
    id: "id_document",
    label: "DNI, NIE, or passport",
    description:
      "Identity document used to request the Número de la Seguridad Social (NUSS) / Número de Afiliación (NAF), via the TA.1 form.",
  },
  {
    id: "contact_details",
    label: "Contact details",
    description: "Mobile phone number and email address, requested on the TA.1 form.",
  },
  {
    id: "address",
    label: "Habitual address",
    description: "Current residential address, requested on the TA.1 form.",
  },
];

export const PROCEDURES: Record<string, RequiredDocument[]> = {
  nie: NIE_REQUIREMENTS,
  empadronamiento: EMPADRONAMIENTO_REQUIREMENTS,
  autonomo: AUTONOMO_REQUIREMENTS,
  seguridad: SEGURIDAD_SOCIAL_REQUIREMENTS,
};
