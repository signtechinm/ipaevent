# 14th IPA National Students' Congress 2026 Sponsorship Form Documentation

## 1. Purpose

This document defines the sponsorship enquiry and onboarding form for the **14th IPA National Students' Congress 2026**, scheduled for **19-20 September 2026** in **Kochi, Kerala**.

The supplied form sources contain the complete multi-page flow: introductory content, organization details, premium sponsorship, standalone sponsorship, e-souvenir advertisement tariffs, payment instructions, transaction details, receipt upload, remarks, and final declaration.

## 2. Form Title

**Sponsorship for IPA National Students Congress - 2026 Kochi**

## 3. Event Information

- **Event:** 14th National Pharmacy Students' Congress 2026
- **Dates:** 19-20 September 2026
- **Location:** Kochi, Kerala
- **Organized by:** Local Organizing Committee
- **Audience:** Pharmacy students, academicians, researchers, industry leaders, healthcare professionals, and prospective sponsors

## 4. Congress Theme

**Pioneering India's Pharmaceutical Future: Bridging Innovation & Entrepreneurship, Industry, Practice in the Digital Era**

## 5. Introductory Content

### Sponsorship Invitation

Dear Sir/Madam,

It gives us immense pleasure to welcome you to the prestigious 14th National Pharmacy Students' Congress, to be held on 19-20 September 2026 in the beautiful city of Kochi, Kerala.

This national gathering of pharmacy students, academicians, researchers, industry leaders, and healthcare professionals aims to inspire the next generation of pharmacists while strengthening the spirit of professionalism, innovation, leadership, and collaboration in the pharmaceutical sector.

The theme of the Congress is:

**"Pioneering India's Pharmaceutical Future: Bridging Innovation & Entrepreneurship, Industry, Practice in the Digital Era"**

Over the two days, the Congress will feature keynote lectures, scientific sessions, exhibitions, student presentations, leadership activities, networking opportunities, interactive discussions, and cultural events designed to empower pharmacy students to meet the evolving challenges of healthcare and pharmaceutical sciences.

We earnestly request that your esteemed organization associate with the IPA National Students' Congress 2026 and extend generous sponsorship support for the various events and activities of the Congress. Your valued presence and support will undoubtedly contribute to making this event meaningful, memorable, and impactful.

We warmly welcome you to Kochi and wish you a rewarding professional and business experience during the Congress.

With warm regards,

**Local Organizing Committee**  
**14th National Pharmacy Students' Congress 2026**

## 6. Form Behavior

- The respondent's Google Account name, email address, and profile photo may be recorded when files are uploaded and the form is submitted.
- An email address is required.
- All organization-detail fields on the supplied page are required.
- The source form uses a multi-step flow with `Next` and `Clear form` actions.
- The premium sponsorship section instructs the respondent to select one category.
- The standalone sponsorship section allows one or more items to be selected.
- The souvenir advertisement section allows exactly one advertisement option.
- Payment is supported through account transfer or UPI/QR.
- Final submission requires payment details, payment proof, and acceptance of the declaration.
- Required fields must be validated before the respondent can continue.
- The portal should preserve entered values while the respondent moves between steps.
- The form must not request passwords or sensitive account credentials.
- The official event logo should appear near the top of the form.

## 7. Form Fields

### Field 1: Email

- **Label:** Email
- **Input type:** Email
- **Required:** Yes
- **Purpose:** Identify the respondent and provide a contact address for sponsorship communication.
- **Validation:**
  - Must use a valid email format.
  - Trim leading and trailing spaces.
  - Store the normalized value in lowercase.
  - Show a clear validation message for an invalid address.

### Field 2: Name of Organization

- **Label:** Name of Organization (in CAPITALS)
- **Input type:** Text
- **Required:** Yes
- **Expected format:** Full legal or commonly recognized organization name in uppercase.
- **Example:** `ABC PHARMACEUTICALS PRIVATE LIMITED`
- **Validation:**
  - Do not allow an empty value.
  - Trim duplicate, leading, and trailing spaces.
  - Convert the entered value to uppercase or display a clear uppercase instruction.
  - Allow common business-name characters such as `&`, `.`, `-`, `(`, and `)`.

### Field 3: Address for Correspondence

- **Label:** Address for Correspondence
- **Input type:** Multiline address
- **Required:** Yes
- **Purpose:** Capture the official postal address for sponsorship correspondence.
- **Recommended subfields:**
  - Address line 1
  - Address line 2
  - City
  - State
  - Postal code
  - Country
