class InsufficientFundsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InsufficientFundsError"
    }

}

class InvalidTransactionError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidTransactionError"
    }

}

class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthorizationError"
    }

}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError"
    }

}
//step 1

class BankAccount {
    #balance = 0;
    #transactions = [];

    constructor(accountNumber, type) {
        if (new.target === BankAccount) {
            throw new ValidationError("This class is an abastract class");
        }
        if (typeof accountNumber !== "string" && accountNumber.length < 10) {
            throw new ValidationError("Invalid account number");
        }
        if (typeof type !== "string" && (type !== "individual" || type !== "joint")) {
            throw new ValidationError("Type must be string, and have to be an individual or joint type");
        }
        Object.defineProperty(this, "accountNumber", accountNumberDescriptor);
        this.accountNumber = accountNumber;
        this.type = type;
    }

    deposit(amount) {
        throw new ValidationError("This is an Abstract method");
    }

    withdraw(amount) {
        throw new ValidationError("This is an Abstract method");

    }

    transferFunds(targetAccount, amount, actor) {
        throw new ValidationError("This is an Abstract method");
    }
    get balance() {
        return this.#balance;
    }

    set balance(amount) {
        const next = this.#balance + amount;
        if (next < 0) {
            throw new InsufficientFundsError("Not enough funds");
        }
        this.#balance = next;
    }

    get balance() {
        return this.#balance;
    }



    getTransactionSummary(limit = 10) {
        if (this.#transactions.length < limit) {
            this.getAllTransactions();
        }
        return this.#transactions.slice(-limit);
    }

    getAllTransactions() {
        return [...this.#transactions];
    }

    addTransaction(transaction) {
        if (!(transaction instanceof Transaction)) {
            throw new ValidationError("")
        }
        this.#transactions.push(transaction);

    }
}

class IndividualAccount extends BankAccount {

    constructor(accountNumber, type) {
        super(accountNumber, type);

    }
    deposit(amount) {
        if (amount <= 0) {
            throw new InsufficientFundsError("Please transfer at least 1 USD.");
        }
        const date = Date.now().toString();
        this.balance += amount;
        this.addTransaction(new Transaction(this.accountNumber, amount, 'deposit', date));
    }
    withdraw(amount) {
        if (amount <= 0) {
            throw new InsufficientFundsError("Please withdraw at least 1 USD.");
        }
        const date = Date.now().toString();
        this.balance -= amount;
        this.addTransaction(new Transaction(this.accountNumber, amount, 'withdraw', date));

    }


    transferFunds(targetAccount, amount) {

        if (!(targetAccount instanceof BankAccount)) {
            throw new AuthorizationError('Invalid account');
        }
        else {
            this.balance -= amount;
            targetAccount.balance += amount;
        }
    }
}



class jointAccount extends BankAccount {
    #owners = [];

    constructor(accountNumber, type, owners) {
        super(accountNumber, type);
        this.#owners = owners;

    }

    deposit(amount) {
        if (amount <= 0) {
            throw new InsufficientFundsError("Please transfer at least 1 USD.");
        }
        if (this.#owners) {
            const date = Date.now().toString();
            this.balance += amount;
            this.addTransaction(new Transaction(this.accountNumber, amount, 'deposit', date));

        }
    }

    withdraw(amount) {
        if (amount <= 0) {
            throw new InsufficientFundsError("Please withdraw at least 1 USD.");
        }
        if (this.#owners) {
            const date = Date.now().toString();
            this.balance -= amount;
            this.addTransaction(new Transaction(this.accountNumber, amount, 'withdraw', date));

        }
    }

    transferFunds(targetAccount, amount, actor) {
        if (!(targetAccount instanceof BankAccount)) {
            throw new AuthorizationError('Invalid account');
        }
        if (!this.#owners.includes(actor)) {
            for (actor of this.#owners) {
                this.balance -= amount;
                targetAccount.balance += amount;
            }
        }
    }
}

//step2

class custumer {
    #accounts = [];

    constructor(name, contactInfo) {
        Object.defineProperty(this, "name", nameDescriptor);
        Object.defineProperty(this, "contactInfo", contactDescriptor);

        this.name = name;
        this.contactInfo = contactInfo;
    }
    addAccounts(account) {
        if (!(account instanceof BankAccount)) {
            throw new AuthorizationError("Must be a BankAccount instance");
        }
        this.#accounts.push(account);
    }

    viewAccounts() {
        return [...this.#accounts];
    }
    viewTransactionHistory(accountNumber) {
        const acc = this.#accounts.find(a => a.accountNumber === accountNumber);
        if (!acc) throw new InvalidTransactionError("Account not found");
        return acc.getAllTransactions();
    }
}




//step 3

class Transaction {
    constructor(accountNumber, amount, transactionType, timestamp) {
        this.accountNumber = accountNumber;
        this.amount = amount;
        this.transactionType = transactionType;
        this.timestamp = timestamp;
    }
}


//step 4

const accountNumberDescriptor = {
    get() {
        return this._accountNumber
    },

    set(accountNumber) {
        if (accountNumber.length !== 10) {
            throw new ValidationError("Account number length must be exactly 10 characters long.")
        }
        this._accountNumber = accountNumber;
    }
}

const nameDescriptor = {
    get() {
        return this._name;
    },

    set(name) {
        if (name === '') {
            throw new ValidationError("Name field cant be an empty.");
        }
        this._name = name;
    }
}

const contactDescriptor = {
    get() {
        return this._contact;
    },

    set(contact) {
        if (contact === '') {
            throw new ValidationError("Contact field cant be an empty.");
        }
        this._contact = contact;
    }
}

const balanceDescriptor = {
    get() {
        return this._balance;
    },

    set(balance) {
        if (balance < 0) {
            throw new ValidationError("Balance must be a positive.")
        }
        this._balance = balance;
    }
}

const transactionAmountDescriptor = {
    get() {
        return this._transactionAmount;
    },

    set(transactionAmount) {
        if (transactionAmount < 0) {
            throw new ValidationError("Transaction amount must be a positive number")
        }
    }
}



try {
    // ստեղծում ենք individual account
    const acc1 = new IndividualAccount("1234567890", "individual");
    const acc2 = new IndividualAccount("0987654321", "individual");

    console.log("Initial balance acc1:", acc1.balance);
    console.log("Initial balance acc2:", acc2.balance);

    // deposit
    acc1.deposit(500);
    console.log("After deposit acc1:", acc1.balance);

    // withdraw
    acc1.withdraw(200);
    console.log("After withdraw acc1:", acc1.balance);

    // transfer
    acc1.transferFunds(acc2, 100);
    console.log("After transfer acc1:", acc1.balance);
    console.log("After transfer acc2:", acc2.balance);

    // customer
    const customer = new custumer("Grish", "grish@email.com");
    customer.addAccounts(acc1);
    customer.addAccounts(acc2);

    console.log("Customer accounts:", customer.viewAccounts());

    // transactions
    console.log(
        "Transaction history acc1:",
        customer.viewTransactionHistory("0987654321")
    );

} catch (e) {
    console.error(e.name, e.message);
}
