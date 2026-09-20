import java.util.ArrayList;
import java.util.List;

public class Account {

    private String accountNumber;
    private String userId;
    private String accountHolderName;
    private int pin;
    private double balance;
    private List<Transaction> transactions;

    public Account(String accountNumber, String userId,
                   String accountHolderName, int pin, double balance) {

        this.accountNumber = accountNumber;
        this.userId = userId;
        this.accountHolderName = accountHolderName;
        this.pin = pin;
        this.balance = balance;
        this.transactions = new ArrayList<>();
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getUserId() {
        return userId;
    }

    public String getAccountHolderName() {
        return accountHolderName;
    }

    public int getPin() {
        return pin;
    }

    public double getBalance() {
        return balance;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void deposit(double amount) {
        balance += amount;
    }

    public boolean withdraw(double amount) {

        if (amount > balance) {
            return false;
        }

        balance -= amount;
        return true;
    }

    public void addTransaction(Transaction transaction) {
        transactions.add(transaction);
    }
}