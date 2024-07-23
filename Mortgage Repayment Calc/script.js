document.addEventListener('DOMContentLoaded', function() {
    var dropdownToggle = document.querySelector('.dropdown-toggle');
    var dropdown = document.querySelector('.dropdown');
    var menuToggle = document.getElementById("menu-toggle");
    var menu = document.getElementById("menu");

    dropdownToggle.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior
        dropdown.classList.toggle('active');
    });

    menuToggle.onclick = function() {
        if (menu.style.left === "0px") {
            menu.style.left = "-250px";
            menuToggle.classList.remove("active"); // Remove active class to revert color
        } else {
            menu.style.left = "0px";
            menuToggle.classList.add("active"); // Add active class to change color
        }
    };
});

let repaymentChart;

function showLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loadingSpinner').style.display = 'none';
}

function calculateMortgage() {
    const principal = parseFloat(document.getElementById('principal').value.replace(/,/g, ''));
    const annualInterestRate = parseFloat(document.getElementById('annualInterestRate').value) / 100;
    const loanTerm = parseFloat(document.getElementById('loanTerm').value);
    const repaymentFrequency = document.getElementById('repaymentFrequency').value;

    if (isNaN(principal) || isNaN(annualInterestRate) || isNaN(loanTerm)) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        hideLoadingSpinner(); // Hide spinner if input is invalid
        return;
    }

    let periodsPerYear, totalPeriods, interestRatePerPeriod;
    let xAxisLabel;
    if (repaymentFrequency === 'monthly') {
        periodsPerYear = 12;
        totalPeriods = loanTerm * 12;
        interestRatePerPeriod = annualInterestRate / 12;
        xAxisLabel = 'Month';
    } else if (repaymentFrequency === 'fortnightly') {
        periodsPerYear = 26;
        totalPeriods = loanTerm * 26;
        interestRatePerPeriod = annualInterestRate / 26;
        xAxisLabel = 'Fortnight';
    } else if (repaymentFrequency === 'weekly') {
        periodsPerYear = 52;
        totalPeriods = loanTerm * 52;
        interestRatePerPeriod = annualInterestRate / 52;
        xAxisLabel = 'Week';
    }

    const repayment = (principal * interestRatePerPeriod) / (1 - Math.pow(1 + interestRatePerPeriod, -totalPeriods));
    const totalRepayment = repayment * totalPeriods;
    const totalInterest = totalRepayment - principal;
    document.getElementById('result').innerText = `Your ${repaymentFrequency} payment is $${repayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`;
    document.getElementById('result').innerHTML += `<br>Total interest paid over the term is $${totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.`;

    const labels = [];
    const data = [];
    let remainingBalance = principal;

    for (let i = 0; i < totalPeriods; i++) {
        remainingBalance = remainingBalance * (1 + interestRatePerPeriod) - repayment;
        labels.push(`${xAxisLabel} ${i + 1}`);
        data.push(Math.max(0, remainingBalance)); // Ensure no negative balance
    }

    if (repaymentChart) {
        repaymentChart.destroy(); // Destroy the old chart before creating a new one
    }

    const ctx = document.getElementById('repaymentChart').getContext('2d');
    repaymentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Remaining Balance',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                fill: true,
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: `${xAxisLabel}`
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Remaining Balance ($)'
                    }
                }
            }
        }
    });

    setTimeout(hideLoadingSpinner, 1000); // Hide spinner after 1 second
}

async function downloadPDF() {
    showLoadingSpinner(); // Show spinner before downloading PDF

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    // Add title
    pdf.setFontSize(18);
    pdf.text("Mortgage Repayment Calculator", 105, 20, { align: "center" });

    // Add results
    const resultElement = document.getElementById('result');
    pdf.setFontSize(14);
    pdf.text(resultElement.innerText, 105, 30, { align: "center" });

    // Capture chart as image
    const chartCanvas = document.getElementById('repaymentChart');
    const chartImage = await html2canvas(chartCanvas).then(canvas => canvas.toDataURL('image/png'));

    // Add chart image to PDF
    pdf.addImage(chartImage, 'PNG', 15, 50, 180, 100);

    // Save the PDF
    pdf.save('Mortgage_Repayment_Calculator.pdf');

    hideLoadingSpinner(); // Hide spinner after PDF is downloaded
}

// Format loan amount input with commas and maintain cursor position
document.getElementById('principal').addEventListener('input', function (e) {
    const value = e.target.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    e.target.value = value;
    const cursorPosition = e.target.selectionStart;
    e.target.setSelectionRange(cursorPosition, cursorPosition);
});

