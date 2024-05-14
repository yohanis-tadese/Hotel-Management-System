const forgetService = require("../service/forgot.service");

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const foundEmail = await forgetService.findByEmail(email);

    if (foundEmail !== null) {
      // Call the service function to handle forgot password
      const message = await forgetService.generateForgotTokenAndSendEmail(
        email
      );

      // Respond with success message
      res.send({ Data: foundEmail, message });
    } else {
      res.send({ Status: "Email not found" });
    }
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send({ error: "Failed to process request" });
  }
}

async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Call the service function to reset the password
    await forgetService.resetPasswordWithToken(token, newPassword);

    // Respond with success message
    res.send({ status: "sucess", message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send({ error: "Failed to reset password" });
  }
}

module.exports = {
  forgotPassword,
  resetPassword,
};
