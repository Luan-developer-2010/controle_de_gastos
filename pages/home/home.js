function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    }).catch(() => {
        alert("Erro ao fazer logout");
    })
}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        findTransactions(user);
    }
})

function newTransaction() {
    window.location.href = "../transaction/transaction.html"
}

function findTransactions(user) {
    showLoading();
    transationService.findByUser(user)
        .then(transactions => {
            hideLoading();
            addTransactionsToScreen(transactions);
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert("Erro ao recuperar transações");
        })
}

function addTransactionsToScreen(transactions) {
    const orderedList = document.getElementById("transactions");

    transactions.forEach(transaction => {
        const li = createTransactionListItem(transaction);
        li.appendChild(createDeleteButton(transaction));

        li.appendChild(createPragraph(formatDate(transaction.date)));
        li.appendChild(createPragraph(formatMoney(transaction.money)));
        li.appendChild(createPragraph(transaction.type));
        if (transaction.description) {
            li.appendChild(createPragraph(transaction.description));
        }

        orderedList.appendChild(li); 
    });
}

function createTransactionListItem(transaction) {
    const li = document.createElement("li");
    li.classList.add(transaction.type);
    li.id = transaction.uid;
    li.addEventListener("click", () => {
        window.location.href = "../transaction/transaction.html?uid=" + transaction.uid;
    })
    return li;
}

function createDeleteButton(transaction) {
    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Remover";
    deleteButton.classList.add("outline", "danger");
    deleteButton.addEventListener("click", event => {
        event.stopPropagation();
        askRemoveTransaction(transaction);
    })
    return deleteButton;
}

function createPragraph(value) {
    const element = document.createElement("p")
    element.innerHTML = value;
    return element;
}

function askRemoveTransaction(transaction) {
    const shouldRemove = confirm("Deseja remover a transação?");
    if (shouldRemove) {
        removeTransaction(transaction);
    }
}

function removeTransaction(transaction) {
    showLoading();

    transationService.remove(transaction)
        .then(() => {
            hideLoading();
            document.getElementById(transaction.uid).remove();
        })
        .catch(error => {
            hideLoading();
            console.log(error);
            alert("Erro ao remover transação");
        })
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-us");
}

function formatMoney(money) {
    return `${money.currency} ${money.value.toFixed(2)}`
}