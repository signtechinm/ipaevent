# Reports Module Implementation Plan

## 1. Objective

Add a Reports section to the admin navigation and provide five operational reports. Every report will support server-side filtering, pagination, Excel export, and PDF export. The report screens will use the existing admin authentication and permission model.

## 2. Report menu structure

The existing **Reports** navigation item will become an expandable menu with these links:

1. Registration General Information
   - Individual Registrations
   - Group Registrations
2. Student Skill Competition
3. Workshops
4. Presentation
5. HR Drive

Suggested URLs:

- `/admin/reports/registrations/individual`
- `/admin/reports/registrations/group`
- `/admin/reports/skill-competitions`
- `/admin/reports/workshops`
- `/admin/reports/presentations`
- `/admin/reports/hr-drive`

## 3. Report columns

### 3.1 Registration General Information

The individual and group reports will be separate screens and exports.

| Column | Source / rule |
|---|---|
| S.No. | Generated row number, continuous within the filtered result/export |
| Registration No. | Registration number; group report uses the group registration number |
| Name | Participant name; group report uses coordinator/group name where appropriate |
| Mobile No. | WhatsApp/mobile number |
| Email | Participant/coordinator email |
| Category | Registration category |
| Institution or College | Institution/college name |
| State | State of residence/institution state according to stored registration data |
| Register Date | Registration creation/submission date |
| Payment Status | Current payment status |
| Date of Registration | Displayed as the requested registration date field; backend will define this as the submitted/created registration timestamp and document the mapping to avoid duplicate-date ambiguity |

If the source data contains both draft-created and submitted timestamps, the report will expose the submitted timestamp as **Date of Registration** and retain **Register Date** as the record creation timestamp.

### 3.2 Student Skill Competition

One row per participant per selected competition, grouped/filterable by competition name.

- S.No.
- Registration No.
- Name
- Mobile Number
- Email ID
- College Name
- State
- Competition Name (required for the competition-wise view and export)

### 3.3 Workshops

One row per participant per selected workshop, grouped/filterable by workshop name.

- S.No.
- Registration No.
- Name
- Category
- Mobile No.
- Email ID
- College Name
- State
- Food Preferences
- Workshop Name (required for the workshop-wise view and export)

### 3.4 Presentation

One row per participant with a presentation selection.

- S.No.
- Registration No.
- Name
- Category
- Mobile No.
- Email ID
- College
- State
- Presentation Type (included so the report remains presentation-wise and useful when more than one presentation option exists)

### 3.5 HR Drive

One row per participant with HR Drive participation.

- S.No.
- Registration No.
- Name
- Mobile Number
- Email ID
- College Name
- State
- Core Area Preferred

## 4. Common report functionality

Every report screen will include:

- Search by registration number, name, email, mobile, and institution/college where applicable.
- Relevant select filters: category, state, payment status, date range, competition, workshop, presentation type, and HR core area.
- Clear filters and refresh actions.
- Server-side pagination with page size options (25, 50, 100) and total result count.
- Stable sorting by registration date and name, with sortable columns where useful.
- Excel export of the current filtered result set, including all rows rather than only the visible page.
- PDF export of the current filtered result set with report title, applied-filter summary, generated timestamp, and page numbers.
- Loading, empty, and error states.
- Permission checks using `report.view` for viewing and `report.export` for exports.

Exports must be generated from the same validated query/filter parameters used by the screen so that the downloaded data matches the selected report exactly.

## 5. Backend/API plan

Add authenticated admin endpoints under `/api/admin/reports`:

- `GET /registrations?mode=individual|group`
- `GET /skill-competitions`
- `GET /workshops`
- `GET /presentations`
- `GET /hr-drive`

Common query parameters:

`page`, `pageSize`, `search`, `dateFrom`, `dateTo`, `category`, `state`, `paymentStatus`, `sortBy`, and `sortDirection`.

Report-specific parameters:

- `competition` for skill competition reports
- `workshop` for workshop reports
- `presentationType` for presentation reports
- `coreArea` for HR Drive reports

Each list response will return:

