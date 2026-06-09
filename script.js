/* ═══════════════════════════════════════════════════════════════════
   PHISHING AWARENESS TRAINING — INTERACTIVE SCRIPTS
   Author: Kripa SB | CodeAlpha Cybersecurity Internship
   ═══════════════════════════════════════════════════════════════════ */

// --- Wait for DOM to be fully loaded ---
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollAnimations();
    initStatCounters();
    initRedFlagInteraction();
    initQuiz();
    initMobileMenu();
});


/* ═══════════════════════════════════════════════
   NAVBAR — Scroll effect & active links
   ═══════════════════════════════════════════════ */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');
    
    window.addEventListener('scroll', () => {
        // Add scrolled class for background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}


/* ═══════════════════════════════════════════════
   MOBILE MENU
   ═══════════════════════════════════════════════ */

function initMobileMenu() {
    const toggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!toggle) return;
    
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}


/* ═══════════════════════════════════════════════
   SCROLL ANIMATIONS — Reveal on scroll
   ═══════════════════════════════════════════════ */

function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation for elements that appear together
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    reveals.forEach(el => observer.observe(el));
}


/* ═══════════════════════════════════════════════
   STAT COUNTERS — Animate numbers on hero
   ═══════════════════════════════════════════════ */

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        // Format large numbers
        if (target >= 1000000000) {
            element.textContent = (current / 1000000000).toFixed(1) + 'B';
        } else if (target >= 1000000) {
            element.textContent = '$' + (current / 1000000).toFixed(1) + 'M';
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}


/* ═══════════════════════════════════════════════
   RED FLAG INTERACTION — Click to discover
   ═══════════════════════════════════════════════ */

function initRedFlagInteraction() {
    const redFlags = document.querySelectorAll('.red-flag');
    const flagCount = document.getElementById('flagCount');
    const totalFlags = document.getElementById('totalFlags');
    const counterFill = document.getElementById('counterFill');
    
    let foundCount = 0;
    const total = redFlags.length;
    
    if (totalFlags) totalFlags.textContent = total;
    
    redFlags.forEach(flag => {
        flag.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!flag.classList.contains('found')) {
                flag.classList.add('found');
                foundCount++;
                if (flagCount) flagCount.textContent = foundCount;
                if (counterFill) counterFill.style.width = `${(foundCount / total) * 100}%`;
            }
            
            // Show tooltip
            showTooltip(flag, flag.dataset.tooltip);
        });
    });
    
    // Close tooltip on click elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.classList.contains('red-flag')) {
            removeTooltip();
        }
    });
}

