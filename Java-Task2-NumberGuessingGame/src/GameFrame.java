import javax.swing.*;
import java.awt.*;

public class GameFrame extends JFrame {

    private JComboBox<String> difficultyBox;
    private JTextField guessField;

    private JLabel rangeLabel;
    private JLabel attemptsLabel;
    private JLabel messageLabel;
    private JLabel scoreLabel;
    private JLabel roundLabel;

    private JButton guessButton;
    private JButton newRoundButton;

    private Game game;

    private int roundNumber = 1;
    private int score = 0;

    public GameFrame() {

        setTitle("Number Guessing Game");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        createUI();
        startNewRound();
    }

    private void createUI() {

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        mainPanel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(null);
        headerPanel.setBackground(new Color(25, 45, 75));
        headerPanel.setBounds(0, 0, 600, 80);
        mainPanel.add(headerPanel);

        JLabel titleLabel = new JLabel("NUMBER GUESSING GAME");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 25));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setHorizontalAlignment(SwingConstants.CENTER);
        titleLabel.setBounds(100, 18, 400, 40);
        headerPanel.add(titleLabel);

        // Difficulty
        JLabel difficultyLabel = new JLabel("Difficulty:");
        difficultyLabel.setFont(new Font("Arial", Font.BOLD, 14));
        difficultyLabel.setBounds(55, 105, 100, 30);
        mainPanel.add(difficultyLabel);

        difficultyBox = new JComboBox<>(
                new String[]{"Easy", "Medium", "Hard"}
        );

        difficultyBox.setBounds(155, 102, 150, 35);
        difficultyBox.setFont(new Font("Arial", Font.PLAIN, 14));
        mainPanel.add(difficultyBox);

        // Round
        roundLabel = new JLabel("Round 1");
        roundLabel.setFont(new Font("Arial", Font.BOLD, 14));
        roundLabel.setHorizontalAlignment(SwingConstants.RIGHT);
        roundLabel.setBounds(400, 105, 140, 30);
        mainPanel.add(roundLabel);

        // Range
        rangeLabel = new JLabel();
        rangeLabel.setFont(new Font("Arial", Font.BOLD, 16));
        rangeLabel.setForeground(new Color(25, 45, 75));
        rangeLabel.setHorizontalAlignment(SwingConstants.CENTER);
        rangeLabel.setBounds(100, 155, 400, 30);
        mainPanel.add(rangeLabel);

        // Instruction
        JLabel instructionLabel = new JLabel(
                "Enter your guess and try to find the hidden number."
        );

        instructionLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        instructionLabel.setForeground(new Color(80, 80, 80));
        instructionLabel.setHorizontalAlignment(SwingConstants.CENTER);
        instructionLabel.setBounds(70, 190, 460, 30);
        mainPanel.add(instructionLabel);

        // Guess field
        guessField = new JTextField();
        guessField.setFont(new Font("Arial", Font.BOLD, 18));
        guessField.setHorizontalAlignment(JTextField.CENTER);
        guessField.setBounds(170, 230, 260, 40);
        mainPanel.add(guessField);

        // Guess button
        guessButton = new JButton("GUESS");
        guessButton.setFont(new Font("Arial", Font.BOLD, 14));
        guessButton.setBounds(215, 285, 170, 40);
        guessButton.setFocusPainted(false);
        mainPanel.add(guessButton);

        // Message
        messageLabel = new JLabel("Good luck!");
        messageLabel.setFont(new Font("Arial", Font.BOLD, 17));
        messageLabel.setHorizontalAlignment(SwingConstants.CENTER);
        messageLabel.setBounds(100, 335, 400, 30);
        mainPanel.add(messageLabel);

        // Attempts
        attemptsLabel = new JLabel();
        attemptsLabel.setFont(new Font("Arial", Font.PLAIN, 14));
        attemptsLabel.setHorizontalAlignment(SwingConstants.CENTER);
        attemptsLabel.setBounds(100, 370, 400, 25);
        mainPanel.add(attemptsLabel);

        // Score
        scoreLabel = new JLabel();
        scoreLabel.setFont(new Font("Arial", Font.BOLD, 14));
        scoreLabel.setHorizontalAlignment(SwingConstants.CENTER);
        scoreLabel.setBounds(100, 400, 400, 25);
        mainPanel.add(scoreLabel);

        // New Round button
        newRoundButton = new JButton("PLAY AGAIN");
        newRoundButton.setFont(new Font("Arial", Font.BOLD, 13));
        newRoundButton.setBounds(215, 430, 170, 35);
        newRoundButton.setFocusPainted(false);
        newRoundButton.setEnabled(false);
        mainPanel.add(newRoundButton);

        // Button actions
        guessButton.addActionListener(e -> makeGuess());

        guessField.addActionListener(e -> makeGuess());

        difficultyBox.addActionListener(e -> {

            if (game != null) {
                startNewRound();
            }
        });

        newRoundButton.addActionListener(e -> {

            roundNumber++;
            roundLabel.setText("Round " + roundNumber);

            startNewRound();
        });

        add(mainPanel);
    }

    private void startNewRound() {

        String difficulty =
                difficultyBox.getSelectedItem().toString();

        game = new Game(difficulty);

        rangeLabel.setText(
                "Guess a number between 1 and "
                        + game.getRange()
        );

        attemptsLabel.setText(
                "Attempts: 0 / "
                        + game.getMaxAttempts()
        );

        scoreLabel.setText(
                "Score: " + score
        );

        messageLabel.setText("Good luck!");

        guessField.setText("");
        guessField.setEnabled(true);

        guessButton.setEnabled(true);
        newRoundButton.setEnabled(false);

        guessField.requestFocus();
    }

    private void makeGuess() {

        String input = guessField.getText().trim();

        if (input.isEmpty()) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please enter a number.",
                    "Invalid Input",
                    JOptionPane.WARNING_MESSAGE
            );

            return;
        }

        int guess;

        try {

            guess = Integer.parseInt(input);

        } catch (NumberFormatException e) {

            JOptionPane.showMessageDialog(
                    this,
                    "Please enter a valid number.",
                    "Invalid Input",
                    JOptionPane.WARNING_MESSAGE
            );

            guessField.selectAll();
            guessField.requestFocus();

            return;
        }

        if (guess < 1 || guess > game.getRange()) {

            JOptionPane.showMessageDialog(
                    this,
                    "Enter a number between 1 and "
                            + game.getRange() + ".",
                    "Invalid Range",
                    JOptionPane.WARNING_MESSAGE
            );

            guessField.selectAll();
            guessField.requestFocus();

            return;
        }

        String result = game.checkGuess(guess);

        attemptsLabel.setText(
                "Attempts: "
                        + game.getAttempts()
                        + " / "
                        + game.getMaxAttempts()
        );

        if (result.equals("Correct!")) {

            score++;

            messageLabel.setText(
                    "Correct! 🎉 You guessed the number!"
            );

            scoreLabel.setText(
                    "Score: " + score
            );

            guessField.setEnabled(false);
            guessButton.setEnabled(false);
            newRoundButton.setEnabled(true);

        } else if (result.equals("Too High!")) {

            messageLabel.setText(
                    "Too High! Try a smaller number."
            );

        } else {

            messageLabel.setText(
                    "Too Low! Try a larger number."
            );
        }

        if (game.getAttempts() >= game.getMaxAttempts()
                && !result.equals("Correct!")) {

            messageLabel.setText(
                    "You Lost! Number was "
                            + game.getTargetNumber()
            );

            guessField.setEnabled(false);
            guessButton.setEnabled(false);
            newRoundButton.setEnabled(true);
        }

        guessField.selectAll();
        guessField.requestFocus();
    }
}