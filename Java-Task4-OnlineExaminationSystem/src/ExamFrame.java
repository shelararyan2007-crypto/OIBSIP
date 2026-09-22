import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

public class ExamFrame extends JFrame {

    private JLabel questionLabel;
    private JLabel questionNumberLabel;
    private JLabel timerLabel;

    private JRadioButton optionA;
    private JRadioButton optionB;
    private JRadioButton optionC;
    private JRadioButton optionD;

    private JButton previousButton;
    private JButton nextButton;
    private JButton submitButton;

    private ButtonGroup optionsGroup;

    private List<Question> questions;
    private int currentQuestion = 0;
    private String[] selectedAnswers;

    private Timer examTimer;
    private int remainingSeconds = 10 * 60;

    public ExamFrame() {

        setTitle("Online Examination System - Examination");
        setSize(760, 540);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setResizable(false);

        createQuestions();
        selectedAnswers = new String[questions.size()];

        createExamUI();
        displayQuestion();
        startTimer();
    }

    private void createQuestions() {

        questions = new ArrayList<>();

        questions.add(new Question(
                "Which language is mainly used to develop this examination system?",
                "Java",
                "Python",
                "HTML",
                "SQL",
                "A"
        ));

        questions.add(new Question(
                "Which keyword is used to create a class in Java?",
                "function",
                "class",
                "struct",
                "define",
                "B"
        ));

        questions.add(new Question(
                "Which component is used to create a button in Java Swing?",
                "JButton",
                "JTextField",
                "JLabel",
                "JPanel",
                "A"
        ));

        questions.add(new Question(
                "Which method is the starting point of a Java program?",
                "start()",
                "run()",
                "main()",
                "execute()",
                "C"
        ));

        questions.add(new Question(
                "Which collection allows duplicate elements in Java?",
                "Set",
                "Map",
                "List",
                "Tree",
                "C"
        ));
    }

