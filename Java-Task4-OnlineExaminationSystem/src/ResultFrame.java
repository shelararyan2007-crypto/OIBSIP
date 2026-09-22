import javax.swing.*;
import java.awt.*;

public class ResultFrame extends JFrame {

    public ResultFrame(int totalQuestions, int correctAnswers) {

        setTitle("Online Examination System - Result");
        setSize(550, 480);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        int incorrectAnswers = totalQuestions - correctAnswers;

        double percentage =
                ((double) correctAnswers / totalQuestions) * 100;

        String status = percentage >= 40 ? "PASS" : "FAIL";

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        mainPanel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(null);
        headerPanel.setBackground(new Color(25, 45, 75));
        headerPanel.setBounds(0, 0, 550, 85);
        mainPanel.add(headerPanel);

        JLabel titleLabel = new JLabel("EXAMINATION RESULT");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 25));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        titleLabel.setBounds(100, 20, 350, 40);
        headerPanel.add(titleLabel);

        // Result card
        JPanel resultPanel = new JPanel();
        resultPanel.setLayout(null);
        resultPanel.setBackground(Color.WHITE);
        resultPanel.setBounds(55, 110, 440, 250);
        mainPanel.add(resultPanel);

        // Score
        JLabel scoreLabel = new JLabel(
                correctAnswers + " / " + totalQuestions
        );
        scoreLabel.setFont(new Font("Arial", Font.BOLD, 32));
        scoreLabel.setForeground(new Color(25, 45, 75));
        scoreLabel.setHorizontalAlignment(SwingConstants.CENTER);
        scoreLabel.setBounds(120, 15, 200, 45);
        resultPanel.add(scoreLabel);

        JLabel scoreText = new JLabel("Your Score");
        scoreText.setFont(new Font("Arial", Font.PLAIN, 14));
        scoreText.setForeground(new Color(100, 100, 100));
        scoreText.setHorizontalAlignment(SwingConstants.CENTER);
        scoreText.setBounds(120, 55, 200, 25);
        resultPanel.add(scoreText);

        // Total
        JLabel totalLabel = new JLabel(
                "Total Questions: " + totalQuestions
        );
        totalLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        totalLabel.setBounds(45, 95, 300, 25);
        resultPanel.add(totalLabel);

        // Correct
        JLabel correctLabel = new JLabel(
                "Correct Answers: " + correctAnswers
        );
        correctLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        correctLabel.setBounds(45, 130, 300, 25);
        resultPanel.add(correctLabel);

        // Incorrect
        JLabel incorrectLabel = new JLabel(
                "Incorrect Answers: " + incorrectAnswers
        );
        incorrectLabel.setFont(new Font("Arial", Font.PLAIN, 16));
        incorrectLabel.setBounds(45, 165, 300, 25);
        resultPanel.add(incorrectLabel);

        // Percentage
        JLabel percentageLabel = new JLabel(
                String.format("Percentage: %.2f%%", percentage)
        );
        percentageLabel.setFont(new Font("Arial", Font.BOLD, 17));
        percentageLabel.setBounds(45, 200, 300, 25);
        resultPanel.add(percentageLabel);

        // Status
       // Status
JLabel statusLabel = new JLabel("Status: " + status);
statusLabel.setFont(new Font("Arial", Font.BOLD, 20));
statusLabel.setHorizontalAlignment(SwingConstants.CENTER);
statusLabel.setBounds(120, 225, 200, 35);
resultPanel.add(statusLabel);

        // Close button
        JButton closeButton = new JButton("Close");
        closeButton.setFont(new Font("Arial", Font.BOLD, 13));
        closeButton.setBounds(205, 385, 120, 38);
        closeButton.setFocusPainted(false);
        mainPanel.add(closeButton);

        closeButton.addActionListener(e -> System.exit(0));

        add(mainPanel);
    }
}