// Smooth Scroll to Sections
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Dynamic Welcome Message
window.onload = function() {
    const hours = new Date().getHours();
    const greetingMessage = hours < 12 ? "Good Morning!" : hours < 18 ? "Good Afternoon!" : "Good Evening!";
    document.querySelector('#home p').textContent = greetingMessage + " Empowering girls to lead with confidence through sports.";
};
