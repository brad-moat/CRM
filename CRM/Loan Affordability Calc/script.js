let repaymentChart;

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function toggleLivingExpenses() {
    const useAverage = document.getElementById('useAverageLivingCosts').value;
    const livingExpensesInput = document.getElementById('livingExpenses');
    livingExpensesInput.style.display = useAverage === 'yes' ? 'none' : 'block';
}

function calculateLoanAffordability() {
    // Get income values
    const baseSalary = parseFloat(document.getElementById('baseSalary').value) || 0;
    const additionalIncome = parseFloat(document.getElementById('additionalIncome').value) || 0;

    // Get expense values
    const homeLoanRepayment = parseFloat(document.getElementById('homeLoanRepayment').value) || 0;
    const studentLoanRepayment = parseFloat(document.getElementById('studentLoanRepayment').value) || 0;
    const personalLoanRepayment = parseFloat(document.getElementById('personalLoanRepayment').value) || 0;
    const creditCardRepayment = parseFloat(document.getElementById('creditCardRepayment').value) || 0;
    const bnplRepayment = parseFloat(document.getElementById('bnplRepayment').value) || 0;
    const overdraftRepayment = parseFloat(document.getElementById('overdraftRepayment').value) || 0;
    const livingExpenses = parseFloat(document.getElementById('livingExpenses').value) || 0;

    // Calculate household size and living expenses
    const dependents = parseInt(document.getElementById('dependents').value);
    const buyerType = document.getElementById('buyerType').value;
    const householdSize = buyerType === 'single' ? 1 : 2 + dependents;
    const averageLivingExpensesPerPerson = 2000;
    const totalLivingExpenses = document.getElementById('useAverageLivingCosts').value === 'yes' ? householdSize * averageLivingExpensesPerPerson : livingExpenses;

    // Calculate total income and expenses
    const totalIncome = baseSalary + additionalIncome;
    const totalExpenses = homeLoanRepayment + studentLoanRepayment + personalLoanRepayment + creditCardRepayment + bnplRepayment + overdraftRepayment + totalLivingExpenses;

    // Define constants for calculations
    const debtToIncomeRatio = 0.3;
    const interestRate = 0.05;
    const loanTerm = 30;

    // Calculate monthly values
    const monthlyIncome = totalIncome / 12;
    const monthlyBorrowingCapacity = (monthlyIncome * debtToIncomeRatio) - totalExpenses;

    // Calculate borrowing capacity
    const monthlyInterestRate = interestRate / 12;
    const numberOfPayments = loanTerm * 12;
    const annuityFactor = (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
    const borrowingCapacity = (monthlyBorrowingCapacity / annuityFactor) * 12;

    // Display result
    document.getElementById('result').innerText = `Your borrowing capacity is $${borrowingCapacity.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`;

    // Hide loading spinner
    setTimeout(hideLoadingSpinner, 1000);
}

async function downloadPDF() {
    showLoadingSpinner();

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Loan Affordability Calculator", 105, 20, { align: "center" });

    const resultElement = document.getElementById('result');
    pdf.setFontSize(14);
    pdf.text(resultElement.innerText, 105, 30, { align: "center" });

    pdf.save('Loan_Affordability_Calculator.pdf');

    hideLoadingSpinner();
}