function showTooltip(element, text) {
    removeTooltip();
    
    const tooltip = document.createElement('div');
    tooltip.className = 'red-flag-tooltip';
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    let top = rect.bottom + 10;
    let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
    
    // Keep tooltip in viewport
    if (left < 10) left = 10;
    if (left + tooltipRect.width > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top + tooltipRect.height > window.innerHeight - 10) {
        top = rect.top - tooltipRect.height - 10;
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function removeTooltip() {
    const existing = document.querySelector('.red-flag-tooltip');
    if (existing) existing.remove();
}


/* ═══════════════════════════════════════════════
   QUIZ ENGINE
   ═══════════════════════════════════════════════ */

const quizQuestions = [
    {
        question: "You receive an email from 'support@amaz0n-security.com' asking you to verify your account. What should you do?",
        options: [
            "Click the link and enter your credentials",
            "Reply to the email asking for more details",
            "Ignore the email and go directly to amazon.com to check your account",
            "Forward it to your friends to warn them"
        ],
        correct: 2,
        explanation: "Always go directly to the official website by typing the URL yourself. The email domain 'amaz0n' (with a zero) is a spoofed domain — a classic phishing trick.",
        difficulty: "easy"
    },
    {
        question: "Which of the following is the STRONGEST indicator that an email is a phishing attempt?",
        options: [
            "The email has a company logo",
            "The sender's email domain doesn't match the company's official domain",
            "The email was sent on a weekend",
            "The email is written in English"
        ],
        correct: 1,
        explanation: "A mismatched sender domain is a strong red flag. Logos can be copied, and phishing emails can be sent any time. Always check the actual email address, not just the display name.",
        difficulty: "easy"
    },
    {
        question: "What is 'spear phishing'?",
        options: [
            "Phishing that uses fishing-related themes",
            "A mass email campaign sent to millions",
            "A targeted attack using personal information about the specific victim",
            "Phishing that only targets people who fish"
        ],
        correct: 2,
        explanation: "Spear phishing is a targeted form of phishing where attackers research their victim and craft personalized messages using specific details like their name, job title, or recent activities.",
        difficulty: "easy"
    },
    {
        question: "You receive a text message: 'Your bank account has been compromised. Call 1-800-XXX-XXXX immediately.' What type of attack could this be?",
        options: [
            "Smishing (SMS phishing)",
            "Whaling",
            "Clone phishing",
            "Pharming"
        ],
        correct: 0,
        explanation: "Smishing (SMS + phishing) uses text messages to trick victims. The fake urgency about a compromised bank account is designed to make you call a fraudulent number where attackers will try to extract your banking information.",
        difficulty: "medium"
    },
    {
        question: "Which social engineering tactic creates a false sense of time pressure to prevent rational thinking?",
        options: [
            "Authority",
            "Curiosity",
            "Urgency",
            "Trust"
        ],
        correct: 2,
        explanation: "Urgency is a key social engineering tactic. Messages like 'Act within 24 hours or your account will be deleted' pressure you into acting before you can think critically about whether the message is legitimate.",
        difficulty: "medium"
    },
    {
        question: "Your CEO emails you urgently asking you to buy gift cards and send the codes. The email looks legitimate. What should you do?",
        options: [
            "Buy the gift cards immediately — it's the CEO!",
            "Reply to the email asking which store",
            "Contact the CEO through a different channel (phone, in person) to verify",
            "Buy the gift cards but keep the receipts"
        ],
        correct: 2,
        explanation: "This is a classic Business Email Compromise (BEC) attack. Always verify unusual requests through a separate communication channel. Real executives don't typically ask employees to buy gift cards via email.",
        difficulty: "medium"
    },
    {
        question: "What is the PRIMARY purpose of Two-Factor Authentication (2FA) in preventing phishing?",
        options: [
            "It blocks all phishing emails",
            "It adds an extra layer so stolen passwords alone aren't enough",
            "It encrypts your emails",
            "It automatically detects fake websites"
        ],
        correct: 1,
        explanation: "2FA means that even if an attacker steals your password through phishing, they still can't access your account without the second factor (like a code from your phone). It doesn't prevent phishing, but it limits the damage.",
        difficulty: "medium"
    },
    {
        question: "A website looks exactly like your bank's login page, but the URL shows 'http://yourbank.secure-login.sketchy-domain.com'. Is this safe?",
        options: [
            "Yes, it contains the bank's name in the URL",
            "Yes, it says 'secure-login' which means it's secure",
            "No, the actual domain is 'sketchy-domain.com' — the bank name is just a subdomain trick",
            "It depends on whether it has a padlock icon"
        ],
        correct: 2,
        explanation: "The actual domain is determined by what comes right before the top-level domain (.com). In this URL, 'sketchy-domain.com' is the real domain — 'yourbank' is just a subdomain used to trick you. Always check the core domain name.",
        difficulty: "hard"
    },
    {
        question: "In 2019, a Lithuanian man scammed Google and Facebook out of $100 million. What technique did he primarily use?",
        options: [
            "Ransomware attack",
            "SQL injection",
            "Fake invoices impersonating a hardware vendor (BEC fraud)",
            "Password brute-forcing"
        ],
        correct: 2,
        explanation: "Evaldas Rimasauskas sent fake invoices to Google and Facebook, pretending to be Quanta Computer, a real hardware manufacturer they did business with. This Business Email Compromise (BEC) fraud shows that even the biggest tech companies can fall for phishing.",
        difficulty: "hard"
    },
    {
        question: "Which of the following is NOT a recommended best practice for preventing phishing attacks?",
        options: [
            "Using a password manager",
            "Enabling two-factor authentication",
            "Clicking links in emails to check if they're legitimate",
            "Verifying unexpected requests through a separate channel"
        ],
        correct: 2,
        explanation: "You should NEVER click links in suspicious emails to 'test' them — this could lead to malware installation or credential theft. Instead, navigate to websites directly by typing the URL, use a password manager, enable 2FA, and verify unusual requests through separate channels.",
        difficulty: "hard"
    }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let quizActive = false;

function initQuiz() {
    const startBtn = document.getElementById('startQuiz');
    const nextBtn = document.getElementById('nextQuestion');
    const retryBtn = document.getElementById('retryQuiz');
    const reviewBtn = document.getElementById('reviewAnswers');
    const backBtn = document.getElementById('backToResults');
    
    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (retryBtn) retryBtn.addEventListener('click', retryQuiz);
    if (reviewBtn) reviewBtn.addEventListener('click', showReview);
    if (backBtn) backBtn.addEventListener('click', backToResults);
}

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    quizActive = true;
    
    document.getElementById('quizStart').style.display = 'none';
    document.getElementById('quizQuestionArea').style.display = 'block';
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizReview').style.display = 'none';
    
    loadQuestion();
}

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    const questionEl = document.getElementById('quizQuestion');
    const optionsEl = document.getElementById('quizOptions');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestion');
    const progressFill = document.getElementById('quizProgressFill');
    const progressText = document.getElementById('quizProgressText');
    
    // Update progress
    const progress = ((currentQuestion) / quizQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    
    // Set question
    const difficultyEmoji = { easy: '🟢', medium: '🟡', hard: '🔴' };
    questionEl.innerHTML = `<span style="font-size: 0.8rem; color: var(--text-muted);">${difficultyEmoji[q.difficulty]} ${q.difficulty.toUpperCase()}</span><br><br>${q.question}`;
    
    // Set options
    optionsEl.innerHTML = '';
    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option;
        btn.addEventListener('click', () => selectAnswer(index));
        optionsEl.appendChild(btn);
    });
    
    // Reset feedback and next button
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.style.display = 'none';
    nextBtn.style.display = 'none';
}

