import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send-booking", async (req, res) => {
  const { name, email, course, requirement } = req.body;

  // 🔍 Basic validation
  if (!name || !email || !course) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }

  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "eceproblemsolver@gmail.com",
    // to: "aryeshsrivastava@gmail.com",
      subject: "New Booking Request",
      html: `
        <h2>New Query</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Course:</b> ${course}</p>
        <p><b>Requirement:</b> ${requirement || "Not specified"}</p>
      `
    });

    // 🔎 Check Resend response
    if (!response || response.error) {
      console.log("Resend Error:", response.error);
      return res.status(500).json({
        success: false,
        message: "Email service failed"
      });
    }

    return res.json({
      success: true,
      message: "Booking request sent successfully"
    });

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on Port 5000");
});