import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';

const TermsAndConditionsDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h5" component="div">
          Terms and Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Last updated: April 22, 2025
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            1. Introduction
          </Typography>
          <Typography variant="body2" paragraph>
            Welcome to Diet Planner App. These Terms and Conditions govern your use of our web application and services. By 
            registering for an account and using our service, you agree to comply with and be bound by these Terms.
          </Typography>
          <Typography variant="body2" paragraph>
            Please read these Terms carefully before creating an account. If you do not agree with any part of these Terms, 
            you may not register for or use our services.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            2. Account Registration and Security
          </Typography>
          <Typography variant="body2" paragraph>
            To use certain features of our service, you must register for an account. You agree to provide accurate, current, 
            and complete information during the registration process.
          </Typography>
          <Typography variant="body2" paragraph>
            You are responsible for maintaining the confidentiality of your account information, including your password, and 
            for all activity that occurs under your account. You agree to notify us immediately of any unauthorized use of your 
            account or any other breach of security.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            3. Diet and Nutrition Disclaimer
          </Typography>
          <Typography variant="body2" paragraph>
            The dietary plans, nutritional information, and recommendations provided through our service are for informational 
            purposes only and are not intended to replace professional medical advice, diagnosis, or treatment.
          </Typography>
          <Typography variant="body2" paragraph>
            Always consult with a qualified healthcare provider or nutritionist before starting any diet, exercise program, or 
            nutritional supplementation, especially if you have any pre-existing health conditions or concerns.
          </Typography>
          <Typography variant="body2" paragraph>
            The Diet Planner App does not guarantee specific results from following our dietary plans, and individual results 
            may vary based on factors outside our control.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            4. Privacy Policy
          </Typography>
          <Typography variant="body2" paragraph>
            Your use of our service is also governed by our Privacy Policy, which details how we collect, use, and protect your 
            personal information. By using our service, you also consent to our Privacy Policy.
          </Typography>
          <Typography variant="body2" paragraph>
            We collect and store personal information related to your health, dietary preferences, and physical characteristics 
            to provide you with tailored dietary plans. This information is kept confidential and used only for service 
            improvement purposes.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            5. User Content and Behavior
          </Typography>
          <Typography variant="body2" paragraph>
            You retain ownership of any content you provide to our service. However, by submitting content, you grant us a 
            worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content for the purpose 
            of providing and improving our services.
          </Typography>
          <Typography variant="body2" paragraph>
            You agree not to use our service for any unlawful purpose or in any way that could damage, disable, or impair our 
            service. You also agree not to attempt to gain unauthorized access to any part of our service or systems.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            6. Termination
          </Typography>
          <Typography variant="body2" paragraph>
            We reserve the right to terminate or suspend your account and access to our service at our sole discretion, without 
            notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for 
            any other reason.
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            7. Changes to Terms
          </Typography>
          <Typography variant="body2" paragraph>
            We may modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms 
            on this page with a new effective date. Your continued use of our service after such modifications constitutes your 
            acceptance of the updated Terms.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" gutterBottom>
            8. Contact Information
          </Typography>
          <Typography variant="body2" paragraph>
            If you have any questions about these Terms, please contact us at praveen.dubbaka@designhawks.ca.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndConditionsDialog;