const phrases = [ 
    "[🇻🇦] Fuck System.",
    "[🇻🇦] Khanvulv on top.",
    "[🇻🇦] anti gov",
    "[🇻🇦] goodnight gov.",
    "[🇻🇦] i fuck your System",
    "[🇻🇦] i hate the system" 
];

setInterval(() => { 
    const greeting = document.querySelector('.stp-animated-banner h2');
    if (greeting&&features.customBanner) greeting.textContent = phrases[Math.floor(Math.random() * phrases.length)];
}, 3000);
