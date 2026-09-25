import java.util.Random;

public class Game {

    private int targetNumber;
    private int maxAttempts;
    private int attempts;
    private int range;

    public Game(String difficulty) {

        setDifficulty(difficulty);
        startNewRound();
    }

    private void setDifficulty(String difficulty) {

        switch (difficulty) {

            case "Easy":
                range = 50;
                maxAttempts = 10;
                break;

            case "Medium":
                range = 100;
                maxAttempts = 7;
                break;

            case "Hard":
                range = 200;
                maxAttempts = 5;
                break;

            default:
                range = 100;
                maxAttempts = 7;
        }
    }

    public void startNewRound() {

        Random random = new Random();

        targetNumber = random.nextInt(range) + 1;
        attempts = 0;
    }

    public String checkGuess(int guess) {

        attempts++;

        if (guess == targetNumber) {

            return "Correct!";

        } else if (guess > targetNumber) {

            return "Too High!";

        } else {

            return "Too Low!";
        }
    }

    public boolean isGameOver() {

        return attempts >= maxAttempts
                || attempts > 0 && getLastResultCorrect();
    }

    private boolean getLastResultCorrect() {

        return false;
    }

    public int getTargetNumber() {
        return targetNumber;
    }

    public int getAttempts() {
        return attempts;
    }

    public int getMaxAttempts() {
        return maxAttempts;
    }

    public int getRange() {
        return range;
    }
}