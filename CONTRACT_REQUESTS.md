# Parcella Backend Contract Requests & Feedback

This document tracks schema enhancements, missing fields, or contract improvements requested by the frontend team for future backend slices.

---

## 1. Slice 3 Feedback & Requests (for Backend Slice 4)

### CR-001: Add `licenseUploaded: boolean` to `DriverSummary` in `UserResponse`
- **Current Behavior (`.docs/api/slice-3.md` §6 Known Gap 1):**
  `UserResponse.driver` contains `verificationStatus`, `availabilityStatus`, `averageRating`, `trustScore`, and `verificationNote: string | null`. It does NOT indicate whether a driver license image has already been uploaded by the driver.
- **Frontend Impact:**
  Drivers who refresh the page or sign in from a different session cannot determine whether their license document was already uploaded and is waiting for review, or if they still need to upload one. Admins can see `licenseImageUrl`, but the driver's own profile (`GET /me`) does not expose this flag.
- **Temporary Frontend Mitigation (Slice F3):**
  The driver interface maintains a session-level "just uploaded" confirmation state and shows the upload/replace widget for all `PENDING` and `REJECTED` drivers.
- **Requested Schema Change:**
  Add `licenseUploaded: boolean` to `DriverSummary`:
  ```json
  "driver": {
    "verificationStatus": "PENDING",
    "availabilityStatus": "OFFLINE",
    "averageRating": 0.0,
    "trustScore": 100.0,
    "verificationNote": null,
    "licenseUploaded": true
  }
  ```
