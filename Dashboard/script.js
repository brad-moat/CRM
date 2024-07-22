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

    // Expand/Collapse widget content with triangle indicator
    document.querySelectorAll('.triangle').forEach(triangle => {
        triangle.addEventListener('click', function() {
            var widgetContent = this.nextElementSibling;
            if (widgetContent) {
                if (widgetContent.style.display === 'none' || widgetContent.style.display === '') {
                    widgetContent.style.display = 'block';
                    this.innerHTML = '&#9660;'; // Downward triangle
                } else {
                    widgetContent.style.display = 'none';
                    this.innerHTML = '&#9650;'; // Upward triangle
                }
            }
        });
    });

    // Fetch and display mortgage news using a public CORS proxy
    fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://www.goodreturns.co.nz/rss/mortgages.xml'))
        .then(response => response.json())
        .then(data => {
            let parser = new DOMParser();
            let xml = parser.parseFromString(data.contents, "application/xml");
            let items = xml.querySelectorAll("item");
            let newsList = document.getElementById('news-list');
            items.forEach(item => {
                let newsItem = document.createElement('li');
                newsItem.className = 'news-item';
                let title = item.querySelector("title").textContent;
                let link = item.querySelector("link").textContent;
                newsItem.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
                newsList.appendChild(newsItem);
            });
        })
        .catch(error => console.error('Error fetching the RSS feed:', error));
});

