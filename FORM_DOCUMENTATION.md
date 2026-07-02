# 14th National IPA Student Congress 2026 Early Bird Registration Form Documentation

## 1. Purpose

This document defines the first registration form to be implemented for the 14th National IPA Student Congress 2026 portal. The reference source is the current Google Form titled **14th National IPA Student Congress 2026 - Early Bird Registration**.

**Event Theme:** Pioneering India's Pharmaceutical Future: Bridging Innovation, Entrepreneurship, Industry, and Healthcare Practice in the Digital Era

**Event Date:** 19–20 September 2026

The form is intended to collect early-bird participant details, classify the participant category, capture contact information, record basic event preferences, collect student competition details, capture pre-conference workshop interest, record oral/poster presentation preference, and capture payment details before final submission.

## 2. Form Title

**14th National IPA Student Congress 2026 - Early Bird Registration**

## 3. Form Behavior

- The participant's email address is recorded on submission.
- Required fields must be completed before the user can continue.
- The current Google Form uses a multi-step flow with `Back`, `Next`, and `Clear form` actions.
- The public portal implementation should support the same staged registration behavior.
- Payment, receipt generation, and final registration confirmation can be connected after the participant details step.
- Draft values are saved while the participant moves across form steps.

## 4. Section A: General Information

### Field 1: Name of Participant

- **Label:** Name of Participant
- **Instruction:** Enter details with suitable prefixes Dr./Mr./Ms. as to be displayed in the participant certificates.
- **Input type:** Text
- **Required:** Yes
- **Expected format:** Uppercase participant name with optional prefix.
- **Examples:**
  - `Dr. ANJALI MENON`
  - `Mr. RAHUL KUMAR`
  - `Ms. FATHIMA SHERIN`
- **Validation notes:**
  - Do not allow empty values.
  - Trim leading and trailing spaces.
  - Prefer automatic uppercase conversion for the name portion.
  - Allow common punctuation used in prefixes and initials.

### Field 2: Select Category

- **Label:** Select Category
- **Input type:** Dropdown
- **Required:** Yes
- **Options:**
  - Student Delegate - IPA SF Member
  - Student Delegate - Non IPA SF Member
  - Delegate IPA Member - Faculty
  - Delegate IPA Member - Others
  - Others
- **Validation notes:**
  - User must select one category.
  - Category should be stored as a controlled master value.
  - Pricing rules can be mapped to this field.

### Field 3: State of Residence

- **Label:** Which is your state of residence
- **Input type:** Text or dropdown
- **Required:** Yes
- **Recommended portal behavior:** Use a dropdown of Indian states and union territories for cleaner reporting.
- **Validation notes:**
  - Do not allow empty values.
  - If implemented as text, trim spaces and normalize capitalization.

### Field 4: WhatsApp Number

- **Label:** Provide your WhatsApp Number
- **Instruction:** For getting updates only.
- **Input type:** Phone number
- **Required:** Yes
- **Validation notes:**
  - Accept Indian mobile numbers with or without country code.
  - Recommended normalized storage format: `+91XXXXXXXXXX`.
  - Show a clear error for invalid phone length or characters.
  - This field can later be used for WhatsApp notification integration.

### Field 5: Email ID

- **Label:** Provide your Email ID
- **Instruction:** For verifications.
- **Input type:** Email
- **Required:** Yes
- **Validation notes:**
  - Must be a valid email format.
  - Store in lowercase.
  - Can be used for confirmation email, receipt delivery, and registration lookup.

### Field 6: Food Preference

- **Label:** Your food preference
- **Input type:** Dropdown
- **Required:** Yes
- **Options:**
  - Veg
  - Non Veg
- **Validation notes:**
  - User must select one option.
  - This value should be available in catering and participant reports.

## 5. Section B: Student Competitions and Payment

### Field 7: Course of Study

- **Label:** Course of Study
- **Input type:** Radio button
- **Required:** Yes
- **Current option:**
  - B.Pharm
- **Validation notes:**
  - User must select one course.
  - The portal should keep this as a configurable master value because more courses may be added later.
  - This field should be visible in student-wise and competition-wise reports.

### Field 8: College Name With State

- **Label:** Name of your college with state
- **Input type:** Text
- **Required:** Yes
- **Expected format:** College name followed by state.
- **Examples:**
  - `ABC College of Pharmacy, Kerala`
  - `XYZ Institute of Pharmaceutical Sciences, Tamil Nadu`
- **Validation notes:**
  - Do not allow empty values.
  - Trim leading and trailing spaces.
  - Recommended future enhancement: split into separate `college_name` and `college_state` fields for cleaner reporting.

### Field 9: Student Competitions

