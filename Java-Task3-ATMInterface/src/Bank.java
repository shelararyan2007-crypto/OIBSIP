import java.util.ArrayList;
import java.util.List;

public class Bank {

    private List<Account> accounts;

    public Bank() {
        accounts = new ArrayList<>();

        // Sample accounts
        accounts.add(new Account(
        "1001", "user101", "Aaryan", 1234, 10000.00
));

accounts.add(new Account(
        "1002", "user102", "Rahul", 5678, 8000.00
));

accounts.add(new Account(
        "1003", "user103", "Sneha", 4321, 12000.00
));
    }

    // Find account using User ID
    public Account findAccountByUserId(String userId) {

        for (Account account : accounts) {
            if (account.getUserId().equals(userId)) {
                return account;
            }
        }

        return null;
    }

    // Find account using Account Number
    public Account findAccountByAccountNumber(String accountNumber) {

        for (Account account : accounts) {
            if (account.getAccountNumber().equals(accountNumber)) {
                return account;
            }
        }

        return null;
    }

    // Check whether PIN is correct
    public boolean validateLogin(String userId, int pin) {

        Account account = findAccountByUserId(userId);

        if (account != null && account.getPin() == pin) {
            return true;
        }

        return false;
    }
}