- **Validation:**
  - Do not allow an empty value.
  - Use a multiline input if the address is retained as one field.
  - Validate the postal code based on country when separate address fields are used.

### Field 4: Authorized Person

- **Label:** Name and Designation of Authorized Person
- **Input type:** Text
- **Required:** Yes
- **Expected format:** Full name followed by official designation.
- **Example:** `Dr. Anil Kumar, Director - Corporate Affairs`
- **Recommended portal behavior:** Split this into `authorized_person_name` and `authorized_person_designation` for cleaner communication and reporting.
- **Validation:**
  - Do not allow an empty value.
  - Trim leading and trailing spaces.
  - Allow titles, initials, punctuation, and common designation characters.

### Field 5: Mobile Number

- **Label:** Mobile Number of Authorized Person
- **Input type:** Telephone number
- **Required:** Yes
- **Validation:**
  - Accept a valid mobile number with country code.
  - For Indian numbers, normalize to `+91XXXXXXXXXX`.
  - Remove spaces and separators before storage.
  - Reject alphabetic characters and invalid lengths.
  - Obtain explicit consent before using the number for WhatsApp messaging.

### Field 6: Premium Sponsorship Category

- **Section label:** A. Premium Sponsorship - Categories
- **Instruction:** Select any one option of your choice.
- **Input type in source:** A separate required Yes/No checkbox group for each package.
- **Recommended input type:** A single radio group, select control, or package-card selector.
- **Required:** Yes
- **Packages:**

| Package | Amount |
| --- | ---: |
| Diamond Sponsor | INR 3,00,000 |
| Platinum Sponsor | INR 2,00,000 |
| Gold Sponsor | INR 1,00,000 |
| Silver Sponsor | INR 50,000 |
| Bronze Sponsor | INR 25,000 |

- **Instruction for all packages:** Refer to the sponsorship brochure for more information and benefits.
- **Validation:**
  - Require exactly one sponsorship package.
  - Do not render each package as an independent required Yes/No checkbox question.
  - Prevent contradictory answers such as selecting both `Yes` and `No`.
  - Prevent selection of more than one premium package.
  - Populate the sponsorship amount automatically from the selected package.
  - Store the package as a controlled value such as `diamond`, `platinum`, `gold`, `silver`, or `bronze`.
  - Show package benefits beside each option or provide a clearly visible brochure link.

### Field 7: À La Carte Standalone Sponsorship

- **Section label:** B. À La Carte (Standalone) Sponsorship - Categories
- **Label:** Selected Item(s) for Sponsorship
- **Instruction:** Select one or more items of your choice. Multiple items are allowed.
- **Input type:** Checkbox group
- **Required:** Yes in the source form
- **Items:**

| Standalone item | Amount |
| --- | ---: |
| Exhibition Space (3 m x 2 m) | INR 25,000 |
| Conference Bag | INR 2,00,000 |
| Writing Pads & Ball Pens | INR 25,000 |
| Breakfast | INR 1,00,000 |
| High Tea | INR 50,000 |
| Lunch | INR 2,00,000 |
| Gala Dinner | INR 3,00,000 |
| Scientific, Career Leadership, or Workshop Session | INR 25,000 per session |
| Cultural Event (academic colleges or institutions only) | INR 10,000 per event |

- **Additional source options:**
  - Already a Premium Sponsor
  - Other
- **Validation:**
  - Allow multiple standalone items.
  - Require at least one selection when the respondent chooses the standalone sponsorship route.
  - Treat `Already a Premium Sponsor` as a status or navigation choice, not as a priced sponsorship item.
  - If `Other` is selected, require a description and an administrator-approved price.
  - Ask for quantity or specific allocation when Sessions or Cultural Events is selected.
  - Restrict Cultural Event sponsorship to eligible academic colleges or institutions.
  - Check availability before confirming exclusive or capacity-limited items.
  - Populate item prices from managed sponsorship records rather than label text.
  - Calculate the standalone subtotal automatically.

### Field 8: E-Souvenir Advertisement

- **Section label:** C. Souvenir Advertisement - Tariffs
- **Label:** Page selection for advertising in the e-Souvenir published at the 14th IPA NSC 2026
- **Instruction:** Select one option. Multiple entries are not allowed.
- **Input type in source:** Checkbox group
- **Recommended input type:** Radio group or advertisement-card selector
- **Required:** Yes
- **Options:**

| Advertisement placement | Amount |
| --- | ---: |
| Outer Back Cover (colour) | INR 50,000 |
| Inside Front Cover (colour) | INR 50,000 |
| Inside Back Cover (colour) | INR 40,000 |
| Full Page (colour) | INR 25,000 |
| Half Page | INR 15,000 |
| Best Compliments Insert | INR 5,000 |