- **Label:** Select the student competitions you are participating in at the 14th National IPA Student Congress
- **Instruction:** Maximum 2 events per participant.
- **Input type:** Checkbox group
- **Required:** No in the current Google Form markup, but should be conditionally validated when competition participation is selected.
- **Options:**
  - Patient Counselling Competitions
  - Extempore Preparations in Pharmaceutics
  - Ideation Contest
  - Pharma Quiz (Group)
  - Elocution
  - Clinical Skill Sets
- **Validation notes:**
  - Allow a maximum of 2 selected competitions per participant.
  - If no competitions are selected, no competition fee should be added.
  - If one or more competitions are selected, add `Rs. 100` per selected event.
  - Group events such as Pharma Quiz may need team/member handling in a later form step.

### Field 10: Competition Fee Confirmation

- **Label:** If participating in the competitions, please remit an additional fee Rs. 100 per event along with registration fee and mark YES here.
- **Input type:** Yes/No choice
- **Required:** Yes
- **Options:**
  - Yes
  - No
- **Validation notes:**
  - If any competition is selected, this field should be `Yes`.
  - If no competition is selected, this field can be `No`.
  - The portal should calculate the competition fee automatically instead of relying only on user confirmation.
  - Use this field as an acknowledgement for the additional competition fee.

## 6. Section C: Pre-Conference Workshop and Fee Payment

### Field 11: Pre-Conference Workshop Area

- **Label:** Select your area for pre-conference
- **Instruction:** Limited add-on.
- **Input type:** Radio button
- **Required:** Yes
- **Options:**
  - AI
  - Vaccination
  - 3D Printing
- **Validation notes:**
  - User must select one pre-conference workshop area.
  - Since this is marked as a limited add-on, the portal should support capacity limits per workshop.
  - Workshop choices should be controlled by a backend program/workshop master so seats, fees, and status can be managed by admins.

### Field 12: Workshop Fee Confirmation

- **Label:** Confirm by paying additional fee of Rs. for workshop along with registration
- **Input type:** Yes/No choice
- **Required:** Yes
- **Options:**
  - Yes
  - No
- **Validation notes:**
  - The Google Form text does not specify the workshop fee amount.
  - The portal should calculate the workshop fee from the selected workshop master record.
  - If a workshop is selected, this field should be `Yes`.
  - If workshop participation is optional in the portal, add a `No workshop` option to Field 11 or make Field 11 conditional.
  - Use this field as an acknowledgement for the additional workshop fee.

## 7. Section D: Oral Presentation / Poster Presentation

### Field 13: Presentation Type

- **Label:** Select the type
- **Input type:** Choice field
- **Required:** Yes
- **Options:**
  - Oral Presentation
  - Poster Presentation
- **Validation notes:**
  - User must select one presentation type.
  - The Google Form source uses checkbox-style markup, but the portal should implement this as a radio button or segmented choice because only one presentation type should be selected.
  - Store the selected value as a controlled master value for abstract and scientific service reporting.
  - Correct spelling should be used in the portal labels: `Oral Presentation` and `Poster Presentation`.

## 8. Section F: Payment Section

### Field 14: Pay Fee

- **Label:** Pay Fee
- **Input type:** Amount field
- **Required:** Yes
- **Current example value:** `100`
- **Validation notes:**
  - The portal should calculate this amount automatically instead of asking the participant to type it.
  - Amount should be numeric and greater than zero when payment is required.
  - The final amount should include registration fee, competition fee, and workshop fee.
  - Manual editing should be restricted to authorized admin users only.

### Field 15: Transaction Details

- **Label:** Transaction details
- **Input type:** Text
- **Required:** Yes
- **Validation notes:**
  - For online payment gateway integration, this should be captured automatically from the gateway response.
  - Store gateway transaction ID, payment reference ID, payment method, payment status, paid amount, and payment timestamp.
  - If manual payment is supported, allow transaction details to be entered by the participant or verified by finance/admin staff.
  - Do not mark payment as successful until transaction details are verified or confirmed by the payment gateway.

## 9. Submission Confirmation

### Confirmation Message

- **Screen title:** 14th National IPA Student Congress 2026 - Early Bird Registration
- **Message:** Your response has been recorded.
- **Available action:** Submit another response.

### Portal Behavior Recommendation

- Show a confirmation page after successful form submission.
- If payment gateway integration is active, show this confirmation only after payment verification succeeds.
- Display the generated registration number on the confirmation page.
- Provide links to download receipt, view registration summary, and return to the event website.
- Keep `Submit another response` available for users who need to register another participant.
- Send confirmation email to the registered email address.

## 10. Recommended Portal Form Flow

### Step 1: General Information

Collect the fields listed in Section A:

- Participant name
- Category
- State of residence
- WhatsApp number
- Email ID
- Food preference

### Step 2: Student and Competition Details

Collect the fields listed in Section B:

- Course of study
- College name with state
- Student competition selections
- Competition fee acknowledgement

### Step 3: Pre-Conference Workshop

Collect the fields listed in Section C:

- Pre-conference workshop area
- Workshop fee acknowledgement

### Step 4: Presentation Details

