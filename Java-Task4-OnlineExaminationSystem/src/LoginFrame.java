import javax.swing.*;
import java.awt.*;

public class LoginFrame extends JFrame {

    private JTextField userField;
    private JPasswordField passwordField;

    public LoginFrame() {

        setTitle("Online Examination System - Login");
        setSize(500, 400);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        mainPanel.setBackground(new Color(245, 247, 250));

        // Main title
        JLabel titleLabel = new JLabel("ONLINE EXAMINATION SYSTEM");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        titleLabel.setForeground(new Color(25, 45, 75));
        titleLabel.setBounds(85, 35, 350, 35);
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        mainPanel.add(titleLabel);

        // Subtitle
        JLabel subtitleLabel = new JLabel("Student Login Portal");
        subtitleLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        subtitleLabel.setForeground(new Color(90, 90, 90));
        subtitleLabel.setBounds(150, 75, 200, 25);
        subtitleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        mainPanel.add(subtitleLabel);

        // User ID
        JLabel userLabel = new JLabel("User ID");
        userLabel.setFont(new Font("Arial", Font.BOLD, 14));
        userLabel.setBounds(80, 125, 100, 25);
        mainPanel.add(userLabel);

        userField = new JTextField();
        userField.setFont(new Font("Arial", Font.PLAIN, 14));
        userField.setBounds(180, 120, 240, 35);
        mainPanel.add(userField);

        // Password
        JLabel passwordLabel = new JLabel("Password");
        passwordLabel.setFont(new Font("Arial", Font.BOLD, 14));
        passwordLabel.setBounds(80, 180, 100, 25);
        mainPanel.add(passwordLabel);

        passwordField = new JPasswordField();
        passwordField.setFont(new Font("Arial", Font.PLAIN, 14));
        passwordField.setBounds(180, 175, 240, 35);
        mainPanel.add(passwordField);

        // Login button
        JButton loginButton = new JButton("LOGIN");
        loginButton.setFont(new Font("Arial", Font.BOLD, 14));
        loginButton.setBounds(180, 235, 110, 40);
        loginButton.setFocusPainted(false);
        mainPanel.add(loginButton);

        // Exit button
        JButton exitButton = new JButton("EXIT");
        exitButton.setFont(new Font("Arial", Font.BOLD, 14));
        exitButton.setBounds(310, 235, 110, 40);
        exitButton.setFocusPainted(false);
        mainPanel.add(exitButton);

        // Demo credentials
        JLabel credentialsLabel = new JLabel(
                "Demo: student101 / 1234"
        );
        credentialsLabel.setFont(new Font("Arial", Font.ITALIC, 12));
        credentialsLabel.setForeground(new Color(100, 100, 100));
        credentialsLabel.setBounds(165, 295, 200, 25);
        credentialsLabel.setHorizontalAlignment(SwingConstants.CENTER);
        mainPanel.add(credentialsLabel);

        // Login action
        loginButton.addActionListener(e -> login());

        // Exit action
        exitButton.addActionListener(e -> {

            int result = JOptionPane.showConfirmDialog(
                    this,
                    "Are you sure you want to exit?",
                    "Confirm Exit",
                    JOptionPane.YES_NO_OPTION
            );

            if (result == JOptionPane.YES_OPTION) {
                System.exit(0);
            }
        });

        // Press Enter to login
        passwordField.addActionListener(e -> login());

        add(mainPanel);
    }

    private void login() {

        String userId = userField.getText().trim();
        String password = new String(passwordField.getPassword());

        if (userId.equals("student101") && password.equals("1234")) {

            JOptionPane.showMessageDialog(
                    this,
                    "Login successful!",
                    "Welcome",
                    JOptionPane.INFORMATION_MESSAGE
            );

            dispose();

            ExamFrame examFrame = new ExamFrame();
            examFrame.setVisible(true);

        } else {

            JOptionPane.showMessageDialog(
                    this,
                    "Invalid User ID or Password.",
                    "Login Failed",
                    JOptionPane.ERROR_MESSAGE
            );
        }
    }

    public static void main(String[] args) {

        SwingUtilities.invokeLater(() -> {

            LoginFrame frame = new LoginFrame();
            frame.setVisible(true);

        });
    }
}