- **Validation:**
  - Allow exactly one advertisement option.
  - Use a single-choice control because the source explicitly disallows multiple entries.
  - Populate the advertisement amount automatically.
  - Check placement availability before confirmation, especially for cover positions.
  - Store the selected option as a controlled advertisement-tariff record.
  - Collect artwork only after the advertisement option is selected.
  - Display artwork dimensions, accepted file formats, colour profile, resolution, bleed, and submission deadline.

### Payment Information

- **Section label:** D. Payment Section
- **Payment modes:** Account transfer or UPI/QR
- **Account name:** PHARMA FIRST
- **Current account number:** 31140200001427
- **IFSC:** BARB0MUVATT
- **Branch:** Muvattupuzha
- **MICR:** 686012252
- **UPI method:** Scan the supplied QR code and pay

The source also displays a bank customer ID. It is not required for sponsor payments and should not be exposed in the public portal.

### Recommended Payment Fields

- Payment method
- Calculated payable amount
- Amount paid
- Transaction or UTR reference
- Payment date
- Payer account name
- Payment proof upload
- Payment verification status

### Payment Validation

- Calculate the payable amount from selected premium, standalone, and advertisement items.
- Do not ask the sponsor to calculate or type the expected total.
- Require a transaction reference for account transfer and UPI payments.
- Accept payment-proof uploads only in configured image or PDF formats.
- Do not mark an application as paid until an administrator verifies the transaction.
- Prevent duplicate use of the same transaction reference.
- Store bank details in managed configuration rather than hard-coding them in the form.
- Show only payer-required bank details.
- Provide a warning that payment does not guarantee a limited placement until confirmed.

### Field 9: Total Amount Paid

- **Source label:** Write is your Total Amount (INR) paid in Figures
- **Recommended label:** Total Amount Paid (INR)
- **Input type:** Currency/number
- **Required:** Yes
- **Validation:**
  - Accept numeric values only.
  - Require an amount greater than zero.
  - Compare the entered amount with the system-calculated payable amount.
  - If partial payments are allowed, show the outstanding balance.
  - Prefer a read-only calculated expected amount plus a separate actual amount paid.

### Field 10: Transaction Reference and Date

- **Source label:** Please provide your transaction number and date of transaction here.
- **Recommended portal fields:**
  - Transaction/UTR reference
  - Transaction date
- **Required:** Yes
- **Validation:**
  - Store the reference and date separately.
  - Require a valid date that is not in the future.
  - Trim and normalize the transaction reference.
  - Reject duplicate transaction references or flag them for review.

### Field 11: Transaction Receipt

- **Source label:** Upload transaction recipient or Screenshot
- **Corrected label:** Upload Transaction Receipt or Screenshot
- **Input type:** File upload
- **Required:** Yes
- **Source limit:** One supported file, maximum 10 MB
- **Validation:**
  - Accept only configured image and PDF formats.
  - Enforce the 10 MB maximum.
  - Scan uploaded files and store them outside the public web root.
  - Restrict access to authorized finance and sponsorship administrators.
  - Do not treat the uploaded proof as payment confirmation without verification.

### Field 12: Remarks or Requests

- **Label:** Any Other Remarks or Requests
- **Input type:** Multiline text
- **Required:** No
- **Validation:**
  - Trim leading and trailing whitespace.
  - Apply a reasonable character limit.
  - Escape content before display in admin screens or emails.

### Field 13: Final Declaration

- **Source statement:** I hereby declare that the details furnished are true and genuine and authorize IPA Kerala to take the necessary action.
- **Input type:** Required acceptance checkbox
- **Source options:** Yes/No
- **Required:** Yes
- **Recommended behavior:**
  - Use one unchecked acceptance checkbox instead of a Yes/No radio group.
  - Allow final submission only when accepted.
  - Store the declaration version, acceptance timestamp, IP address where legally appropriate, and authenticated user identifier.
  - Link to sponsorship terms, privacy notice, and refund/cancellation policy.

## 8. Recommended Portal Flow

### Step 1: Organization Details

Collect the fields present in the supplied source:

- Email
- Organization name
- Address for correspondence
- Authorized person's name and designation
- Authorized person's mobile number

### Step 2: Sponsorship Selection

Collect the premium sponsorship category supplied on the second form page:

- Diamond Sponsor - INR 3,00,000
- Platinum Sponsor - INR 2,00,000
- Gold Sponsor - INR 1,00,000
- Silver Sponsor - INR 50,000
- Bronze Sponsor - INR 25,000