```json
{
  "rows": [],
  "pagination": { "page": 1, "pageSize": 25, "total": 0, "totalPages": 1 },
  "filters": { "categories": [], "states": [], "competitions": [], "workshops": [] }
}
```

Exports will use either dedicated endpoints or an `export=excel|pdf` parameter. Dedicated export handlers are preferred so browser downloads, content types, filenames, and permission checks are explicit.

## 6. Data and query rules

1. Build report rows from database data, not from the currently loaded frontend page.
2. Normalize individual and group registrations into a common participant-row shape for program reports.
3. Expand array/JSON selections so competitions and workshops produce one row per participant/program.
4. Exclude drafts and records that are not valid submissions unless an explicit future admin option enables them.
5. Preserve group member registration numbers when available; otherwise derive a stable member reference from the group registration number.
6. Use parameterized SQL for all filters and whitelist sortable fields.
7. Keep a single column definition per report so the table, Excel export, and PDF export cannot drift apart.

## 7. Frontend implementation plan

1. Extend the existing Reports navigation entry with report submenu items and active-route highlighting.
2. Add a reusable `AdminReportPage` shell for title, filters, actions, table, and pagination.
3. Add report-specific column definitions and filter controls.
4. Add a shared report data hook for request cancellation, loading state, pagination, and refresh.
5. Add export buttons that preserve all active query parameters.
6. Add responsive table behavior for smaller screens and horizontal scrolling for wide reports.
7. Add route-aware browser history behavior so each report link can be opened directly.

## 8. Export and presentation details

- Excel filenames: `registration-individual-YYYY-MM-DD.xlsx`, `registration-group-YYYY-MM-DD.xlsx`, and equivalent report names.
- PDF filenames use the same naming convention with `.pdf`.
- Dates will use one consistent Indian locale format in the UI and exports.
- Long text such as institution names and workshop names will wrap in PDF cells.
- PDF exports will repeat column headers and show the generated date and active filters.

## 9. Verification and acceptance criteria

- Each report is reachable from the Reports menu and by direct URL.
- Individual and group registration reports are separate and contain the requested columns.
- Competition and workshop reports are correctly expanded and filterable by their selected program.
- Search and every relevant filter affect both the table and exports.
- Pagination shows accurate totals and does not load the entire dataset into the browser.
- Excel opens successfully with correct headers and all filtered rows.
- PDF is readable, paginated, and contains the report title and filter summary.
- Unauthorized users cannot view or export reports.
- Empty results, failed requests, and large result sets are handled cleanly.
- Existing admin pages and registration flows continue to build and function.

## 10. Phase-by-phase delivery plan

The implementation will follow these phases in sequence. A phase is complete only when its checklist and exit criteria are satisfied.

### Phase 0 — Scope and data contract

**Purpose:** remove ambiguity before coding.

Checklist:

- Confirm the final report names, menu labels, and direct URLs.
- Confirm whether `Register Date` and `Date of Registration` are intentionally different fields.
- Confirm which records are included by default: all submitted records, paid records only, or confirmed records only.
- Confirm the exact meaning of state and institution/college fields for individual and group members.
- Confirm how group registration numbers and member registration numbers should appear.
- Confirm PDF branding, page orientation, timezone, date format, and maximum export size.
- Confirm whether report exports need a generated-by admin name.
- Record all decisions in this document before Phase 1 begins.

Deliverables:

- Approved report column list.
- Approved inclusion and date rules.
- Approved URL/menu map.
- Approved export format rules.

Exit criteria: no unresolved decision changes the database query or visible columns.

### Phase 1 — Existing system and schema audit

**Purpose:** map the current implementation before adding duplicate logic.

Checklist:

- Review registration tables, group registration tables, member tables, payment fields, and JSON/array fields.
- Identify the canonical fields for name, mobile, email, category, college, state, food preference, presentation, HR area, and program selections.
- Identify submitted/created/updated timestamps and timezone handling.
- Review existing admin authentication, sessions, roles, and `report.view`/`report.export` permissions.
- Review existing admin routes, navigation modules, API response conventions, and error handling.
- Check whether any current export utility or PDF/Excel dependency can be reused.
- Identify indexes needed for search, dates, registration number, state, category, and program filters.
- Prepare representative test records: individual, group, paid, unpaid, missing optional values, and multi-program participants.

