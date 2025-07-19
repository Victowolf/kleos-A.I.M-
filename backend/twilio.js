import express from "express";
import twilio from "twilio";


const router = express.Router();

const accountSid = "AC341e3f255e6a04a54afea4df66675eb0";
const authToken = "c0e945613ce3dd375516bfa92be1ce4f";
const twilioNumber = "+12515121689";


const client = twilio(accountSid, authToken);

router.post("/send-sms", async (req, res) => {
  const { to, body } = req.body;

  // Input validation
  if (!to || typeof to !== "string" || !to.match(/^\+\d{10,}$/)) {
    return res.status(400).json({
      success: false,
      error: "'to' (E.164 phone number) is required (e.g., +919999999999)",
    });
  }
  if (!body || typeof body !== "string" || body.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "'body' (non-empty message text) is required",
    });
  }

  try {
    const message = await client.messages.create({
      body,
      from: twilioNumber,
      to,
    });
    res.status(200).json({ success: true, sid: message.sid });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({
      success: false,
      error: err.message,
      code: err.code,
      more: err.moreInfo,
    });
  }
});

export default router;