function selectAnswer(selectedIndex) {
    if (!quizActive) return;
    
    const q = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const feedbackEl = document.getElementById('quizFeedback');
    const nextBtn = document.getElementById('nextQuestion');
    
    // Disable all options
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === q.correct) {
            opt.classList.add('correct');
        }
        if (i === selectedIndex && i !== q.correct) {
            opt.classList.add('incorrect');
        }
    });
    
    // Record answer
    const isCorrect = selectedIndex === q.correct;
    if (isCorrect) score++;
    userAnswers.push({
        question: q.question,
        selected: selectedIndex,
        correct: q.correct,
        isCorrect: isCorrect,
        explanation: q.explanation
    });
    
    // Show feedback
    if (isCorrect) {
        feedbackEl.className = 'quiz-feedback correct';
        feedbackEl.innerHTML = `<strong>✅ Correct!</strong> ${q.explanation}`;
    } else {
        feedbackEl.className = 'quiz-feedback incorrect';
        feedbackEl.innerHTML = `<strong>❌ Incorrect.</strong> ${q.explanation}`;
    }
    feedbackEl.style.display = 'block';
    
    // Show next button
    nextBtn.style.display = 'inline-flex';
    nextBtn.textContent = currentQuestion < quizQuestions.length - 1 ? 'Next Question →' : 'See Results →';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion >= quizQuestions.length) {
        showResults();
    } else {
        loadQuestion();
    }
}

function showResults() {
    document.getElementById('quizQuestionArea').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
    
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreTitle = document.getElementById('scoreTitle');
    const scoreMessage = document.getElementById('scoreMessage');
    const scoreFillCircle = document.getElementById('scoreFillCircle');
    const breakdown = document.getElementById('resultsBreakdown');
    
    // Animate score
    scoreNumber.textContent = score;
    
    // SVG circle animation
    const circumference = 2 * Math.PI * 54; // 339.292
    const offset = circumference - (score / quizQuestions.length) * circumference;
    
    // Need to add SVG gradient
    const svg = document.querySelector('.results-score-circle svg');
    if (!svg.querySelector('defs')) {
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', 'scoreGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('stop-color', '#3b82f6');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('stop-color', '#ec4899');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
    
    setTimeout(() => {
        scoreFillCircle.style.strokeDashoffset = offset;
    }, 100);
    
    // Score message
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 90) {
        scoreTitle.textContent = '🏆 Cybersecurity Expert!';
        scoreMessage.textContent = 'Outstanding! You have excellent awareness of phishing threats. Keep sharing this knowledge with others!';
    } else if (percentage >= 70) {
        scoreTitle.textContent = '🥈 Well Informed!';
        scoreMessage.textContent = 'Great job! You have solid knowledge of phishing attacks. Review the topics you missed to become an expert.';
    } else if (percentage >= 50) {
        scoreTitle.textContent = '📚 Getting There!';
        scoreMessage.textContent = 'You\'re building awareness, but there\'s room for improvement. Review the training material and try again!';
    } else {
        scoreTitle.textContent = '⚠️ Needs Improvement';
        scoreMessage.textContent = 'Phishing awareness is crucial for staying safe online. Please review all sections of this training and retake the quiz.';
    }
    
    // Breakdown
    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const incorrectCount = userAnswers.length - correctCount;
    breakdown.innerHTML = `
        <div style="text-align: center;">
            <span style="color: var(--accent-green); font-weight: 600;">✅ ${correctCount} Correct</span>
            <span style="margin: 0 16px; color: var(--text-muted);">|</span>
            <span style="color: var(--accent-red); font-weight: 600;">❌ ${incorrectCount} Incorrect</span>
        </div>
    `;
}

function retryQuiz() {
    startQuiz();
}

function showReview() {
    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizReview').style.display = 'block';
    
    const reviewList = document.getElementById('reviewList');
    reviewList.innerHTML = '';
    
    userAnswers.forEach((answer, index) => {
        const q = quizQuestions[index];
        const item = document.createElement('div');
        item.className = `review-item ${answer.isCorrect ? 'review-correct' : 'review-incorrect'}`;
        
        item.innerHTML = `
            <div class="review-question">${index + 1}. ${answer.question}</div>
            <div class="review-answer">
                ${answer.isCorrect 
                    ? `<span class="correct-answer">✅ ${q.options[answer.selected]}</span>` 
                    : `<span class="wrong-answer">Your answer: ${q.options[answer.selected]}</span><br><span class="correct-answer">✅ Correct: ${q.options[answer.correct]}</span>`
                }
            </div>
            <div class="review-explanation">💡 ${answer.explanation}</div>
        `;
        
        reviewList.appendChild(item);
    });
}

function backToResults() {
    document.getElementById('quizReview').style.display = 'none';
    document.getElementById('quizResults').style.display = 'block';
}