Allow exactly one premium package to be selected, or allow the respondent to continue to standalone sponsorship. The amount should be assigned by the system and must not be entered manually.

For standalone sponsorship, allow multiple selections from:

- Exhibition Space (3 m x 2 m) - INR 25,000
- Conference Bag - INR 2,00,000
- Writing Pads & Ball Pens - INR 25,000
- Breakfast - INR 1,00,000
- High Tea - INR 50,000
- Lunch - INR 2,00,000
- Gala Dinner - INR 3,00,000
- Scientific, Career Leadership, or Workshop Session - INR 25,000 per session
- Cultural Event - INR 10,000 per event, for academic colleges or institutions only

Additional recommended fields:

- Quantity for session or cultural-event sponsorship
- Specific session, workshop, meal, or event allocation
- Additional branding requirements
- Organization website
- Organization profile

### Step 3: Souvenir Advertisement

Allow one advertisement selection:

- Outer Back Cover (colour) - INR 50,000
- Inside Front Cover (colour) - INR 50,000
- Inside Back Cover (colour) - INR 40,000
- Full Page (colour) - INR 25,000
- Half Page - INR 15,000
- Best Compliments Insert - INR 5,000

Reserve the selected placement only after availability and payment conditions are satisfied.

### Step 4: Branding Assets

Recommended uploads:

- Organization logo
- Organization profile or brochure
- Advertisement artwork
- GST or billing information, where applicable

The portal should display permitted file formats, maximum file size, and artwork dimensions before upload.

### Step 5: Billing and Payment

Recommended fields:

- Billing contact name
- Billing email and mobile number
- GSTIN, if applicable
- Billing address
- Purchase order number, if applicable
- Payment mode
- Transaction or payment reference
- Amount paid
- Payment date

Display the PHARMA FIRST account details and UPI QR code on this step. The system should show the calculated total, collect the transaction reference and proof, and set the payment status to `verification_required`.

### Step 6: Declaration and Review

- Show a complete summary before submission.
- Require confirmation that the information and uploaded assets are authorized and accurate.
- Include consent for event-related communication.
- Provide a link to sponsorship terms and cancellation/refund conditions.
- Show total paid, transaction reference/date, and receipt upload status.
- Require final declaration acceptance.

### Step 7: Confirmation

After successful submission:

- Generate a unique sponsorship enquiry or application number.
- Show a confirmation page.
- Email a copy of the submission to the authorized person.
- Notify the sponsorship administration team.
- Display the next action, payment status, and support contact details.

## 9. Proposed Data Model

```json
{
    "application_number": "",
    "email": "",
    "organization_name": "",
    "correspondence_address": {
        "line_1": "",
        "line_2": "",
        "city": "",
        "state": "",
        "postal_code": "",
        "country": "India"
    },
    "authorized_person_name": "",
    "authorized_person_designation": "",
    "authorized_person_mobile": "",
    "sponsorship_package": "",
    "sponsorship_package_label": "",
    "premium_sponsorship_amount": 0,
    "standalone_items": [
        {
            "item_code": "",
            "item_label": "",
            "unit_amount": 0,
            "quantity": 1,
            "subtotal": 0,
            "allocation": ""
        }
    ],
    "other_sponsorship_description": "",
    "standalone_sponsorship_amount": 0,
    "souvenir_advertisement_code": "",
    "souvenir_advertisement_label": "",
    "souvenir_advertisement_amount": 0,
    "souvenir_artwork_file": "",
    "sponsorship_amount": 0,
    "organization_website": "",
    "organization_profile_file": "",
    "organization_logo_file": "",
    "advertisement_artwork_file": "",
    "gstin": "",
    "billing_contact_name": "",
    "billing_email": "",
    "billing_mobile": "",
    "billing_address": "",
    "purchase_order_number": "",
    "payment_mode": "",
    "payment_reference": "",
    "payment_proof_file": "",
    "payer_account_name": "",
    "amount_paid": 0,
    "payment_date": "",
    "payment_status": "pending",
    "application_status": "draft",
    "communication_consent": false,
    "declaration_accepted": false,
    "declaration_version": "",
    "declaration_accepted_at": "",
    "remarks": "",
    "submitted_at": ""
}
```

## 10. Admin Requirements

Administrators should be able to:

