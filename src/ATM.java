import java.util.Scanner;

public class ATM {

    private Bank bank;
    private Scanner scanner;
    private Account currentAccount;

    public ATM(Bank bank) {
        this.bank = bank;
        this.scanner = new Scanner(System.in);
        this.currentAccount = null;
    }

    // Start ATM
    public void start() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("              WELCOME TO ATM");
        System.out.println("==============================================");

        if (login()) {
            showMenu();
        } else {
            System.out.println();
            System.out.println("Too many incorrect attempts.");
            System.out.println("Your account has been locked.");
        }
    }

    // Login with maximum 3 attempts
    private boolean login() {

        int attempts = 0;
        final int MAX_ATTEMPTS = 3;

        while (attempts < MAX_ATTEMPTS) {

            System.out.print("\nEnter User ID: ");
            String userId = scanner.nextLine();

            System.out.print("Enter PIN: ");
            int pin;

            try {
                pin = Integer.parseInt(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("PIN must contain numbers only.");
                attempts++;
                System.out.println("Attempts remaining: "
                        + (MAX_ATTEMPTS - attempts));
                continue;
            }

            Account account = bank.findAccountByUserId(userId);

            if (account != null && account.getPin() == pin) {

                currentAccount = account;

                System.out.println();
                System.out.println("Login successful!");
                System.out.println(
        "Welcome, " + currentAccount.getAccountHolderName() + "!"
);
System.out.println(
        "Account Number: " + currentAccount.getAccountNumber()
);
                return true;
            }

            attempts++;

            System.out.println("Invalid User ID or PIN.");
            System.out.println("Attempts remaining: "
                    + (MAX_ATTEMPTS - attempts));
        }

        return false;
    }

    // Main ATM menu
    private void showMenu() {

    int choice;

    do {

        System.out.println();
System.out.println("╔══════════════════════════════════════════════╗");
System.out.println("║                ATM MAIN MENU                 ║");
System.out.println("╠══════════════════════════════════════════════╣");
System.out.println("║  1. Transaction History                      ║");
System.out.println("║  2. Withdraw Money                           ║");
System.out.println("║  3. Deposit Money                            ║");
System.out.println("║  4. Transfer Money                           ║");
System.out.println("║  5. Check Balance                            ║");
System.out.println("║  6. Quit                                     ║");
System.out.println("╚══════════════════════════════════════════════╝");

System.out.print("Enter your choice: ");

        try {
            choice = Integer.parseInt(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid number.");
            choice = 0;
            continue;
        }

        switch (choice) {

            case 1:
                showTransactionHistory();
                break;

            case 2:
                withdraw();
                break;

            case 3:
                deposit();
                break;

            case 4:
                transfer();
                break;

            case 5:
                checkBalance();
                break;

            case 6:
                quit();
                break;

            default:
                System.out.println("Invalid choice. Please try again.");
        }

    } while (choice != 6);
}
    // Show transaction history
    private void showTransactionHistory() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("            TRANSACTION HISTORY");
        System.out.println("==============================================");

        if (currentAccount.getTransactions().isEmpty()) {
            System.out.println("No transactions available.");
            return;
        }

        System.out.printf(
                "%-12s %-12s %-30s %s%n",
                "Type",
                "Amount",
                "Description",
                "Date & Time"
        );

        System.out.println(
                "--------------------------------------------------------------------------"
        );

        for (Transaction transaction : currentAccount.getTransactions()) {
            System.out.println(transaction);
        }
    }

    // Withdraw money
    private void withdraw() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("                  WITHDRAW");
        System.out.println("==============================================");

        System.out.print("Enter amount to withdraw: ");

        double amount;

        try {
            amount = Double.parseDouble(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
            return;
        }

        if (amount <= 0) {
            System.out.println("Amount must be greater than zero.");
            return;
        }

        if (currentAccount.withdraw(amount)) {

            Transaction transaction = new Transaction(
                    "WITHDRAW",
                    amount,
                    "Cash withdrawal"
            );

            currentAccount.addTransaction(transaction);

            System.out.println();
            System.out.println("Withdrawal successful!");
            System.out.printf("Amount withdrawn : Rs. %.2f%n", amount);
            System.out.printf("Remaining balance: Rs. %.2f%n",
                    currentAccount.getBalance());

        } else {

            System.out.println();
            System.out.println("Insufficient funds.");
            System.out.printf("Available balance: Rs. %.2f%n",
                    currentAccount.getBalance());
        }
    }

    // Deposit money
    private void deposit() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("                   DEPOSIT");
        System.out.println("==============================================");

        System.out.print("Enter amount to deposit: ");

        double amount;

        try {
            amount = Double.parseDouble(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
            return;
        }

        if (amount <= 0) {
            System.out.println("Amount must be greater than zero.");
            return;
        }

        currentAccount.deposit(amount);

        Transaction transaction = new Transaction(
                "DEPOSIT",
                amount,
                "Cash deposit"
        );

        currentAccount.addTransaction(transaction);

        System.out.println();
        System.out.println("Deposit successful!");
        System.out.printf("Amount deposited : Rs. %.2f%n", amount);
        System.out.printf("Current balance   : Rs. %.2f%n",
                currentAccount.getBalance());
    }

    // Transfer money
    private void transfer() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("                  TRANSFER");
        System.out.println("==============================================");

        System.out.print("Enter recipient account number: ");
        String recipientNumber = scanner.nextLine();

        Account recipient =
                bank.findAccountByAccountNumber(recipientNumber);

        if (recipient == null) {
            System.out.println("Recipient account not found.");
            return;
        }

        if (recipient == currentAccount) {
            System.out.println("You cannot transfer money to your own account.");
            return;
        }

        System.out.print("Enter amount to transfer: ");

        double amount;

        try {
            amount = Double.parseDouble(scanner.nextLine());
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid amount.");
            return;
        }

        if (amount <= 0) {
            System.out.println("Amount must be greater than zero.");
            return;
        }

        if (!currentAccount.withdraw(amount)) {
            System.out.println("Insufficient funds.");
            return;
        }

        recipient.deposit(amount);

        Transaction senderTransaction = new Transaction(
                "TRANSFER",
                amount,
                "Transfer to " + recipient.getAccountNumber()
        );

        Transaction receiverTransaction = new Transaction(
                "TRANSFER",
                amount,
                "Received from " + currentAccount.getAccountNumber()
        );

        currentAccount.addTransaction(senderTransaction);
        recipient.addTransaction(receiverTransaction);

        System.out.println();
        System.out.println("Transfer successful!");
        System.out.printf("Amount transferred: Rs. %.2f%n", amount);
        System.out.println("To account: " + recipient.getAccountNumber());
        System.out.printf("Remaining balance: Rs. %.2f%n",
                currentAccount.getBalance());
    }

    // Check balance
    private void checkBalance() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("                 BALANCE");
        System.out.println("==============================================");

        System.out.printf("Account Number : %s%n",
                currentAccount.getAccountNumber());

        System.out.printf("Current Balance: Rs. %.2f%n",
                currentAccount.getBalance());
    }

    // Quit ATM
    private void quit() {

        System.out.println();
        System.out.println("==============================================");
        System.out.println("Thank you for using our ATM.");
        System.out.println("Please take your card.");
        System.out.println("Have a nice day!");
        System.out.println("==============================================");
    }
}