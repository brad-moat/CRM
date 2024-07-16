document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Show the loading spinner
    document.getElementById('loading-spinner').style.display = 'block';

    // Simulate a delay for the login process
    setTimeout(function() {
        // Redirect to the home page on successful login
        window.location.href = '//dashboard.html';
    }, 2000); // Adjust the delay as needed
});

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
            document.getElementById("main-content").style.marginLeft = "0";
            menuToggle.classList.remove("active"); // Remove active class to revert color
        } else {
            menu.style.left = "0px";
            document.getElementById("main-content").style.marginLeft = "250px";
            menuToggle.classList.add("active"); // Add active class to change color
        }
    };
});