- View, search, filter, and export sponsorship applications.
- Filter by organization, package, sponsored activity, amount, payment status, and application status.
- Assign an application to a sponsorship coordinator.
- Record calls, emails, follow-up dates, and internal notes.
- Approve, reject, place on hold, or request changes to an application.
- Verify payments and upload invoices or receipts.
- Review and approve logos, profiles, and advertisement artwork.
- Track branding commitments and delivery status.
- Prevent duplicate organization applications or flag them for review.
- Maintain an audit trail of status and payment changes.

## 11. Status Recommendations

### Application Status

- `draft`
- `submitted`
- `under_review`
- `changes_requested`
- `approved`
- `on_hold`
- `rejected`
- `completed`
- `cancelled`

### Payment Status

- `not_required`
- `pending`
- `partially_paid`
- `paid`
- `verification_required`
- `failed`
- `refunded`

## 12. Content and UX Recommendations

- Use the consistent event name **14th National Pharmacy Students' Congress 2026** throughout the form.
- Present the theme once, without duplicated quotation marks or a repeated `Theme:` label.
- Use `Dear Sir/Madam,` with consistent spacing and punctuation.
- Change the address field from a single-line text box to a multiline address field.
- Separate the authorized person's name and designation in the portal data model.
- Use a phone input with country-code support.
- Replace the five separate required Yes/No checkbox groups with one required package selector.
- Format currency consistently, for example `INR 1,00,000`, without spaces inside the number.
- Display premium and standalone sponsorship as clear routes, while allowing administrators to configure whether both may be combined.
- Show quantities for per-session and per-event items and calculate totals in real time.
- Present `Already a Premium Sponsor` separately from the priced standalone-item list.
- Replace the souvenir advertisement checkboxes with a single-choice control.
- Show live availability for limited cover advertisement positions.
- Normalize `e - Souvenir` to `e-Souvenir` and `14 th` to `14th`.
- Format the account number consistently without embedded spaces.
- Do not publish the bank customer ID.
- Add copy buttons for account number and IFSC, with clear labels.
- Display the beneficiary name near both bank-transfer and QR payment options.
- Separate transaction reference and transaction date into distinct fields.
- Correct `transaction recipient` to `transaction receipt`.
- Use numeric validation for the amount paid.
- Use one required declaration checkbox rather than Yes/No choices.
- Explain why each upload is needed and who can view it.
- Clearly mark required and optional fields.
- Make the form mobile-friendly and keyboard accessible.
- Save drafts locally or on the server during the multi-step process.
- Include a privacy notice, sponsorship terms, and support contact before final submission.

## 13. Open Items to Confirm

- Final brochure content and package-specific benefits.
- Availability and allocation rules for exhibition space, meals, conference bags, sessions, workshops, and cultural events.
- Whether premium sponsors may also purchase standalone items.
- Whether standalone items are exclusive to one sponsor or may be shared.
- Required quantity and naming details for session and cultural-event sponsorship.
- Approval and pricing rules for the `Other` option.
- Advertisement artwork specifications and submission deadline.
- Whether cover advertisement positions are exclusive and how reservations expire.
- Intended wording and format for the `Best Compliments Insert` option.
- Final UPI ID and approved QR-code asset.
- Whether partial payments are allowed.
- Payment-proof formats, size limits, and verification turnaround time.
- Refund account collection and reconciliation procedure.
- Final declaration wording and legal/privacy review.
- Confirmation message shown after successful submission.
- Accepted currencies, taxes, and GST treatment.
- Payment method and payment gateway.
- Required billing and compliance documents.
- Accepted upload formats, dimensions, and file-size limits.
- Sponsorship approval workflow and responsible committee members.
- Cancellation, refund, and package-change rules.
- Final support email address and phone number.
- Confirmation email and internal notification recipients.
- Whether the Google Account profile-recording notice applies to the portal implementation.

## 14. Source Reference

- **Source form title:** Sponsorship for IPA National Students Congress - 2026 Kochi
- **Source type:** Google Form HTML supplied for documentation
- **Captured scope:** Complete form flow through final submission
- **Captured required fields:** Email, organization name, correspondence address, authorized person's name/designation, mobile number, premium sponsorship category, and standalone sponsorship selection
- **Captured packages:** Diamond, Platinum, Gold, Silver, and Bronze
- **Captured standalone items:** Exhibition space, conference bag, writing pads and pens, breakfast, high tea, lunch, gala dinner, sessions/workshops, and cultural events
- **Captured advertisement options:** Outer back cover, inside front cover, inside back cover, full page, half page, and best compliments insert
- **Captured payment modes:** Account transfer and UPI/QR
- **Captured final fields:** Amount paid, transaction reference/date, receipt upload, remarks, and declaration
