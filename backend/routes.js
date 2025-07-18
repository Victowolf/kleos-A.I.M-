import express from "express";
import multer from "multer";
import KYC, { VerificationMetadata } from "./models.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Save user details (initial KYC entry creation)
router.post("/kyc/details", async (req, res) => {
  const {
    fullName, dob, gender, address,
    email, state, phone, altPhone,
    aadhaarNumber
  } = req.body;

  const kycId = "KYC" + Date.now();

  try {
    const currentSubmissionTime = new Date();

    const newKycEntry = new KYC({
      fullName,
      dob,
      gender,
      address,
      email,
      state,
      phone,
      altPhone,
      aadhaarNumber,
      kycId,
      consentGiven: false,
      submittedAt: currentSubmissionTime
    });

    const kycExpiryDate = new Date(currentSubmissionTime);
    kycExpiryDate.setFullYear(kycExpiryDate.getFullYear() + 5);
    newKycEntry.kycExpiryDate = kycExpiryDate;

    await newKycEntry.save();

    res.status(201).json({
      kycId: newKycEntry.kycId,
      submittedAt: newKycEntry.submittedAt,
      kycExpiryDate: newKycEntry.kycExpiryDate,
      message: "User details saved successfully and KYC entry created"
    });
  } catch (error) {
    console.error("Failed to save user details:", error);
    res.status(500).json({ error: "Failed to save user details" });
  }
});

// Upload multiple documents
router.post("/kyc/:kycId/documents", upload.array("docs"), async (req, res) => {
  const { kycId } = req.params;
  const { docMeta } = req.body;
  const files = req.files;

  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc) return res.status(404).json({ error: "KYC ID not found" });

    let uploadedDocs = [];

    if (files && files.length > 0 && docMeta && Array.isArray(docMeta) && docMeta.length === files.length) {
      const parsedDocMeta = docMeta.map(metaStr => JSON.parse(metaStr));
      uploadedDocs = files.map((file, index) => {
        const metadata = parsedDocMeta.find(m => m.index === index);
        if (!metadata) {
          console.warn(`Metadata not found for file at index ${index}`);
          return null;
        }
        return {
          type: metadata.type,
          file: file.buffer,
          contentType: file.mimetype,
        };
      }).filter(doc => doc !== null);
    } else {
      console.warn("No documents provided for upload or metadata mismatch. Proceeding without documents.");
    }

    kyc.documents.push(...uploadedDocs);
    await kyc.save();

    res.json({ message: "Documents processed successfully (some may be missing if not provided)" });
  } catch (error) {
    console.error("Error processing documents:", error);
    res.status(500).json({ error: "Failed to process documents" });
  }
});

// Upload selfie from webcam
router.post("/kyc/:kycId/selfie", upload.single("selfie"), async (req, res) => {
  const { kycId } = req.params;

  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc) return res.status(404).json({ error: "KYC ID not found" });

    if (!req.file) {
      return res.status(400).json({ error: "No selfie file provided." });
    }

    kyc.selfie = {
      file: req.file.buffer,
      contentType: req.file.mimetype
    };

    await kyc.save();
    res.json({ message: "Selfie uploaded successfully" });
  } catch (error) {
    console.error("Error uploading selfie:", error);
    res.status(500).json({ error: "Failed to upload selfie" });
  }
});

// Record consent and finalize KYC
router.post("/kyc/:kycId/consent", async (req, res) => {
  const { kycId } = req.params;
  const { consentGiven } = req.body;

  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc) return res.status(404).json({ error: "KYC ID not found" });

    kyc.consentGiven = consentGiven;
    await kyc.save();
    res.json({ message: "Consent recorded successfully and KYC finalized" });
  } catch (error) {
    console.error("Error recording consent:", error);
    res.status(500).json({ error: "Failed to record consent" });
  }
});

// QR CODE SCAN & VERIFICATION METADATA LOGGING
router.post("/kyc/:kycId/verify", async (req, res) => {
  const { kycId } = req.params;
  try {
    const kyc = await KYC.findOne({ kycId });
    if (!kyc) return res.status(404).json({ error: "KYC ID not found" });

    const now = new Date();

    // Store State, KYC Hash, Expiry Date, Name as scan metadata
    await VerificationMetadata.create({
      kycId: kyc.kycId,
      userName: kyc.fullName,
      state: kyc.state,
      expiryDate: kyc.kycExpiryDate,
      scannedAt: now
    });

    // Respond with these exact fields in metadata
    res.json({
      kyc_data: {
        state: kyc.state,
        kyc_id: kyc.kycId,
        expiry_date: kyc.kycExpiryDate,
        name: kyc.fullName
      }
    });
  } catch (error) {
    console.error("Error verifying KYC:", error);
    res.status(500).json({ error: "Failed to verify KYC" });
  }
});

export default router;