    private void createExamUI() {

        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        mainPanel.setBackground(new Color(245, 247, 250));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(null);
        headerPanel.setBackground(new Color(25, 45, 75));
        headerPanel.setBounds(0, 0, 760, 75);
        mainPanel.add(headerPanel);

        JLabel titleLabel = new JLabel("ONLINE EXAMINATION");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 22));
        titleLabel.setForeground(Color.WHITE);
        titleLabel.setBounds(25, 20, 300, 35);
        headerPanel.add(titleLabel);

        // Logout button
        JButton logoutButton = new JButton("Logout");
        logoutButton.setBounds(430, 20, 90, 32);
        logoutButton.setFocusPainted(false);
        headerPanel.add(logoutButton);

        logoutButton.addActionListener(e -> logout());

        // Profile button
        JButton profileButton = new JButton("Profile");
        profileButton.setBounds(525, 20, 90, 32);
        profileButton.setFocusPainted(false);
        headerPanel.add(profileButton);

        profileButton.addActionListener(e -> {

            ProfileFrame profileFrame = new ProfileFrame();
            profileFrame.setVisible(true);

        });

        // Timer
        timerLabel = new JLabel("Time: 10:00");
        timerLabel.setFont(new Font("Arial", Font.BOLD, 15));
        timerLabel.setForeground(Color.WHITE);
        timerLabel.setBounds(625, 20, 120, 32);
        headerPanel.add(timerLabel);

        // Question number
        questionNumberLabel = new JLabel();
        questionNumberLabel.setFont(new Font("Arial", Font.BOLD, 16));
        questionNumberLabel.setForeground(new Color(25, 45, 75));
        questionNumberLabel.setBounds(40, 100, 200, 30);
        mainPanel.add(questionNumberLabel);

        // Question card
        JPanel questionPanel = new JPanel();
        questionPanel.setLayout(null);
        questionPanel.setBackground(Color.WHITE);
        questionPanel.setBounds(40, 140, 680, 90);
        mainPanel.add(questionPanel);

        questionLabel = new JLabel();
        questionLabel.setFont(new Font("Arial", Font.BOLD, 17));
        questionLabel.setForeground(new Color(40, 40, 40));
        questionLabel.setBounds(20, 15, 640, 60);
        questionPanel.add(questionLabel);

        // Options
        optionA = createOptionButton();
        optionB = createOptionButton();
        optionC = createOptionButton();
        optionD = createOptionButton();

        optionA.setBounds(55, 250, 650, 35);
        optionB.setBounds(55, 295, 650, 35);
        optionC.setBounds(55, 340, 650, 35);
        optionD.setBounds(55, 385, 650, 35);

        optionsGroup = new ButtonGroup();

        optionsGroup.add(optionA);
        optionsGroup.add(optionB);
        optionsGroup.add(optionC);
        optionsGroup.add(optionD);

        mainPanel.add(optionA);
        mainPanel.add(optionB);
        mainPanel.add(optionC);
        mainPanel.add(optionD);

        // Previous button
        previousButton = new JButton("← Previous");
        previousButton.setBounds(55, 450, 120, 35);
        previousButton.setFocusPainted(false);
        mainPanel.add(previousButton);

        // Next button
        nextButton = new JButton("Next →");
        nextButton.setBounds(185, 450, 120, 35);
        nextButton.setFocusPainted(false);
        mainPanel.add(nextButton);

        // Submit button
        submitButton = new JButton("Submit Exam");
        submitButton.setBounds(575, 450, 130, 35);
        submitButton.setFont(new Font("Arial", Font.BOLD, 13));
        submitButton.setFocusPainted(false);
        mainPanel.add(submitButton);

        previousButton.addActionListener(e -> showPreviousQuestion());

        nextButton.addActionListener(e -> showNextQuestion());

        submitButton.addActionListener(e -> submitExam());

        add(mainPanel);
    }

    private JRadioButton createOptionButton() {

        JRadioButton button = new JRadioButton();

        button.setFont(new Font("Arial", Font.PLAIN, 15));
        button.setBackground(new Color(245, 247, 250));
        button.setFocusPainted(false);

        return button;
    }

    private void displayQuestion() {

        Question question = questions.get(currentQuestion);

        questionNumberLabel.setText(
                "Question " + (currentQuestion + 1)
                        + " of " + questions.size()
        );

        questionLabel.setText(
                "<html>" + question.getQuestionText() + "</html>"
        );

        optionA.setText("A. " + question.getOptionA());
        optionB.setText("B. " + question.getOptionB());
        optionC.setText("C. " + question.getOptionC());
        optionD.setText("D. " + question.getOptionD());

        optionsGroup.clearSelection();

        if (selectedAnswers[currentQuestion] != null) {

            switch (selectedAnswers[currentQuestion]) {

                case "A":
                    optionA.setSelected(true);
                    break;

                case "B":
                    optionB.setSelected(true);
                    break;

                case "C":
                    optionC.setSelected(true);
                    break;

                case "D":
                    optionD.setSelected(true);
                    break;
            }
        }

        previousButton.setEnabled(currentQuestion > 0);

        nextButton.setEnabled(
                currentQuestion < questions.size() - 1
        );
    }

    private void saveCurrentAnswer() {

        if (optionA.isSelected()) {
            selectedAnswers[currentQuestion] = "A";

        } else if (optionB.isSelected()) {
            selectedAnswers[currentQuestion] = "B";

        } else if (optionC.isSelected()) {
            selectedAnswers[currentQuestion] = "C";

        } else if (optionD.isSelected()) {
            selectedAnswers[currentQuestion] = "D";
        }
    }

    private void showNextQuestion() {

        saveCurrentAnswer();

        if (currentQuestion < questions.size() - 1) {

            currentQuestion++;
            displayQuestion();
        }
    }

    private void showPreviousQuestion() {

        saveCurrentAnswer();

        if (currentQuestion > 0) {

            currentQuestion--;
            displayQuestion();
        }
    }

    private void startTimer() {

        examTimer = new Timer(1000, e -> {

            remainingSeconds--;

            int minutes = remainingSeconds / 60;
            int seconds = remainingSeconds % 60;

            timerLabel.setText(
                    String.format("Time: %02d:%02d", minutes, seconds)
            );

            if (remainingSeconds <= 0) {

                examTimer.stop();

                JOptionPane.showMessageDialog(
                        this,
                        "Time is up! Your exam will be submitted automatically.",
                        "Time Up",
                        JOptionPane.WARNING_MESSAGE
                );

                submitExam();
            }
        });

        examTimer.start();
    }

    private void logout() {

        int result = JOptionPane.showConfirmDialog(
                this,
                "Are you sure you want to logout?\n"
                        + "Your current exam progress will be lost.",
                "Confirm Logout",
                JOptionPane.YES_NO_OPTION
        );

        if (result == JOptionPane.YES_OPTION) {

            if (examTimer != null) {
                examTimer.stop();
            }

            dispose();

            LoginFrame loginFrame = new LoginFrame();
            loginFrame.setVisible(true);
        }
    }

    private void submitExam() {

        saveCurrentAnswer();

        int result = JOptionPane.showConfirmDialog(
                this,
                "Are you sure you want to submit the exam?",
                "Confirm Submission",
                JOptionPane.YES_NO_OPTION
        );

        if (result == JOptionPane.YES_OPTION) {

            if (examTimer != null) {
                examTimer.stop();
            }

            int correctAnswers = 0;

            for (int i = 0; i < questions.size(); i++) {

                if (selectedAnswers[i] != null
                        && selectedAnswers[i].equals(
                        questions.get(i).getCorrectAnswer())) {

                    correctAnswers++;
                }
            }

            dispose();

            ResultFrame resultFrame =
                    new ResultFrame(
                            questions.size(),
                            correctAnswers
                    );

            resultFrame.setVisible(true);
        }
    }

    public static void main(String[] args) {

        SwingUtilities.invokeLater(() -> {

            ExamFrame frame = new ExamFrame();
            frame.setVisible(true);

        });
    }
}