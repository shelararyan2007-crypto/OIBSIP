import javax.swing.*;
import java.awt.*;

public class ProfileFrame extends JFrame {

    private JTextField nameField;
    private JTextField userIdField;
    private JTextField emailField;
    private JTextField phoneField;

    public ProfileFrame() {

        setTitle("Online Examination System - Profile");
        setSize(550, 500);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        mainPanel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(null);
        headerPanel.setBackground(new Color(25, 45, 75));
        headerPanel.setBounds(0, 0, 550, 80);
        mainPanel.add(headerPanel);

        JLabel titleLabel = new JLabel("STUDENT PROFILE");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        titleLabel.setBounds(100, 20, 350, 35);
        headerPanel.add(titleLabel);

        // Profile card
        JPanel profilePanel = new JPanel();
        profilePanel.setLayout(null);
        profilePanel.setBackground(Color.WHITE);
        profilePanel.setBounds(55, 105, 440, 285);
        mainPanel.add(profilePanel);

        // Name
        JLabel nameLabel = new JLabel("Name");
        nameLabel.setFont(new Font("Arial", Font.BOLD, 14));
        nameLabel.setBounds(35, 25, 100, 25);
        profilePanel.add(nameLabel);

        nameField = new JTextField("Student");
        nameField.setFont(new Font("Arial", Font.PLAIN, 14));
        nameField.setBounds(150, 20, 250, 32);
        profilePanel.add(nameField);

        // User ID
        JLabel userIdLabel = new JLabel("User ID");
        userIdLabel.setFont(new Font("Arial", Font.BOLD, 14));
        userIdLabel.setBounds(35, 80, 100, 25);
        profilePanel.add(userIdLabel);

        userIdField = new JTextField("student101");
        userIdField.setFont(new Font("Arial", Font.PLAIN, 14));
        userIdField.setBounds(150, 75, 250, 32);
        userIdField.setEditable(false);
        profilePanel.add(userIdField);

        // Email
        JLabel emailLabel = new JLabel("Email");
        emailLabel.setFont(new Font("Arial", Font.BOLD, 14));
        emailLabel.setBounds(35, 135, 100, 25);
        profilePanel.add(emailLabel);

        emailField = new JTextField("student101@example.com");
        emailField.setFont(new Font("Arial", Font.PLAIN, 14));
        emailField.setBounds(150, 130, 250, 32);
        profilePanel.add(emailField);

        // Phone
        JLabel phoneLabel = new JLabel("Phone");
        phoneLabel.setFont(new Font("Arial", Font.BOLD, 14));
        phoneLabel.setBounds(35, 190, 100, 25);
        profilePanel.add(phoneLabel);

        phoneField = new JTextField("9876543210");
        phoneField.setFont(new Font("Arial", Font.PLAIN, 14));
        phoneField.setBounds(150, 185, 250, 32);
        profilePanel.add(phoneField);

        // Update button
        JButton updateButton = new JButton("Update Profile");
        updateButton.setFont(new Font("Arial", Font.BOLD, 13));
        updateButton.setBounds(170, 415, 150, 38);
        updateButton.setFocusPainted(false);
        mainPanel.add(updateButton);

        updateButton.addActionListener(e -> updateProfile());

        add(mainPanel);
    }

    private void updateProfile() {

        String name = nameField.getText().trim();
        String email = emailField.getText().trim();
        String phone = phoneField.getText().trim();

        if (name.isEmpty() || email.isEmpty() || phone.isEmpty()) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please fill all fields.",
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE
            );

            return;
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please enter a valid email address.",
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE
            );

            return;
        }

        if (!phone.matches("\\d{10}")) {

            JOptionPane.showMessageDialog(
                    this,
                    "Phone number must contain exactly 10 digits.",
                    "Validation Error",
                    JOptionPane.WARNING_MESSAGE
            );

            return;
        }

        JOptionPane.showMessageDialog(
                this,
                "Profile updated successfully!",
                "Success",
                JOptionPane.INFORMATION_MESSAGE
        );
    }
}