Deliverables:

- Field mapping table.
- Query/data gap list.
- Required migration/index list, if any.
- Test data matrix.

Exit criteria: every requested column has a verified source field or an explicitly approved derived rule.

### Phase 2 — Shared backend report foundation

**Purpose:** create reliable common infrastructure used by all reports.

Checklist:

- Create validated query-parameter parsing for page, page size, search, dates, filters, and sorting.
- Add safe whitelist validation for sortable columns.
- Add consistent Indian timezone/date boundary handling.
- Add server-side pagination and total-count queries.
- Add common permission enforcement for viewing and exporting.
- Add a common normalized participant/report-row shape.
- Add consistent null, empty-array, and missing-value formatting.
- Add request logging/error handling without exposing sensitive participant data.
- Add indexes or query improvements identified in Phase 1.

Deliverables:

- Reusable report query utilities.
- Shared validation and permission helpers.
- Shared pagination metadata format.
- Automated tests for parameters and permission failures.

Exit criteria: a sample report query returns correct rows, totals, filters, and authorization responses.

### Phase 3 — Registration reports

**Purpose:** implement the two general registration reports first because they establish the base participant dataset.

Checklist:

- Implement individual registration query and mapping.
- Implement group registration query and mapping.
- Decide and implement group coordinator/member display rules.
- Add all requested registration columns.
- Add search, date, category, state, and payment filters.
- Add sorting by registration date, registration number, and name.
- Add pagination and result counts.
- Add empty/loading/error states in the UI.
- Compare totals and sample rows against the source database.

Deliverables:

- Individual registration report endpoint and screen.
- Group registration report endpoint and screen.
- Registration report tests and field mapping verification.

Exit criteria: both reports show accurate records and can be opened directly from their planned URLs.

### Phase 4 — Program participation reports

**Purpose:** implement the three reports derived from participant selections.

Checklist:

- Implement competition expansion: one row per participant per selected competition.
- Implement workshop expansion: one row per participant per selected workshop.
- Exclude non-participants and empty selections.
- Include group members correctly, preserving their individual details.
- Implement presentation participation filtering and presentation type mapping.
- Implement HR Drive participation filtering and core-area mapping.
- Add competition/workshop/type/core-area filters.
- Verify duplicate selections do not create accidental duplicate rows.
- Verify participants with multiple selections produce the intended number of rows.

Deliverables:

- Student Skill Competition report.
- Workshops report.
- Presentation report.
- HR Drive report.
- Program expansion and duplicate-handling tests.

Exit criteria: every program report correctly represents both individual and group participants.

### Phase 5 — Reports navigation and frontend experience

**Purpose:** make every report easy to discover and use.

Checklist:

- Add the Reports submenu to the existing admin navigation.
- Add active state and expanded/collapsed behavior.
- Add direct-link routing and browser refresh support.
- Build a reusable report page shell.
- Build reusable filter controls and clear-filter behavior.
- Build reusable table, column, loading, empty, error, and pagination components.
- Add responsive handling for wide tables.
- Reset page number when filters change.
- Prevent stale requests from overwriting newer filter results.
- Preserve active filters while moving between pages.
- Confirm unauthorized modules remain hidden/blocked.

Deliverables:

- Completed Reports navigation.
- Five report screens plus individual/group registration screens.
- Shared report UI components.

Exit criteria: an admin can navigate, filter, paginate, refresh, and deep-link to every report.

### Phase 6 — Excel export

**Purpose:** provide complete filtered data in spreadsheet format.

Checklist:

- Select or add a maintained Excel-generation dependency.
- Reuse the exact validated filters used by the report table.
- Export all matching filtered rows, not only the current page.
- Match export columns and order to the visible report definition.
- Add report title, generated timestamp, and filter summary where supported.
- Apply readable headers, date formats, column widths, and text handling.
- Sanitize filenames and use the agreed naming convention.
- Enforce `report.export` separately from `report.view`.
- Test empty exports, large exports, special characters, and long institution/workshop names.

Deliverables:

- Excel export for every report.
- Download/error states and export tests.

Exit criteria: every filtered Excel file opens successfully and contains the complete matching dataset.

### Phase 7 — PDF export

**Purpose:** provide print-ready report documents.

Checklist:

- Select or add a maintained PDF-generation solution compatible with the deployment environment.
- Configure page size, orientation, margins, typography, and branding.
- Add report title, generated timestamp, active-filter summary, and page numbers.
- Repeat table headers on every page.
- Wrap long fields and prevent unreadable clipping.
- Handle wide reports with landscape orientation where required.
- Export all filtered rows, not only the visible page.
- Enforce `report.export` and sanitize filenames.
- Test empty results, multi-page output, long values, Unicode text, and date formatting.

Deliverables:

- PDF export for every report.
- Print/readability test results.

Exit criteria: each PDF is readable, paginated, correctly branded, and matches the selected filters.

### Phase 8 — Security, performance, and data quality review

**Purpose:** ensure reports are safe and usable with real event data.

Checklist:

- Verify unauthenticated users cannot access report endpoints or pages.
- Verify users without `report.view` cannot view reports.
- Verify users with `report.view` but without `report.export` cannot export.
- Test SQL injection-like input, oversized page sizes, invalid dates, invalid filters, and invalid sort fields.
- Confirm exports do not expose hidden fields or credentials.
- Test query performance with production-sized data.
- Confirm indexes are used for common filters.
- Verify counts, pagination boundaries, date inclusivity, and timezone behavior.
- Verify missing optional fields render consistently as `—` or the approved placeholder.
- Verify group records do not double-count registrations in registration reports.

Deliverables:

- Security test results.
- Performance results and query/index fixes.
- Data quality exception list.

Exit criteria: no critical authorization, data leakage, incorrect-count, or unacceptable-performance issues remain.

### Phase 9 — Full QA and regression testing

**Purpose:** validate the complete feature and protect existing functionality.

Checklist:

- Test every navigation link and direct URL.
- Test every filter alone and in combinations.
- Test search with partial names, registration numbers, emails, mobile numbers, and institutions.
- Test first, middle, last, and invalid pagination pages.
- Test page-size changes and filter resets.
- Test all exports with and without filters.
- Compare UI rows, API rows, Excel rows, and PDF rows for the same filter set.
- Test individual and group data, multiple competitions/workshops, presentations, HR areas, and food preferences.
- Test paid, pending, failed, and missing payment states.
- Test mobile/tablet/desktop layouts.
- Run existing application tests and `npm run build`.
- Check browser console and server logs for errors.

Deliverables:

- QA checklist with pass/fail results.
- Regression results.
- Final issue list and resolution notes.

Exit criteria: all acceptance criteria in Section 11 pass.

### Phase 10 — Deployment and handover

**Purpose:** release safely and document operation.

Checklist:

- Review changed files and database migrations.
- Apply migrations/indexes in the deployment environment.
- Confirm export dependencies are included in the production build.
- Deploy backend and frontend changes together.
- Run smoke tests using a real authorized admin account.
- Verify report permissions for each admin role.
- Verify one Excel and one PDF export for every report.
- Confirm production logs and error monitoring.
- Provide administrators with a short usage note covering filters, pagination, and exports.
- Record rollback steps and known limitations.

Deliverables:

- Production release.
- Admin usage note.
- Deployment and rollback notes.

Exit criteria: production smoke tests pass and the event team confirms the reports meet the approved column and filtering requirements.

## 11. Decisions to confirm before Phase 1

- Whether **Register Date** and **Date of Registration** should remain two visibly separate columns when they resolve to the same timestamp, or whether one should be renamed to **Submitted Date**.
- Whether unpaid, pending, and failed registrations should be included by default or only paid/confirmed registrations.
- The exact PDF page orientation and branding assets for wide reports.