Collect the fields listed in Section D:

- Oral or poster presentation type

### Step 5: Additional Registration Details

Recommended next step for the portal:

- IPA membership details, if applicable.
- Student ID or professional ID upload, if required.
- Abstract title and abstract upload, if presentation submission is required.
- Group/team details for group competitions, if required.

### Step 6: Review

Recommended review step before payment:

- Display participant details.
- Display selected category and calculated fee.
- Display selected competitions and calculated additional competition fee.
- Display selected pre-conference workshop and calculated workshop fee.
- Display selected presentation type.
- Confirm contact details.

### Step 7: Payment

Collect or generate the fields listed in Section F:

- Total payable fee
- Transaction details
- Continue to payment gateway.

### Step 8: Confirmation

After successful submission or payment:

- Generate registration number.
- Show confirmation page with `Your response has been recorded.`
- Send confirmation email.
- Generate receipt, if payment is completed.

## 11. Data Model Recommendation

The registration form can be stored using the following structure:

```json
{
    "participant_name": "",
    "category": "",
    "state_of_residence": "",
    "whatsapp_number": "",
    "email": "",
    "food_preference": "",
    "course_of_study": "",
    "college_with_state": "",
    "student_competitions": [],
    "competition_fee_acknowledged": false,
    "competition_fee_amount": 0,
    "pre_conference_workshop": "",
    "workshop_fee_acknowledged": false,
    "workshop_fee_amount": 0,
    "presentation_type": "",
    "total_payable_amount": 0,
    "transaction_details": "",
    "gateway_transaction_id": "",
    "submitted_at": "",
    "confirmation_message_shown": false,
    "registration_status": "draft",
    "payment_status": "pending"
}
```

## 12. Fee Calculation Notes

- Base registration fee should come from the selected participant category.
- Competition fee should be calculated as `number_of_selected_competitions * 100`.
- Maximum competition fee from this form is `Rs. 200` because the participant can select only 2 competitions.
- Workshop fee should come from the selected pre-conference workshop master record.
- Workshop capacity should be checked before payment is accepted.
- Total payable amount should be calculated by the system:

```text
total_payable = registration_category_fee + competition_fee + workshop_fee
```

## 13. Payment Handling Notes

- Prefer payment gateway integration over manually typed transaction details.
- Capture transaction data from the gateway response wherever possible.
- Keep payment status values controlled, for example: `pending`, `success`, `failed`, `manual_verification_required`, `refunded`.
- Store the original gateway response for audit and reconciliation.
- Show a payment confirmation page only after the payment response is verified.
- Generate receipts only for successful or manually verified payments.

## 14. Admin Reporting Requirements

The backend should allow administrators to filter and export registrations by:

- Participant category
- State of residence
- Food preference
- Course of study
- College or institution
- Selected competition
- Competition fee acknowledgement
- Selected pre-conference workshop
- Workshop fee acknowledgement
- Presentation type
- Paid amount
- Transaction details or gateway transaction ID
- Payment status
- Submission timestamp
- Registration date
- Email or WhatsApp number

## 15. Implementation Notes

- Use controlled form inputs in React.
- Keep category, food preference, course, competition, workshop, and presentation values as constants or backend master records.
- Validate each step before moving to the next step.
- Preserve draft data while the user moves between steps.
- Avoid submitting payment until the user has reviewed the registration details.
- Keep the form mobile-friendly because many participants may register from phones.
- Disable additional competition checkboxes after 2 selections, or show a clear validation error.
- Calculate competition payment automatically from selected competitions.
- Calculate workshop payment automatically from the selected workshop.
- Lock or hide workshop options after seat capacity is filled.
- Use a single-select control for presentation type, even though the Google Form export shows checkbox markup.
- Display pay fee as a read-only calculated value for participants.
- Capture transaction details automatically when gateway integration is active.
- Prevent duplicate submissions after the confirmation page is shown.

## 16. Open Items To Confirm

- Final early-bird pricing for each participant category.
- Whether category-specific proof upload is required.
- Whether state should be text input or dropdown.
- Whether the form should support group registration in the same flow or as a separate flow.
- Whether more course options should be added beyond B.Pharm.
- Whether college and state should be split into separate fields.
- Whether Pharma Quiz group registration needs team-member fields.
- Whether the competition fee remains Rs. 100 per event for all categories.
- Final workshop fee amount for AI, Vaccination, and 3D Printing.
- Whether pre-conference workshop selection is mandatory or optional.
- Seat limits for each pre-conference workshop.
- Whether presentation type is mandatory for all participants or only for participants submitting abstracts.
- Whether abstract title, abstract file upload, guide/co-author details, and topic/category fields should be collected in this same flow.
- Whether manual transaction details will be accepted before full gateway integration.
- Exact confirmation page content, receipt download behavior, and support contact details.
- Final payment gateway choice.
- Final email and WhatsApp notification templates.
