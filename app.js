/* SAT English Hub — browser demo. Replace local storage with a server API before public launch. */
const $ = (s, r=document) => r.querySelector(s)
  , $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = (v='') => String(v).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
}[c]));
const uid = (p='id') => `${p}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const sampleQuestions = [{
    id: 'q1',
    domain: 'Expression of Ideas',
    difficulty: 'Easy',
    skill: 'Transitions',
    passage: 'Many desert plants store water in their stems. ___, they can survive for long periods without rain.',
    prompt: 'Which choice completes the text with the most logical transition?',
    choices: ['However', 'As a result', 'Meanwhile', 'For example'],
    correct: 1,
    explanation: '“As a result” shows the cause-and-effect relationship between storing water and surviving without rain.'
}, {
    id: 'q2',
    domain: 'Standard English Conventions',
    difficulty: 'Medium',
    skill: 'Boundaries',
    passage: 'The telescope was designed by a young engineer ___ it later became the observatory’s most used instrument.',
    prompt: 'Which choice completes the text so that it conforms to Standard English?',
    choices: [', and', ',', '; and', 'and,'],
    correct: 0,
    explanation: 'Two independent clauses can be joined by a comma plus the coordinating conjunction “and.”'
}, {
    id: 'q3',
    domain: 'Craft and Structure',
    difficulty: 'Easy',
    skill: 'Words in Context',
    passage: 'The researcher’s explanation was deliberately concise, offering only the details essential to understanding the result.',
    prompt: 'As used in the text, “concise” most nearly means:',
    choices: ['uncertain', 'brief', 'technical', 'persuasive'],
    correct: 1,
    explanation: '“Concise” means brief but complete, which matches “only the details essential.”'
}, {
    id: 'q4',
    domain: 'Expression of Ideas',
    difficulty: 'Hard',
    skill: 'Rhetorical Synthesis',
    passage: 'Notes: The library opened in 1924. It was renovated in 2018. The renovation added a digital media lab.',
    prompt: 'Which choice most effectively emphasizes the library’s modernization?',
    choices: ['The library opened in 1924.', 'A 2018 renovation added a digital media lab to the library.', 'The library is nearly one hundred years old.', 'Many people visit the library.'],
    correct: 1,
    explanation: 'Choice B directly connects the renovation to the modern digital facility.'
}, {
    id: 'q5',
    domain: 'Information and Ideas',
    difficulty: 'Medium',
    skill: 'Command of Evidence',
    passage: 'A study found that seedlings exposed to six hours of light grew 18% taller than seedlings exposed to four hours.',
    prompt: 'Which conclusion is best supported by the text?',
    choices: ['All plants need six hours of light.', 'Light has no effect on growth.', 'In this study, longer light exposure was associated with taller seedlings.', 'Four hours of light kills seedlings.'],
    correct: 2,
    explanation: 'The wording stays within the evidence and does not overgeneralize beyond the study.'
}, {
    id: 'q6',
    domain: 'Expression of Ideas',
    difficulty: 'Medium',
    skill: 'Transitions',
    passage: 'The first trial produced inconsistent results. ___, the researchers revised the testing procedure before repeating it.',
    prompt: 'Which transition best completes the text?',
    choices: ['Similarly', 'Therefore', 'Nevertheless', 'For instance'],
    correct: 1,
    explanation: 'The revision happened as a consequence of the inconsistent results, so “Therefore” is correct.'
}];
const seed = {
    settings: {
        brand: 'SAT English Hub',
        heroTitle: 'Learn clearly. Practice smarter.',
        heroText: 'Course files, realistic two-module mocks, homework, recordings, weak-point practice and teacher support in one simple place.',
        announcement: 'Enrollment is open for the October SAT English course.'
    },
    users: [{
        id: 'u_student',
        role: 'student',
        name: 'Omar Hassan',
        phone: '01000000000',
        password: 'student123',
        grade: 'Grade 11',
        approved: true,
        courses: ['c1']
    }, {
        id: 'u_admin',
        role: 'admin',
        name: 'Mr. Adam',
        phone: '01011111111',
        password: 'admin123',
        approved: true
    }, {
        id: 'u_assistant',
        role: 'assistant',
        name: 'Sara Ali',
        phone: '01022222222',
        password: 'assistant123',
        approved: true,
        permissions: ['ask', 'add_hw', 'add_mocks', 'add_session_rec']
    }],
    applications: [{
        id: 'a1',
        name: 'Youssef Ahmed',
        phone: '01055555555',
        parent: '01133333333',
        grade: 'Grade 10',
        courseId: 'c2',
        transferPhone: '01099999999',
        transferDate: '2026-10-02',
        receipt: 'receipt-demo.jpg',
        password: 'youssef123',
        status: 'pending'
    }],
    courseRequests: [],
    courses: [{
        id: 'c1',
        title: 'SAT English — October',
        code: 'OCT 2026',
        description: 'Reading, Writing and Language for the Digital SAT.',
        students: ['u_student'],
        progress: 38
    }, {
        id: 'c2',
        title: 'SAT English — November',
        code: 'NOV 2026',
        description: 'A complete Digital SAT English preparation course.',
        students: [],
        progress: 0
    }, {
        id: 'c3',
        title: 'Grammar Intensive',
        code: 'GRAMMAR',
        description: 'A focused four-week Standard English Conventions course.',
        students: [],
        progress: 0
    }],
    pdfs: [{
        id: 'p1',
        courseId: 'c1',
        title: 'Grammar Rules — Complete Guide',
        pages: 22
    }, {
        id: 'p2',
        courseId: 'c1',
        title: 'Transitions Cheat Sheet',
        pages: 8
    }, {
        id: 'p3',
        courseId: 'c1',
        title: 'Reading Strategy',
        pages: 14
    }],
    exams: [{
        id: 'e1',
        courseId: 'c1',
        title: 'Digital SAT English Mock 01',
        minutes: 32,
        breakMinutes: 1,
        modules: [sampleQuestions.slice(0, 3), sampleQuestions.slice(3, 6)]
    }],
    qbank: sampleQuestions.slice(),
    homework: [{
        id: 'h1',
        courseId: 'c1',
        session: 'Session 01',
        title: 'Transitions Practice',
        due: '2026-10-06',
        questions: sampleQuestions.slice(0, 2)
    }, {
        id: 'h2',
        courseId: 'c1',
        session: 'Session 02',
        title: 'Grammar Boundaries',
        due: '2026-10-10',
        questions: sampleQuestions.slice(1, 4)
    }, {
        id: 'h3',
        courseId: 'c1',
        session: 'Session 03',
        title: 'Reading Skills',
        due: '2026-10-14',
        questions: sampleQuestions.slice(3, 6)
    }],
    sessions: [{
        id: 's1',
        courseId: 'c1',
        title: 'Command of Evidence',
        date: '2026-10-06',
        time: '19:00',
        zoom: 'https://zoom.us/',
        recording: '',
        ended: false
    }, {
        id: 's2',
        courseId: 'c1',
        title: 'Transitions & Flow',
        date: '2026-09-29',
        time: '19:00',
        zoom: 'https://zoom.us/',
        recording: '',
        ended: true
    }],
    results: [{
        id: 'r1',
        userId: 'u_student',
        type: 'mock',
        itemId: 'e0',
        title: 'Diagnostic Mock',
        score: 650,
        total: 800,
        date: '2026-09-28'
    }],
    mistakes: [{
        userId: 'u_student',
        questionId: 'q4',
        skill: 'Rhetorical Synthesis',
        prompt: sampleQuestions[3].prompt
    }, {
        userId: 'u_student',
        questionId: 'q1',
        skill: 'Transitions',
        prompt: sampleQuestions[0].prompt
    }],
    asks: [{
        id: 'ask1',
        userId: 'u_student',
        student: 'Omar Hassan',
        courseId: 'c1',
        context: 'Diagnostic Mock · Question 7',
        text: 'Why is “however” not correct here?',
        reply: '“However” signals contrast, but the second sentence is a result of the first one. Use “therefore” or “as a result.”',
        status: 'answered',
        date: '2026-09-29'
    }],
    analytics: {
        todayHours: 3.6,
        weekHours: 18.4,
        activeSessions: 27
    }
};
let db = loadDB()
  , currentUser = null
  , currentView = ''
  , selectedCourseId = sessionStorage.getItem('satHubCourse') || ''
  , qIndex = 0
  , qAnswers = {}
  , runtimeFiles = {}
  , qbankState = {
    mode: 'browse',
    domain: '',
    difficulty: ''
};
db.courseRequests ||= [];
db.analytics ||= {
    todayHours: 3.6,
    weekHours: 18.4,
    activeSessions: 27
};
seed.courses.forEach(c => {
    if (!db.courses.some(x => x.id === c.id))
        db.courses.push(structuredClone(c))
}
);
for (const collection of ['pdfs', 'exams', 'homework', 'sessions', 'qbank'])
    db[collection] = db[collection].map(x => ({
        ...x,
        courseIds: x.courseIds || [x.courseId || 'c1']
    }));
db.qbank = db.qbank.map(q => {
    const fresh = sampleQuestions.find(x => x.id === q.id);
    return {
        ...q,
        domain: q.domain || fresh?.domain || 'Information and Ideas',
        difficulty: q.difficulty || fresh?.difficulty || 'Medium'
    }
}
);
db.applications.forEach(a => a.courseId ||= 'c1');
db.asks.forEach(a => a.courseId ||= 'c1');
saveDB();
function loadDB() {
    try {
        const stored = JSON.parse(localStorage.getItem('satHubDB'));
        if (stored?.dataRevision === '2026-10-17-reset-1') {
            // Undo the reset once, restoring sample records alongside any newly added data.
            const restored = {
                ...stored,
                ...structuredClone(seed)
            };
            delete restored.dataRevision;
            if (restored.zoom?.length === 0)
                delete restored.zoom;
            for (const [key,value] of Object.entries(seed))
                if (Array.isArray(value)) {
                    const existing = Array.isArray(stored[key]) ? stored[key] : [];
                    restored[key] = [...existing, ...value.filter(item => !existing.some(x => x.id && x.id === item.id))];
                }
            if (stored.settings)
                restored.settings = {
                    ...stored.settings,
                    ...seed.settings
                };
            if (restored.settings.contacts?.length === 0)
                delete restored.settings.contacts;
            sessionStorage.removeItem('satHubCourse');
            return restored;
        }
        return stored || structuredClone(seed);
    } catch {
        return structuredClone(seed)
    }
}
function saveDB() {
    localStorage.setItem('satHubDB', JSON.stringify(db))
}
function resetDemo() {
    db = structuredClone(seed);
    saveDB();
    toast('Demo data reset');
    if (currentUser) {
        currentUser = db.users.find(u => u.id === currentUser.id);
        renderApp(currentView)
    }
}
function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window.__toast);
    window.__toast = setTimeout( () => t.classList.remove('show'), 2400)
}
function initials(name='User') {
    return name.split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase()
}
function formatDate(v) {
    if (!v)
        return '—';
    return new Intl.DateTimeFormat('en',{
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(`${v}T12:00:00`))
}
function courseName(id) {
    return db.courses.find(c => c.id === id)?.title || 'Course'
}
function roleHome(role) {
    return role === 'student' ? 'courses' : 'overview'
}
function icon(x) {
    return `<span class="nav-icon">${x}</span>`
}
const navByRole = {
    student: [['courses', '▦', 'My Courses']],
    admin: [['overview', '▦', 'Overview'], ['applications', '◎', 'Applications'], ['courses', '▣', 'Courses'], ['content', '＋', 'Content Studio'], ['students', '♙', 'Students'], ['assistants', '♧', 'Assistants'], ['inbox', '✦', 'Ask Inbox'], ['settings', '⚙', 'Site Settings']],
    assistant: [['overview', '▦', 'Overview'], ['applications', '◎', 'Applications'], ['content', '＋', 'Content Studio'], ['inbox', '✦', 'Ask Inbox']]
};
const courseNav = [['courses', '‹', 'My Courses'], ['pdfs', '▤', 'PDFs'], ['mocks', '◉', 'Mocks'], ['homework', '✓', 'Homework'], ['qbank', '?', 'Question Bank'], ['sessions', '▶', 'Sessions'], ['weak', '⌁', 'Weak Points'], ['asks', '✦', 'My Questions']];
function belongs(item, courseId=selectedCourseId) {
    return (item.courseIds || [item.courseId]).includes(courseId)
}
function activeCourse() {
    return db.courses.find(c => c.id === selectedCourseId)
}
function assignedTo(item) {
    const ids = item.courseIds || [item.courseId].filter(Boolean);
    return ids.length ? ids.map(courseName).join(', ') : 'Not assigned to a course'
}
function permissionLabel(p) {
    return ({
        ask: 'Answer asks',
        add_hw: 'Add homework',
        add_mocks: 'Add mocks',
        add_session_rec: 'Add session recordings'
    })[p] || p
}
function contentActionButtons() {
    const buttons = [];
    if (canAction('admin_only'))
        buttons.push(['pdf', 'Add PDF']);
    if (canAction('add_mocks'))
        buttons.push(['mock', 'Add Mock']);
    if (canAction('add_hw'))
        buttons.push(['homework', 'Add Homework']);
    if (canAction('add_session_rec'))
        buttons.push(['session', 'Add Session / Recording']);
    return `<div class="section-tabs">${buttons.map( ([v,l]) => `<button class="section-tab" data-add="${v}">${l}</button>`).join('')}${currentUser.role === 'admin' ? '<button class="section-tab active" data-import-qbank>Extract Question Bank PDF</button>' : ''}</div>`
}
function can(view) {
    if (currentUser.role !== 'assistant')
        return true;
    if (view === 'overview')
        return true;
    const p = currentUser.permissions || [];
    if (view === 'inbox')
        return p.includes('ask');
    if (view === 'content')
        return p.some(x => x.startsWith('add_'));
    return p.includes(view)
}
function canAction(action) {
    return currentUser.role === 'admin' || (currentUser.permissions || []).includes(action)
}
async function enterFocusMode(mode='focus') {
    document.body.classList.add('focus-mode', `${mode}-mode`);
    try {
        await document.documentElement.requestFullscreen?.()
    } catch {}
}
function exitFocusMode(leaveFullscreen=true) {
    document.body.classList.remove('focus-mode', 'homework-mode', 'qbank-mode', 'weak-mode');
    if (leaveFullscreen && document.fullscreenElement && !examState)
        document.exitFullscreen?.().catch( () => {}
        )
}
function startUsageTracking() {
    clearInterval(window.__usageTimer);
    if (currentUser?.role !== 'admin')
        return;
    window.__usageTimer = setInterval( () => {
        db.analytics.todayHours += 1 / 60;
        db.analytics.weekHours += 1 / 60;
        saveDB();
        if (currentView === 'overview')
            renderApp('overview')
    }
    , 60000)
}

function switchAuth(mode) {
    $$('[data-auth]').forEach(x => x.classList.toggle('active', x.dataset.auth === mode));
    $('#applyForm').classList.toggle('hidden', mode !== 'apply');
    $('#loginForm').classList.toggle('hidden', mode !== 'login');
    $('#pendingView').classList.add('hidden');
    $('#authCard').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    })
}
$$('[data-auth]').forEach(b => b.onclick = () => switchAuth(b.dataset.auth));
$$('[data-switch]').forEach(b => b.onclick = () => switchAuth(b.dataset.switch));
$('#openLogin').onclick = () => switchAuth('login');
$('#receipt').onchange = e => {
    const f = e.target.files[0];
    $('#receiptName').textContent = f ? f.name : 'No file chosen';
    if (f && f.size > 5 * 1024 * 1024) {
        e.target.value = '';
        $('#receiptName').textContent = 'File is larger than 5 MB';
        toast('Choose an image under 5 MB')
    }
}
;
$('#applyForm').onsubmit = e => {
    e.preventDefault();
    const f = e.target.receipt.files[0];
    if (!f)
        return;
    const d = Object.fromEntries(new FormData(e.target));
    if (db.users.some(u => u.phone === d.phone) || db.applications.some(a => a.phone === d.phone && a.status === 'pending')) {
        toast('This phone number already has an account or application');
        return
    }
    db.applications.unshift({
        id: uid('a'),
        ...d,
        receipt: f.name,
        receiptUrl: URL.createObjectURL(f),
        status: 'pending'
    });
    saveDB();
    e.target.reset();
    $('#applyForm').classList.add('hidden');
    $$('[data-auth]').forEach(x => x.classList.remove('active'));
    $('#pendingView').classList.remove('hidden')
}
;
$('#loginForm').onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    const u = db.users.find(x => x.phone === d.phone && x.password === d.password && x.approved);
    if (!u) {
        $('#loginError').textContent = 'Phone number or password is incorrect, or the account is not approved yet.';
        $('#loginError').classList.remove('hidden');
        return
    }
    login(u)
}
;
$$('[data-demo]').forEach(b => b.onclick = () => login(db.users.find(u => u.role === b.dataset.demo)));
$('#forgotBtn').onclick = () => toast('Please contact the admin to reset your password.');
function login(u) {
    currentUser = u;
    if (u.role === 'student') {
        selectedCourseId = '';
        sessionStorage.removeItem('satHubCourse')
    }
    sessionStorage.setItem('satHubUser', u.id);
    $('#publicShell').classList.add('hidden');
    $('#appShell').classList.remove('hidden');
    setupApp();
    startUsageTracking();
    navigate(roleHome(u.role))
}
function logout() {
    clearInterval(window.__usageTimer);
    exitFocusMode();
    currentUser = null;
    selectedCourseId = '';
    sessionStorage.removeItem('satHubUser');
    sessionStorage.removeItem('satHubCourse');
    $('#appShell').classList.add('hidden');
    $('#publicShell').classList.remove('hidden');
    $('.sidebar').classList.remove('open');
    switchAuth('login')
}
function setupApp() {
    const base = currentUser.role === 'student' && selectedCourseId ? courseNav : navByRole[currentUser.role]
      , items = base.filter( ([v]) => can(v))
      , askCount = currentUser.role === 'student' ? db.asks.filter(a => a.userId === currentUser.id && a.status !== 'answered').length : db.asks.filter(a => a.status !== 'answered').length;
    $('#sideNav').innerHTML = items.map( ([v,i,l]) => `<button class="nav-item" data-nav="${v}">${icon(i)}<span>${l}</span>${(v === 'inbox' || v === 'asks') && askCount ? `<b class="nav-badge">${askCount}</b>` : ''}</button>`).join('');
    $('#roleLabel').textContent = currentUser.role === 'student' && activeCourse() ? activeCourse().code : `${currentUser.role[0].toUpperCase() + currentUser.role.slice(1)} portal`;
    $('#sideUserName').textContent = currentUser.name;
    $('#sideUserMeta').textContent = currentUser.grade || currentUser.role;
    $('#userInitials').textContent = $('#mobileAvatar').textContent = initials(currentUser.name);
    $$('[data-nav]').forEach(b => b.onclick = () => {
        if (b.dataset.nav === 'courses' && currentUser.role === 'student') {
            selectedCourseId = '';
            sessionStorage.removeItem('satHubCourse');
            setupApp()
        }
        navigate(b.dataset.nav)
    }
    )
}
$('#logoutBtn').onclick = logout;
$('#menuBtn').onclick = () => $('.sidebar').classList.toggle('open');
function navigate(view) {
    if (!can(view))
        return toast('You do not have permission for this section');
    if (view !== 'weak' && view !== 'qbank')
        exitFocusMode(false);
    currentView = view;
    $$('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
    $('.sidebar').classList.remove('open');
    renderApp(view);
    if (view === 'weak')
        enterFocusMode('weak');
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
function head(kicker, title, sub, actions='') {
    return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${sub}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`
}
function renderApp(view) {
    const fn = currentUser.role === 'student' ? studentViews[view] : (adminViews[view] || assistantViews[view]);
    $('#appContent').innerHTML = fn ? fn() : '<div class="empty">Page not available.</div>';
    bindDynamic()
}

function renderQbank() {
    const domains = ['Information and Ideas', 'Craft and Structure', 'Expression of Ideas', 'Standard English Conventions']
      , bank = db.qbank.filter(q => belongs(q));
    if (qbankState.mode === 'browse')
        return head('COLLEGE BOARD ORGANIZATION', `${esc(activeCourse()?.title || 'Course')} · Question Bank`, 'Select a content domain, then choose Easy, Medium or Hard.') + `<div class="grid">${domains.map( (d, i) => {
            const count = bank.filter(q => q.domain === d).length;
            return `<article class="card domain-card span-6"><div class="domain-number">0${i + 1}</div><div><span class="pill">${count} questions</span><h2>${esc(d)}</h2><p>${esc(domainDescription(d))}</p><button class="btn btn-soft" data-qbank-domain="${esc(d)}">View Domain</button></div></article>`
        }
        ).join('')}</div>`;
    if (qbankState.mode === 'levels') {
        const domain = qbankState.domain;
        return head('QUESTION BANK', esc(domain), 'Choose a difficulty level before opening the set.', `<button class="btn btn-soft" data-qbank-back="browse">All domains</button>`) + `<div class="grid">${['Easy', 'Medium', 'Hard'].map( (level, i) => {
            const qs = bank.filter(q => q.domain === domain && q.difficulty === level);
            return `<article class="card level-card span-4"><span class="difficulty-dot d${i}"></span><h2>${level}</h2><p class="muted">${qs.length} available question${qs.length === 1 ? '' : 's'}</p><button class="btn ${qs.length ? 'btn-primary' : 'btn-soft'}" data-view-qset="${level}" ${qs.length ? '' : 'disabled'}>View Set</button></article>`
        }
        ).join('')}</div>`
    }
    const pool = bank.filter(q => q.domain === qbankState.domain && q.difficulty === qbankState.difficulty)
      , q = pool[qIndex % pool.length];
    return head('QUESTION SET', `${esc(qbankState.domain)} · ${esc(qbankState.difficulty)}`, 'Practice in the same focused workspace used for mocks and homework.', `<button class="btn btn-soft" data-qbank-back="levels">Back to levels</button>`) + `<div class="practice-app"><header class="practice-header"><div><strong>Question Bank: Reading and Writing</strong><button class="directions-btn">Directions⌄</button></div><div class="practice-center"><b>Practice</b><button>Hide</button></div><div class="practice-tools"><button data-tool>⚠<span>Report</span></button><button data-tool>◇<span>Highlights & Notes</span></button><button data-tool>↗<span>Exit</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage"><p>${esc(q.passage)}</p></section><section class="practice-question"><div class="question-label"><b>${qIndex + 1}</b><button data-mark-review>♡ Mark for Review</button><span>${esc(q.skill)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, i) => `<button class="choice ${qAnswers[q.id] !== undefined ? (i === q.correct ? 'correct' : i === qAnswers[q.id] ? 'wrong' : '') : ''}" data-qanswer="${i}" ${qAnswers[q.id] !== undefined ? 'disabled' : ''}><i>${String.fromCharCode(65 + i)}</i><span>${esc(c)}</span></button>`).join('')}</div>${qAnswers[q.id] !== undefined ? `<div class="explain"><strong>Explanation</strong><br>${esc(q.explanation)}</div>` : ''}</section></div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">Question ${qIndex + 1} of ${pool.length}</div><div><button class="nav-pill pale" data-ask-context="Question Bank · ${esc(q.skill)} · ${q.id}">Ask</button><button class="nav-pill" data-qbank-back="levels">Back</button><button class="nav-pill" data-next-q>${qIndex === pool.length - 1 ? 'Finish' : 'Next'}</button></div></footer></div>`
}
function domainDescription(d) {
    return {
        'Information and Ideas': 'Central ideas, details, inferences and command of evidence.',
        'Craft and Structure': 'Words in context, text structure and cross-text connections.',
        'Expression of Ideas': 'Rhetorical synthesis and transitions.',
        'Standard English Conventions': 'Boundaries, form, structure and sense.'
    }[d] || ''
}
function watermarkTiles() {
    return Array.from({
        length: 12
    }, () => `<span>${esc(currentUser?.name || 'Student')}</span>`).join('')
}

const studentViews = {
    courses: () => {
        const cs = db.courses.filter(c => (currentUser.courses || []).includes(c.id))
          , requests = db.courseRequests.filter(r => r.userId === currentUser.id);
        return head('YOUR LEARNING', 'My Courses', 'Choose a course to open its PDFs, mocks, homework, Question Bank and sessions.', `<button class="btn btn-primary" data-request-course>Request a Course</button>`) + (cs.length ? `<div class="grid">${cs.map(c => `<article class="card course-card span-4"><div class="course-top"><span class="course-code">${esc(c.code)}</span><h3>${esc(c.title)}</h3></div><div class="course-body"><div class="course-meta"><span>${db.pdfs.filter(x => belongs(x, c.id)).length} PDFs</span><span>${db.exams.filter(x => belongs(x, c.id)).length} mocks</span></div><div class="progress"><i style="width:${c.progress || 0}%"></i></div><p class="small muted">${c.progress || 0}% completed</p><button class="btn btn-primary" data-enter-course="${c.id}">View Course</button></div></article>`).join('')}${requests.map(r => `<article class="card span-4 request-card"><div class="card-head"><span class="pill amber">${esc(r.status)}</span><span class="small muted">Course request</span></div><h3>${esc(courseName(r.courseId))}</h3><p class="muted small">Submitted ${formatDate(r.date)} · waiting for admin approval</p></article>`).join('')}</div>` : '<div class="empty"><strong>No course assigned yet</strong>Your application may still be waiting for approval.</div>')
    }
    ,
    pdfs: () => head('COURSE FILES', `${esc(activeCourse()?.title || 'Course')} · PDFs`, 'Files assigned to this course only.') + `<div class="grid">${db.pdfs.filter(p => belongs(p)).map(p => `<article class="card span-4"><div class="card-head"><div class="file-icon">PDF</div><span class="pill">${p.pages || '—'} pages</span></div><h3>${esc(p.title)}</h3><button class="btn btn-primary btn-sm" data-open-pdf="${p.id}">Open PDF</button></article>`).join('')}</div>`,
    mocks: () => head('DIGITAL SAT FORMAT', `${esc(activeCourse()?.title || 'Course')} · Mocks`, 'Open a mock to view attempts and start or retake it.') + `<div class="grid">${db.exams.filter(x => belongs(x)).map(x => {
        const attempts = db.results.filter(r => r.userId === currentUser.id && r.type === 'mock' && r.itemId === x.id);
        return `<article class="card span-6"><div class="card-head"><span class="pill green">Available</span><span class="small muted">2 modules · ${x.minutes} min each</span></div><h2>${esc(x.title)}</h2><p class="muted">${attempts.length} attempt${attempts.length === 1 ? '' : 's'}</p>${attempts.length ? `<div class="attempt-strip">${attempts.map( (r, i) => `<span>Attempt ${i + 1}<b>${r.score}</b></span>`).join('')}</div>` : ''}<button class="btn btn-dark" data-view-mock="${x.id}">View Mock</button></article>`
    }
    ).join('')}</div>`,
    qbank: () => renderQbank(),
    homework: () => head('ASSIGNED BY SESSION', `${esc(activeCourse()?.title || 'Course')} · Homework`, 'Open an assignment to view scores or start it in full screen.') + `<div class="grid">${db.homework.filter(h => belongs(h)).map(h => {
        const attempts = db.results.filter(x => x.userId === currentUser.id && x.type === 'homework' && x.itemId === h.id);
        return `<article class="card span-4"><div class="card-head"><span class="pill">${esc(h.session)}</span><span class="pill ${attempts.length ? 'green' : 'amber'}">${attempts.length ? `${attempts.at(-1).score}%` : `Due ${formatDate(h.due)}`}</span></div><h3>${esc(h.title)}</h3><p class="muted small">${h.questions.length} questions · ${attempts.length} attempt${attempts.length === 1 ? '' : 's'}</p>${attempts.length ? `<div class="attempt-strip">${attempts.map( (r, i) => `<span>#${i + 1}<b>${r.score}%</b></span>`).join('')}</div>` : ''}<button class="btn btn-soft" data-view-homework="${h.id}">View Assignment</button></article>`
    }
    ).join('')}</div>`,
    sessions: () => head('LIVE & RECORDED', `${esc(activeCourse()?.title || 'Course')} · Sessions`, 'Sessions are arranged in order. Open one to see its Zoom link or recording.') + `<div class="session-stack">${db.sessions.filter(s => belongs(s)).sort( (a, b) => new Date(a.date) - new Date(b.date)).map( (s, i) => `<article class="card session-row"><div class="session-order">${String(i + 1).padStart(2, '0')}</div><div class="date-icon"><span>${new Date(s.date + 'T12:00:00').toLocaleString('en', {
        month: 'short'
    }).toUpperCase()}</span><b>${new Date(s.date + 'T12:00:00').getDate()}</b></div><div class="list-main"><h3>${esc(s.title)}</h3><p>${formatDate(s.date)} · ${s.time}</p></div><span class="pill ${s.ended ? '' : 'green'}">${s.ended ? 'Recorded' : 'Upcoming'}</span><button class="btn btn-soft" data-view-session="${s.id}">Show</button></article>`).join('')}</div>`,
    weak: () => {
        const mistakes = db.mistakes.filter(m => m.userId === currentUser.id);
        const counts = mistakes.reduce( (a, m) => (a[m.skill] = (a[m.skill] || 0) + 1,
        a), {});
        return `<div class="focus-page">${head('PERSONAL ANALYSIS', 'Weak Points', 'Review every missed skill in a full-screen workspace.', `<button class="btn btn-soft" data-exit-focus>Exit</button>`)}<div class="grid"><article class="card span-7"><div class="card-head"><h3>Skills to review</h3></div>${Object.keys(counts).length ? Object.entries(counts).map( ([s,n], i) => `<div class="weak-bar"><span>${esc(s)}</span><div class="progress"><i style="width:${55 + i * 8}%;background:${i ? 'var(--amber)' : 'var(--red)'}"></i></div><strong>${n}</strong></div>`).join('') : '<div class="empty">No weak points yet.</div>'}</article><article class="card span-5"><div class="card-head"><h3>Missed questions</h3></div><div class="list">${mistakes.map(m => `<div class="list-row"><div class="list-main"><h4>${esc(m.skill)}</h4><p>${esc(m.prompt)}</p></div><button class="btn btn-soft btn-sm" data-practice-skill="${esc(m.skill)}">Practice</button></div>`).join('')}</div></article></div></div>`
    }
    ,
    asks: () => head('TEACHER SUPPORT', 'My Questions', 'Open a question to see your message and the teacher reply.', `<button class="btn btn-primary" data-new-ask>Ask a question</button>`) + `<div class="grid"><article class="card span-8"><div class="list">${db.asks.filter(a => a.userId === currentUser.id && (!selectedCourseId || a.courseId === selectedCourseId)).map(a => `<div class="message"><div class="message-top"><div><strong>${esc(a.context)}</strong><div class="small muted">${esc(courseName(a.courseId))}</div></div><span class="pill ${a.status === 'answered' ? 'green' : 'amber'}">${a.status}</span></div><button class="btn btn-soft btn-sm" data-show-question="${a.id}">Show Question</button></div>`).join('')}</div></article></div>`
};

const adminViews = {
    overview: () => {
        const pending = db.applications.filter(a => a.status === 'pending').length
          , students = db.users.filter(u => u.role === 'student').length
          , a = db.analytics;
        return head(currentUser.role === 'assistant' ? 'ASSISTANT PANEL' : 'ADMIN PANEL', 'Dashboard', 'Daily usage, enrollment and course questions at a glance.', `<button class="btn btn-soft" data-reset-demo>Reset demo</button>`) + `<div class="grid"><article class="card stat-card span-3"><div class="stat-icon">◷</div><div class="stat-value">${a.todayHours.toFixed(1)}h</div><p>Site open today</p></article><article class="card stat-card span-3"><div class="stat-icon">▥</div><div class="stat-value">${a.weekHours.toFixed(1)}h</div><p>Site open this week</p></article><article class="card stat-card span-3"><div class="stat-icon">♙</div><div class="stat-value">${students}</div><p>Active students</p></article><article class="card stat-card span-3"><div class="stat-icon">◎</div><div class="stat-value">${pending}</div><p>Pending applications</p></article><article class="card span-7"><div class="card-head"><h2>Weekly activity</h2><span class="pill">${a.activeSessions} sessions</span></div><div class="usage-chart">${[42, 68, 54, 82, 71, 94, 62].map( (v, i) => `<div><i style="height:${v}%"></i><span>${['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i]}</span></div>`).join('')}</div></article><article class="card span-5"><div class="card-head"><h2>Asks by course</h2><button class="link-btn" data-go="inbox">Open inbox</button></div><div class="list">${db.courses.map(c => {
            const n = db.asks.filter(x => x.courseId === c.id && x.status !== 'answered').length;
            return `<button class="list-row" data-inbox-course="${c.id}"><div class="list-main"><h4>${esc(c.title)}</h4><p>${db.asks.filter(x => x.courseId === c.id).length} total questions</p></div><b class="count-badge">${n}</b></button>`
        }
        ).join('')}</div></article></div>`
    }
    ,
    applications: () => head('ENROLLMENT', 'Applications', 'Approve new students and additional course requests.') + `<div class="grid"><article class="card span-12"><div class="card-head"><h2>New students</h2><span class="pill">${db.applications.filter(a => a.status === 'pending').length} pending</span></div>${applicationsTable(db.applications)}</article><article class="card span-12"><div class="card-head"><h2>Course requests</h2><span class="pill">${db.courseRequests.filter(r => r.status === 'pending').length} pending</span></div>${courseRequestsTable()}</article></div>`,
    courses: () => head('LEARNING PROGRAMS', 'Courses', 'Create courses and choose content from the central library.', `<button class="btn btn-primary" data-add="course">Create course</button>`) + `<div class="grid">${db.courses.map(c => `<article class="card course-card span-4"><div class="course-top"><span class="course-code">${esc(c.code)}</span><h3>${esc(c.title)}</h3></div><div class="course-body"><p class="muted small">${esc(c.description)}</p><div class="course-meta"><span>${c.students.length} students</span><span>${db.pdfs.filter(x => belongs(x, c.id)).length} files</span></div><button class="btn btn-soft" data-edit-course="${c.id}">Edit course & content</button></div></article>`).join('')}</div>`,
    content: () => head('CENTRAL LIBRARY', 'Content Studio', 'Add content once, then use Edit Course to choose where it appears.') + `${contentActionButtons()}<div class="grid"><article class="card span-6"><div class="card-head"><h3>PDF Library</h3><span class="pill">${db.pdfs.length}</span></div><div class="list">${db.pdfs.map(p => `<div class="list-row"><div class="file-icon">PDF</div><div class="list-main"><h4>${esc(p.title)}</h4><p>${esc(assignedTo(p))}</p></div><button class="icon-btn" data-delete="pdf:${p.id}">×</button></div>`).join('')}</div></article><article class="card span-6"><div class="card-head"><h3>Mocks & homework</h3><span class="pill">${db.exams.length + db.homework.length}</span></div><div class="list">${db.exams.map(x => `<div class="list-row"><div class="file-icon">M</div><div class="list-main"><h4>${esc(x.title)}</h4><p>${esc(assignedTo(x))} · 2 modules</p></div></div>`).join('')}${db.homework.map(x => `<div class="list-row"><div class="file-icon">HW</div><div class="list-main"><h4>${esc(x.title)}</h4><p>${esc(assignedTo(x))} · ${x.questions.length} questions</p></div></div>`).join('')}</div></article><article class="card span-12"><div class="card-head"><h3>Sessions & recordings</h3><span class="pill">${db.sessions.length}</span></div><div class="list">${db.sessions.map(s => `<div class="list-row"><div class="date-icon"><span>${s.ended ? 'REC' : 'LIVE'}</span><b>▶</b></div><div class="list-main"><h4>${esc(s.title)}</h4><p>${esc(assignedTo(s))} · ${formatDate(s.date)} · ${s.ended ? 'Recording' : 'Zoom link'}</p></div></div>`).join('')}</div></article></div>`,
    students: () => head('STUDENT ACCESS', 'Students', 'View approved accounts and assigned courses.') + `<article class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Phone</th><th>Grade</th><th>Course</th><th>Status</th></tr></thead><tbody>${db.users.filter(u => u.role === 'student').map(u => `<tr><td><strong>${esc(u.name)}</strong></td><td>${esc(u.phone)}</td><td>${esc(u.grade || '—')}</td><td>${esc((u.courses || []).map(courseName).join(', ') || 'None')}</td><td><span class="pill green">Active</span></td></tr>`).join('')}</tbody></table></div></article>`,
    assistants: () => head('TEAM ACCESS', 'Assistants', 'Create accounts and assign granular permissions.', `<button class="btn btn-primary" data-add="assistant">Create assistant</button>`) + `<div class="grid">${db.users.filter(u => u.role === 'assistant').map(u => `<article class="card span-4"><div class="card-head"><div class="avatar">${initials(u.name)}</div><span class="pill green">Active</span></div><h3>${esc(u.name)}</h3><p class="muted small">${esc(u.phone)}</p><div>${(u.permissions || []).map(p => `<span class="pill" style="margin:2px">${esc(permissionLabel(p))}</span>`).join('')}</div></article>`).join('')}</div>`,
    inbox: () => head('STUDENT SUPPORT', 'Ask Inbox', 'Questions grouped by course with unread counters.') + `<div class="ask-layout"><aside class="card ask-courses">${db.courses.map(c => {
        const n = db.asks.filter(a => a.courseId === c.id && a.status !== 'answered').length;
        return `<button data-inbox-course="${c.id}" class="${window.inboxCourse === c.id ? 'active' : ''}"><span>${esc(c.title)}</span><b class="count-badge">${n}</b></button>`
    }
    ).join('')}</aside><article class="card"><div class="list">${db.asks.filter(a => !window.inboxCourse || a.courseId === window.inboxCourse).map(a => `<div class="message"><div class="message-top"><div><strong>${esc(a.student)}</strong><div class="small muted">${esc(courseName(a.courseId))} · ${esc(a.context)}</div></div><span class="pill ${a.status === 'answered' ? 'green' : 'amber'}">${a.status}</span></div><p>${esc(a.text)}</p>${a.reply ? `<div class="reply"><strong>Reply</strong><br>${esc(a.reply)}</div>` : `<button class="btn btn-primary btn-sm" data-reply="${a.id}">Reply</button>`}</div>`).join('')}</div></article></div>`,
    settings: () => head('PUBLIC PAGE', 'Site Settings', 'Change the information students see before applying.') + `<article class="card" style="max-width:760px"><form class="modal-form" id="settingsForm"><label>Platform name<input name="brand" value="${esc(db.settings.brand)}" /></label><label>Main heading<input name="heroTitle" value="${esc(db.settings.heroTitle)}" /></label><label>Introduction<textarea name="heroText">${esc(db.settings.heroText)}</textarea></label><label>Announcement<textarea name="announcement">${esc(db.settings.announcement)}</textarea></label><button class="btn btn-primary">Save information</button></form></article>`
};
const assistantViews = adminViews;
function applicationsTable(rows) {
    return rows.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Grade / Course</th><th>Payment</th><th>Date</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows.map(a => `<tr><td><strong>${esc(a.name)}</strong><br><span class="small muted">${esc(a.phone)}</span></td><td>${esc(a.grade)}<br><span class="small muted">${esc(courseName(a.courseId))}</span></td><td><div style="display:flex;align-items:center;gap:8px"><button class="receipt-thumb" data-receipt="${a.id}">VIEW</button><span>${esc(a.transferPhone)}</span></div></td><td>${formatDate(a.transferDate)}</td><td><span class="pill ${a.status === 'approved' ? 'green' : a.status === 'rejected' ? 'red' : 'amber'}">${a.status}</span></td><td>${a.status === 'pending' ? `<div class="row-actions"><button class="btn btn-success btn-sm" data-approve="${a.id}">Approve</button><button class="btn btn-danger btn-sm" data-reject="${a.id}">Reject</button></div>` : '—'}</td></tr>`).join('')}</tbody></table></div>` : '<div class="empty"><strong>No applications</strong>New student requests will appear here.</div>'
}
function courseRequestsTable() {
    return db.courseRequests.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Requested course</th><th>Payment</th><th>Status</th><th>Action</th></tr></thead><tbody>${db.courseRequests.map(r => {
        const u = db.users.find(x => x.id === r.userId);
        return `<tr><td><strong>${esc(u?.name || 'Student')}</strong><br><span class="small muted">${esc(u?.phone || '')}</span></td><td>${esc(courseName(r.courseId))}</td><td>${esc(r.transferPhone)}<br><span class="small muted">${formatDate(r.date)}</span></td><td><span class="pill ${r.status === 'approved' ? 'green' : 'amber'}">${r.status}</span></td><td>${r.status === 'pending' ? `<button class="btn btn-success btn-sm" data-approve-course="${r.id}">Approve</button>` : '—'}</td></tr>`
    }
    ).join('')}</tbody></table></div>` : '<div class="empty"><strong>No course requests</strong>Additional course requests will appear here.</div>'
}

function bindDynamic() {
    $$('[data-go]').forEach(b => b.onclick = () => navigate(b.dataset.go));
    $$('[data-reset-demo]').forEach(b => b.onclick = resetDemo);
    $$('[data-enter-course]').forEach(b => b.onclick = () => {
        selectedCourseId = b.dataset.enterCourse;
        sessionStorage.setItem('satHubCourse', selectedCourseId);
        qbankState = {
            mode: 'browse',
            domain: '',
            difficulty: ''
        };
        setupApp();
        navigate('pdfs')
    }
    );
    $$('[data-view-session]').forEach(b => b.onclick = () => sessionDetails(b.dataset.viewSession));
    $$('[data-show-question]').forEach(b => b.onclick = () => showQuestion(b.dataset.showQuestion));
    $$('[data-exit-focus]').forEach(b => b.onclick = () => {
        exitFocusMode();
        navigate('pdfs')
    }
    );
    $$('[data-inbox-course]').forEach(b => b.onclick = () => {
        window.inboxCourse = b.dataset.inboxCourse;
        renderApp('inbox')
    }
    );
    $$('[data-edit-course]').forEach(b => b.onclick = () => editCourseModal(b.dataset.editCourse));
    $$('[data-open-pdf]').forEach(b => b.onclick = () => openPdf(b.dataset.openPdf));
    $$('[data-start-exam]').forEach(b => b.onclick = () => confirmExam(b.dataset.startExam));
    $$('[data-view-mock]').forEach(b => b.onclick = () => mockDetails(b.dataset.viewMock));
    $$('[data-qanswer]').forEach(b => b.onclick = () => answerQ(+b.dataset.qanswer));
    $$('[data-next-q]').forEach(b => b.onclick = () => nextQbank());
    $$('[data-qbank-domain]').forEach(b => b.onclick = () => {
        qbankState = {
            mode: 'levels',
            domain: b.dataset.qbankDomain,
            difficulty: ''
        };
        renderApp('qbank')
    }
    );
    $$('[data-view-qset]').forEach(b => b.onclick = () => qsetDetails(b.dataset.viewQset));
    $$('[data-qbank-back]').forEach(b => b.onclick = () => {
        if (qbankState.mode === 'practice')
            exitFocusMode();
        qbankState.mode = b.dataset.qbankBack;
        qIndex = 0;
        renderApp('qbank')
    }
    );
    $$('[data-homework]').forEach(b => b.onclick = () => startHomework(b.dataset.homework));
    $$('[data-view-homework]').forEach(b => b.onclick = () => homeworkDetails(b.dataset.viewHomework));
    $$('[data-zoom]').forEach(b => b.onclick = () => openZoom(b.dataset.zoom));
    $$('[data-recording]').forEach(b => b.onclick = () => openRecording(b.dataset.recording));
    $$('[data-practice-skill]').forEach(b => b.onclick = () => {
        const q = db.qbank.find(x => x.skill === b.dataset.practiceSkill);
        if (q) {
            qbankState = {
                mode: 'practice',
                domain: q.domain,
                difficulty: q.difficulty
            };
            qIndex = 0
        }
        navigate('qbank')
    }
    );
    $$('[data-new-ask]').forEach(b => b.onclick = () => askModal('General question'));
    $$('[data-ask-context]').forEach(b => b.onclick = () => askModal(b.dataset.askContext));
    $$('[data-approve]').forEach(b => b.onclick = () => approveApplication(b.dataset.approve));
    $$('[data-reject]').forEach(b => b.onclick = () => {
        const a = db.applications.find(x => x.id === b.dataset.reject);
        a.status = 'rejected';
        saveDB();
        renderApp('applications')
    }
    );
    $$('[data-receipt]').forEach(b => b.onclick = () => openReceipt(b.dataset.receipt));
    $$('[data-approve-course]').forEach(b => b.onclick = () => approveCourseRequest(b.dataset.approveCourse));
    $$('[data-request-course]').forEach(b => b.onclick = requestCourseModal);
    $$('[data-add]').forEach(b => b.onclick = () => addModal(b.dataset.add));
    $$('[data-import-qbank]').forEach(b => b.onclick = importQbankModal);
    $$('[data-delete]').forEach(b => b.onclick = () => deleteItem(b.dataset.delete));
    $$('[data-reply]').forEach(b => b.onclick = () => replyModal(b.dataset.reply));
    $$('[data-add="assistant"]').forEach(b => b.onclick = () => addModal('assistant'));
    const sf = $('#settingsForm');
    if (sf)
        sf.onsubmit = e => {
            e.preventDefault();
            db.settings = {
                ...db.settings,
                ...Object.fromEntries(new FormData(e.target))
            };
            saveDB();
            syncPublic();
            toast('Site information updated')
        }
        ;
    bindPracticeTools();
}
function bindPracticeTools() {
    $$('[data-mark-review]').forEach(b => b.onclick = () => {
        b.classList.toggle('marked');
        b.textContent = b.classList.contains('marked') ? '♥ Marked for Review' : '♡ Mark for Review'
    }
    );
    $$('[data-tool]').forEach(b => b.onclick = () => toast(`${b.textContent.trim()} tool selected`))
}
function openModal(html) {
    $('#modalContent').innerHTML = html;
    $('#modal').classList.remove('hidden')
}
function closeModal() {
    $('#modal').classList.add('hidden');
    $('#modalContent').innerHTML = '';
    if (document.body.classList.contains('homework-mode'))
        exitFocusMode()
}
$$('[data-close-modal]').forEach(x => x.onclick = closeModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !examState)
        closeModal();
    if (examState && (e.key === 'PrintScreen' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's'))) {
        e.preventDefault();
        toast('Screen capture shortcuts are disabled during the exam.')
    }
}
);
function openPdf(id) {
    const p = db.pdfs.find(x => x.id === id);
    openModal(`<h2>${esc(p.title)}</h2><div class="empty" style="min-height:330px;display:grid;place-items:center"><div><div class="file-icon" style="margin:auto;width:58px;height:68px">PDF</div><p style="margin:13px 0 0">PDF viewer ready</p><span class="small">The admin can replace this demo with the real file.</span></div></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" data-ask-pdf>Ask about this PDF</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('[data-ask-pdf]').onclick = () => {
        closeModal();
        askModal(`PDF · ${p.title}`)
    }
}
function openReceipt(id) {
    const a = db.applications.find(x => x.id === id);
    openModal(`<h2>Payment receipt</h2><p class="muted">${esc(a.name)} · transferred from ${esc(a.transferPhone)}</p>${a.receiptUrl ? `<img src="${esc(a.receiptUrl)}" alt="Payment receipt" style="display:block;max-width:100%;max-height:60vh;margin:auto;border-radius:12px" />` : `<div class="empty"><strong>${esc(a.receipt)}</strong>The demo receipt preview is available in the same browser session it was uploaded.</div>`}`)
}
function sessionDetails(id) {
    const s = db.sessions.find(x => x.id === id);
    openModal(`<h2>${esc(s.title)}</h2><p class="muted">${formatDate(s.date)} · ${esc(s.time)}</p><div class="info-note"><strong>${s.ended ? 'Recorded session' : 'Upcoming live session'}</strong><p>${s.ended ? 'Watch the protected recording with your personal watermark and speed controls.' : 'The Zoom link is revealed only after sign-in.'}</p></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" id="openSession">${s.ended ? 'Show Recording' : 'Open Zoom'}</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#openSession').onclick = () => {
        closeModal();
        s.ended ? openRecording(id) : openZoom(id)
    }
}
function showQuestion(id) {
    const a = db.asks.find(x => x.id === id);
    openModal(`<h2>${esc(a.context)}</h2><p class="muted">${esc(courseName(a.courseId))} · ${formatDate(a.date)}</p><div class="message"><strong>Your question</strong><p>${esc(a.text)}</p></div>${a.reply ? `<div class="reply"><strong>Teacher reply</strong><br>${esc(a.reply)}</div>` : '<div class="info-note"><strong>Waiting for a reply</strong><p>The teaching team can see this question in the course inbox.</p></div>'}<div class="modal-actions"><button class="btn btn-primary" data-close-now>Close</button></div>`);
    $('[data-close-now]').onclick = closeModal
}
function mockDetails(id) {
    const e = db.exams.find(x => x.id === id)
      , attempts = db.results.filter(r => r.userId === currentUser.id && r.type === 'mock' && r.itemId === id);
    openModal(`<h2>${esc(e.title)}</h2><p class="muted">${esc(courseName(e.courseId))}</p><div class="detail-grid"><div><span>Modules</span><strong>2</strong></div><div><span>Time</span><strong>${e.minutes} min × 2</strong></div><div><span>Questions</span><strong>${e.modules.flat().length}</strong></div></div><h3>Attempts</h3>${attempts.length ? `<div class="attempt-list">${attempts.map( (r, i) => `<div><span>Attempt ${i + 1} · ${formatDate(r.date)}</span><strong>${r.score} / ${r.total}</strong></div>`).join('')}</div>` : '<div class="empty">No attempts yet.</div>'}<div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" id="startFromDetails">${attempts.length ? 'Retake Mock' : 'Start Mock'}</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#startFromDetails').onclick = () => {
        closeModal();
        confirmExam(id)
    }
}
function homeworkDetails(id) {
    const h = db.homework.find(x => x.id === id)
      , attempts = db.results.filter(r => r.userId === currentUser.id && r.type === 'homework' && r.itemId === id);
    openModal(`<h2>${esc(h.title)}</h2><p class="muted">${esc(h.session)} · Due ${formatDate(h.due)}</p><div class="detail-grid"><div><span>Questions</span><strong>${h.questions.length}</strong></div><div><span>Course</span><strong>${esc(courseName(h.courseId))}</strong></div><div><span>Attempts</span><strong>${attempts.length}</strong></div></div><h3>Attempt history</h3>${attempts.length ? `<div class="attempt-list">${attempts.map( (r, i) => `<div><span>Attempt ${i + 1} · ${formatDate(r.date)}</span><strong>${r.score}%</strong></div>`).join('')}</div>` : '<div class="empty">No attempts yet.</div>'}<div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" id="startHomeworkDetails">${attempts.length ? 'Retake Homework' : 'Start Homework'}</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#startHomeworkDetails').onclick = () => {
        closeModal();
        startHomework(id)
    }
}
function qsetDetails(level) {
    const pool = db.qbank.filter(q => belongs(q) && q.domain === qbankState.domain && q.difficulty === level);
    openModal(`<h2>${esc(qbankState.domain)}</h2><p class="muted">${esc(level)} Question Set</p><div class="detail-grid"><div><span>Difficulty</span><strong>${esc(level)}</strong></div><div><span>Questions</span><strong>${pool.length}</strong></div><div><span>Feedback</span><strong>Instant</strong></div></div><div class="info-note"><strong>Before you begin</strong><p>The set opens full screen. Answers turn green or red, followed by the explanation.</p></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" id="beginQset">Begin Full Screen</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#beginQset').onclick = () => {
        qbankState.mode = 'practice';
        qbankState.difficulty = level;
        qIndex = 0;
        closeModal();
        enterFocusMode('qbank');
        renderApp('qbank')
    }
}
function activeQpool() {
    return db.qbank.filter(q => belongs(q) && q.domain === qbankState.domain && q.difficulty === qbankState.difficulty)
}
function answerQ(i) {
    const pool = qbankState.mode === 'practice' ? activeQpool() : db.qbank
      , q = pool[qIndex % pool.length];
    qAnswers[q.id] = i;
    if (i !== q.correct && !db.mistakes.some(m => m.userId === currentUser.id && m.questionId === q.id))
        db.mistakes.push({
            userId: currentUser.id,
            questionId: q.id,
            skill: q.skill,
            prompt: q.prompt
        });
    saveDB();
    renderApp('qbank')
}
function nextQbank() {
    const pool = activeQpool();
    if (qIndex >= pool.length - 1) {
        toast('Question set completed');
        exitFocusMode();
        qbankState.mode = 'levels';
        qIndex = 0
    } else
        qIndex++;
    renderApp('qbank')
}
function requestCourseModal() {
    const available = db.courses.filter(c => !(currentUser.courses || []).includes(c.id) && !db.courseRequests.some(r => r.userId === currentUser.id && r.courseId === c.id && r.status === 'pending'));
    openModal(`<h2>Request a Course</h2>${available.length ? `<form class="modal-form" id="courseRequestForm"><label>Course<select name="courseId">${available.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label><label>Transferred from<input name="transferPhone" inputmode="tel" required placeholder="Wallet / account phone" /></label><label>Transfer date<input name="date" type="date" required /></label><label>Payment receipt<input name="receipt" type="file" accept="image/*" required /></label>${actions()}</form>` : '<div class="empty"><strong>No new courses available</strong>You already joined or requested every current course.</div>'}`);
    if (!available.length)
        return;
    $('[data-close-now]').onclick = closeModal;
    $('#courseRequestForm').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , file = fd.get('receipt');
        db.courseRequests.unshift({
            id: uid('cr'),
            userId: currentUser.id,
            courseId: fd.get('courseId'),
            transferPhone: fd.get('transferPhone'),
            date: fd.get('date'),
            receipt: file.name,
            receiptUrl: URL.createObjectURL(file),
            status: 'pending'
        });
        saveDB();
        closeModal();
        renderApp('courses');
        toast('Course request sent for approval')
    }
}
function approveCourseRequest(id) {
    const r = db.courseRequests.find(x => x.id === id)
      , u = db.users.find(x => x.id === r.userId)
      , c = db.courses.find(x => x.id === r.courseId);
    r.status = 'approved';
    u.courses = u.courses || [];
    if (!u.courses.includes(c.id))
        u.courses.push(c.id);
    if (!c.students.includes(u.id))
        c.students.push(u.id);
    saveDB();
    renderApp('applications');
    toast(`${u.name} added to ${c.title}`)
}
function askModal(context) {
    openModal(`<h2>Ask about this item</h2><p class="muted">${esc(context)}</p><form class="modal-form" id="askForm"><label>Your question<textarea name="text" required placeholder="Explain what you tried and where you got stuck..."></textarea></label><div class="modal-actions"><button class="btn btn-soft" type="button" data-close-now>Cancel</button><button class="btn btn-primary">Send question</button></div></form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#askForm').onsubmit = e => {
        e.preventDefault();
        db.asks.unshift({
            id: uid('ask'),
            userId: currentUser.id,
            student: currentUser.name,
            courseId: selectedCourseId || currentUser.courses?.[0] || 'c1',
            context,
            text: new FormData(e.target).get('text'),
            reply: '',
            status: 'waiting',
            date: new Date().toISOString().slice(0, 10)
        });
        saveDB();
        setupApp();
        closeModal();
        toast('Question sent to the teaching team');
        if (currentView === 'asks')
            renderApp('asks')
    }
}

function editCourseModal(id) {
    const c = db.courses.find(x => x.id === id)
      , groups = [['PDFs', db.pdfs], ['Mocks', db.exams], ['Homework', db.homework], ['Question Bank', db.qbank], ['Sessions & recordings', db.sessions]];
    openModal(`<h2>Edit ${esc(c.title)}</h2><p class="muted">Choose existing items from the central library. Nothing is uploaded from this screen.</p><form class="modal-form" id="editCourseForm"><label>Course title<input name="title" value="${esc(c.title)}" required /></label><label>Description<textarea name="description">${esc(c.description)}</textarea></label><div class="asset-checks">${groups.map( ([label,items]) => `<section class="asset-group"><h3>${label}</h3>${items.length ? items.map(item => `<label class="checkline"><input type="checkbox" name="asset" value="${item.id}" ${(item.courseIds || [item.courseId]).includes(c.id) ? 'checked' : ''} /> <span>${esc(item.title || `${item.domain} · ${item.skill}`)}</span></label>`).join('') : '<p class="small muted">No items in the library yet.</p>'}</section>`).join('')}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#editCourseForm').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , selected = new Set(fd.getAll('asset'));
        c.title = fd.get('title');
        c.description = fd.get('description');
        for (const items of [db.pdfs, db.exams, db.homework, db.qbank, db.sessions])
            for (const item of items) {
                const ids = new Set(item.courseIds || [item.courseId].filter(Boolean));
                selected.has(item.id) ? ids.add(c.id) : ids.delete(c.id);
                item.courseIds = [...ids]
            }
        saveDB();
        closeModal();
        renderApp('courses');
        toast('Course content updated')
    }
}
function approveApplication(id) {
    const a = db.applications.find(x => x.id === id);
    if (!a)
        return;
    a.status = 'approved';
    const course = db.courses.find(c => c.id === a.courseId) || db.courses[0];
    if (!db.users.some(u => u.phone === a.phone)) {
        const user = {
            id: uid('u'),
            role: 'student',
            name: a.name,
            phone: a.phone,
            parent: a.parent,
            password: a.password,
            grade: a.grade,
            approved: true,
            courses: [course.id]
        };
        db.users.push(user);
        course.students.push(user.id)
    }
    saveDB();
    toast(`${a.name} approved for ${course.title}`);
    renderApp('applications')
}
function deleteItem(spec) {
    const [type,id] = spec.split(':');
    if (type === 'pdf')
        db.pdfs = db.pdfs.filter(x => x.id !== id);
    saveDB();
    renderApp('content');
    toast('Item removed')
}
function addModal(type) {
    let body = '';
    if (type === 'course')
        body = `<h2>Create course</h2><form class="modal-form" id="addForm"><label>Course title<input name="title" required placeholder="SAT English — November" /></label><label>Code<input name="code" required placeholder="NOV 2026" /></label><label>Description<textarea name="description" required></textarea></label>${actions()}</form>`;
    if (type === 'pdf')
        body = `<h2>Add PDF to central library</h2><p class="muted">Assign it later from Edit Course.</p><form class="modal-form" id="addForm"><label>PDF title<input name="title" required /></label><label>PDF file<input name="file" type="file" accept="application/pdf" required /></label>${actions()}</form>`;
    if (type === 'mock')
        body = `<h2>Create SAT English Mock</h2><p class="muted">This is added to the library first, then assigned from Edit Course.</p><form class="modal-form" id="addForm"><label>Mock title<input name="title" required /></label><div class="field-grid"><label>Minutes per module<input name="minutes" type="number" min="1" value="32" /></label><label>Break minutes<input name="breakMinutes" type="number" min="1" value="10" /></label></div>${actions()}</form>`;
    if (type === 'homework')
        body = `<h2>Add homework to library</h2><form class="modal-form" id="addForm"><label>Session label<input name="session" required placeholder="Session 04" /></label><label>Homework title<input name="title" required /></label><label>Due date<input name="due" type="date" required /></label>${actions()}</form>`;
    if (type === 'session')
        body = `<h2>Add session or recording</h2><p class="muted">Assign it to one or more courses from Edit Course.</p><form class="modal-form" id="addForm"><label>Session title<input name="title" required /></label><div class="field-grid"><label>Date<input name="date" type="date" required /></label><label>Time<input name="time" type="time" required /></label></div><label>Zoom link<input name="zoom" type="url" placeholder="https://zoom.us/j/..." /></label><label>Recording file (optional)<input name="recordingFile" type="file" accept="video/*" /></label>${actions()}</form>`;
    if (type === 'assistant')
        body = `<h2>Create assistant account</h2><form class="modal-form" id="addForm"><label>Name<input name="name" required /></label><label>Phone number<input name="phone" required /></label><label>Temporary password<input name="password" minlength="6" required /></label><label>Permissions</label><div class="perm-grid"><label class="perm"><input type="checkbox" name="permissions" value="ask" /> Answer asks</label><label class="perm"><input type="checkbox" name="permissions" value="add_hw" /> Add homework</label><label class="perm"><input type="checkbox" name="permissions" value="add_mocks" /> Add mocks</label><label class="perm"><input type="checkbox" name="permissions" value="add_session_rec" /> Add session recordings</label></div>${actions()}</form>`;
    openModal(body);
    $('[data-close-now]').onclick = closeModal;
    $('#addForm').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , d = Object.fromEntries(fd);
        if (type === 'course')
            db.courses.push({
                id: uid('c'),
                ...d,
                students: [],
                progress: 0
            });
        if (type === 'pdf')
            db.pdfs.push({
                id: uid('p'),
                courseIds: [],
                title: d.title,
                pages: '—',
                fileName: fd.get('file')?.name
            });
        if (type === 'mock')
            db.exams.push({
                id: uid('e'),
                courseIds: [],
                title: d.title,
                minutes: +d.minutes,
                breakMinutes: +d.breakMinutes,
                modules: [db.qbank.slice(0, 3), db.qbank.slice(3, 6)]
            });
        if (type === 'homework')
            db.homework.push({
                id: uid('h'),
                courseIds: [],
                title: d.title,
                session: d.session,
                due: d.due,
                questions: db.qbank.slice(0, 3)
            });
        if (type === 'session') {
            const f = fd.get('recordingFile');
            let recording = '';
            if (f && f.size) {
                recording = URL.createObjectURL(f);
                runtimeFiles[recording] = true
            }
            db.sessions.push({
                id: uid('s'),
                courseIds: [],
                title: d.title,
                date: d.date,
                time: d.time,
                zoom: d.zoom,
                recording,
                ended: !!recording
            })
        }
        if (type === 'assistant')
            db.users.push({
                id: uid('u'),
                role: 'assistant',
                name: d.name,
                phone: d.phone,
                password: d.password,
                approved: true,
                permissions: fd.getAll('permissions')
            });
        saveDB();
        closeModal();
        toast('Saved to the central library');
        renderApp(type === 'assistant' ? 'assistants' : type === 'course' ? 'courses' : 'content')
    }
    ;
}
function actions() {
    return `<div class="modal-actions"><button class="btn btn-soft" type="button" data-close-now>Cancel</button><button class="btn btn-primary">Save</button></div>`
}
function importQbankModal() {
    openModal(`<div class="extract-head"><span class="pill green">1 · Upload</span><span class="pill">2 · Extract</span><span class="pill">3 · Review</span><span class="pill">4 · Publish</span></div><h2>Extract English Question Bank PDF</h2><p class="muted">Upload the complete PDF once. The review workspace organizes each question by domain, skill and difficulty—similar to OnePrep.</p><form class="modal-form" id="importForm"><label>Question Bank PDF<input type="file" name="file" accept="application/pdf" required /></label><label class="checkline"><input type="checkbox" required /> I have permission to use and upload this content.</label><div class="info-note"><strong>Admin workflow</strong><p>The downloadable demo previews extraction with sample questions. A production backend is required to read every page automatically.</p></div><div class="modal-actions"><button class="btn btn-soft" type="button" data-close-now>Cancel</button><button class="btn btn-primary">Upload & Extract</button></div></form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#importForm').onsubmit = e => {
        e.preventDefault();
        const file = new FormData(e.target).get('file');
        $('#modalContent').innerHTML = `<div class="extract-processing"><div class="loader"></div><h2>Extracting ${esc(file.name)}</h2><p class="muted">Detecting passages, choices, correct answers, explanations and English skills…</p></div>`;
        setTimeout( () => reviewExtract(file.name), 700)
    }
}
function reviewExtract(fileName) {
    const extracted = sampleQuestions.slice(0, 4).map(q => ({
        ...q,
        id: uid('q'),
        courseIds: [],
        skill: `Imported · ${q.skill}`
    }));
    $('#modalContent').innerHTML = `<div class="extract-head"><span class="pill green">✓ Upload</span><span class="pill green">✓ Extract</span><span class="pill active">3 · Review</span><span class="pill">4 · Publish</span></div><h2>Review ${extracted.length} extracted questions</h2><p class="muted">Check the detected type and difficulty before publishing to the central library.</p><div class="extract-review">${extracted.map( (q, i) => `<div class="extract-row"><b>${i + 1}</b><div><strong>${esc(q.prompt)}</strong><span>${esc(q.domain)} · ${esc(q.skill)}</span></div><select data-extract-level="${i}"><option ${q.difficulty === 'Easy' ? 'selected' : ''}>Easy</option><option ${q.difficulty === 'Medium' ? 'selected' : ''}>Medium</option><option ${q.difficulty === 'Hard' ? 'selected' : ''}>Hard</option></select></div>`).join('')}</div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><button class="btn btn-primary" id="publishExtract">Publish to Library</button></div>`;
    $('[data-close-now]').onclick = closeModal;
    $('#publishExtract').onclick = () => {
        $$('[data-extract-level]').forEach(s => extracted[+s.dataset.extractLevel].difficulty = s.value);
        db.qbank.push(...extracted);
        saveDB();
        closeModal();
        toast(`${fileName}: ${extracted.length} questions published`);
        renderApp('content')
    }
}
function replyModal(id) {
    const a = db.asks.find(x => x.id === id);
    openModal(`<h2>Reply to ${esc(a.student)}</h2><p class="muted">${esc(a.context)}</p><div class="message">${esc(a.text)}</div><form class="modal-form" id="replyForm" style="margin-top:15px"><label>Your reply<textarea name="reply" required></textarea></label>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#replyForm').onsubmit = e => {
        e.preventDefault();
        a.reply = new FormData(e.target).get('reply');
        a.status = 'answered';
        saveDB();
        closeModal();
        renderApp('inbox');
        toast('Reply sent')
    }
}
function openZoom(id) {
    const s = db.sessions.find(x => x.id === id);
    openModal(`<h2>Open Zoom session</h2><p class="muted">${esc(s.title)} · ${formatDate(s.date)} at ${esc(s.time)}</p><div class="info-note"><strong>Protected handoff</strong><p>The session link opens only after the student signs in. Zoom opens in its official app or secure browser page.</p></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><a class="btn btn-primary" href="${esc(s.zoom)}" target="_blank" rel="noopener">Open Zoom</a></div>`);
    $('[data-close-now]').onclick = closeModal
}
function openRecording(id) {
    const s = db.sessions.find(x => x.id === id);
    const src = s.recording || '';
    openModal(`<h2>${esc(s.title)}</h2><div class="video-wrap"><div class="watermark">${esc(currentUser.name)} · ${esc(currentUser.phone)}</div>${src ? `<video id="lessonVideo" src="${esc(src)}" controls controlsList="nodownload"></video>` : `<div style="color:#fff;text-align:center"><strong>Recording player ready</strong><p class="small" style="color:#9daabd">Upload the session video from Content Studio.</p></div>`}</div><div class="speed-row">${[.5, 1, 1.5, 2, 3].map(n => `<button data-speed="${n}" class="${n === 1 ? 'active' : ''}">${n}×</button>`).join('')}<button data-full-video>Full screen</button></div>`);
    $$('[data-speed]').forEach(b => b.onclick = () => {
        const v = $('#lessonVideo');
        if (v)
            v.playbackRate = +b.dataset.speed;
        $$('[data-speed]').forEach(x => x.classList.toggle('active', x === b))
    }
    );
    $('[data-full-video]').onclick = () => $('.video-wrap').requestFullscreen?.()
}
function startHomework(id) {
    const h = db.homework.find(x => x.id === id)
      , previous = db.results.filter(r => r.userId === currentUser.id && r.type === 'homework' && r.itemId === id);
    let i = 0
      , correct = 0;
    function show() {
        const q = h.questions[i];
        openModal(`<div class="practice-app homework-practice"><header class="practice-header"><div><strong>${esc(h.title)}</strong><button class="directions-btn">Directions⌄</button></div><div class="practice-center"><b>Homework</b><button>Hide</button></div><div class="practice-tools"><button data-tool>⚠<span>Report</span></button><button data-tool>◇<span>Highlights & Notes</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage"><p>${esc(q.passage)}</p></section><section class="practice-question"><div class="question-label"><b>${i + 1}</b><button data-mark-review>♡ Mark for Review</button><span>${esc(q.skill)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, n) => `<button class="choice" data-hw-answer="${n}"><i>${String.fromCharCode(65 + n)}</i><span>${esc(c)}</span></button>`).join('')}</div><div id="hwExplain"></div></section></div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">Question ${i + 1} of ${h.questions.length}</div><div><button class="nav-pill pale" data-ask-hw>Ask</button><button class="nav-pill" id="hwNext" disabled>${i < h.questions.length - 1 ? 'Next' : 'Finish'}</button></div></footer></div>`);
        bindPracticeTools();
        $$('[data-hw-answer]').forEach(b => b.onclick = () => {
            const n = +b.dataset.hwAnswer;
            $$('[data-hw-answer]').forEach( (x, k) => {
                x.disabled = true;
                x.classList.add(k === q.correct ? 'correct' : k === n ? 'wrong' : '')
            }
            );
            if (n === q.correct)
                correct++;
            else if (!db.mistakes.some(m => m.userId === currentUser.id && m.questionId === q.id))
                db.mistakes.push({
                    userId: currentUser.id,
                    questionId: q.id,
                    skill: q.skill,
                    prompt: q.prompt
                });
            $('#hwExplain').innerHTML = `<div class="explain"><strong>Explanation</strong><br>${esc(q.explanation)}</div>`;
            $('#hwNext').disabled = false;
            $('#hwNext').onclick = () => {
                i++;
                if (i < h.questions.length)
                    show();
                else
                    finish()
            }
        }
        );
        $('[data-ask-hw]').onclick = () => {
            closeModal();
            askModal(`${h.title} · Question ${i + 1}`)
        }
    }
    function finish() {
        const score = Math.round(correct / h.questions.length * 100)
          , attempt = previous.length + 1;
        db.results.push({
            id: uid('r'),
            userId: currentUser.id,
            type: 'homework',
            itemId: h.id,
            title: h.title,
            score,
            total: 100,
            date: new Date().toISOString().slice(0, 10),
            attempt
        });
        saveDB();
        openModal(`<div class="pending-view"><div class="score-circle" data-score="${score}%" style="margin:auto"></div><h2 style="margin-top:18px">Attempt ${attempt} submitted</h2><p>You answered ${correct} of ${h.questions.length} correctly. This score is saved beside your earlier attempts.</p><button class="btn btn-primary" id="doneHw">View Homework</button></div>`);
        $('#doneHw').onclick = () => {
            closeModal();
            renderApp('homework')
        }
    }
    if (previous.length)
        toast(`Starting attempt ${previous.length + 1}`);
    show()
}

const startHomeworkCore = startHomework;
startHomework = function(id) {
    enterFocusMode('homework');
    return startHomeworkCore(id)
}
;
let examState = null
  , examTimer = null
  , fullscreenGuard = false;
function confirmExam(id) {
    const e = db.exams.find(x => x.id === id);
    openModal(`<h2>Before you start</h2><div class="list"><div class="list-row"><div class="file-icon">2</div><div class="list-main"><h4>Two modules</h4><p>${e.minutes} minutes per module</p></div></div><div class="list-row"><div class="file-icon">FS</div><div class="list-main"><h4>Full screen required</h4><p>Leaving full screen is recorded as a violation.</p></div></div><div class="list-row"><div class="file-icon">BR</div><div class="list-main"><h4>Timed break</h4><p>${e.breakMinutes} minute break between modules</p></div></div></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><button class="btn btn-primary" id="beginExam">Enter full screen & start</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#beginExam').onclick = () => {
        closeModal();
        startExam(e)
    }
}
async function startExam(exam) {
    examState = {
        exam,
        module: 0,
        index: 0,
        answers: [{}, {}],
        seconds: exam.minutes * 60,
        violations: 0,
        breaking: false
    };
    $('#examShell').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    try {
        await document.documentElement.requestFullscreen?.();
        fullscreenGuard = !!document.fullscreenElement
    } catch {
        fullscreenGuard = false
    }
    renderExam();
    startTimer()
}
function startTimer() {
    clearInterval(examTimer);
    examTimer = setInterval( () => {
        if (!examState || examState.breaking)
            return;
        examState.seconds--;
        const el = $('#examTimer');
        if (el)
            el.textContent = timeText(examState.seconds);
        if (examState.seconds <= 0)
            finishModule()
    }
    , 1000)
}
function timeText(s) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.max(0, s % 60)).padStart(2, '0')}`
}
function renderExam() {
    const s = examState
      , e = s.exam
      , q = e.modules[s.module][s.index]
      , ans = s.answers[s.module][s.index];
    $('#examShell').innerHTML = `<div class="practice-app exam-practice"><header class="practice-header"><div><strong>Section ${s.module + 1}: Reading and Writing</strong><button class="directions-btn">Directions⌄</button></div><div class="practice-center"><b class="exam-timer" id="examTimer">${timeText(s.seconds)}</b><button>Hide</button></div><div class="practice-tools"><button data-tool>⚠<span>Report</span></button><button data-tool>◇<span>Highlights & Notes</span></button><button data-tool>↗<span>Exit</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern exam-watermark">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage"><p>${esc(q.passage)}</p></section><section class="practice-question"><div class="question-label"><b>${s.index + 1}</b><button data-mark-review>♡ Mark for Review</button><span>${esc(q.skill)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, i) => `<button class="choice ${ans === i ? 'selected' : ''}" data-exam-answer="${i}"><i>${String.fromCharCode(65 + i)}</i><span>${esc(c)}</span></button>`).join('')}</div></section></div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">Question ${s.index + 1} of ${e.modules[s.module].length}</div><div><button class="nav-pill pale" data-exam-prev ${s.index === 0 ? 'disabled' : ''}>Back</button><button class="nav-pill" data-exam-next>${s.index === e.modules[s.module].length - 1 ? 'Finish Module' : 'Next'}</button></div></footer></div>`;
    bindPracticeTools();
    $$('[data-exam-answer]').forEach(b => b.onclick = () => {
        s.answers[s.module][s.index] = +b.dataset.examAnswer;
        renderExam()
    }
    );
    $('[data-exam-prev]').onclick = () => {
        s.index--;
        renderExam()
    }
    ;
    $('[data-exam-next]').onclick = () => {
        if (s.index < e.modules[s.module].length - 1) {
            s.index++;
            renderExam()
        } else
            finishModule()
    }
    ;
    $('#examShell').oncontextmenu = e => e.preventDefault();
    $('#examShell').oncopy = e => e.preventDefault()
}
function finishModule() {
    const s = examState;
    if (s.module === 0) {
        s.breaking = true;
        clearInterval(examTimer);
        let left = Math.max(5, Math.min(60, s.exam.breakMinutes * 60));
        $('#examShell').innerHTML = `<header class="exam-head"><strong>${esc(s.exam.title)}</strong><span>Break</span></header><div class="break-screen"><div class="eyebrow">MODULE 1 COMPLETE</div><h1>Take a short break</h1><div class="break-clock" id="breakClock">${timeText(left)}</div><p class="muted">Module 2 starts when the timer ends.</p><button class="btn btn-primary" id="skipBreak">Start module 2 now</button></div>`;
        const go = () => {
            clearInterval(examTimer);
            s.module = 1;
            s.index = 0;
            s.seconds = s.exam.minutes * 60;
            s.breaking = false;
            renderExam();
            startTimer()
        }
        ;
        $('#skipBreak').onclick = go;
        examTimer = setInterval( () => {
            left--;
            const el = $('#breakClock');
            if (el)
                el.textContent = timeText(left);
            if (left <= 0)
                go()
        }
        , 1000)
    } else
        finishExam()
}
function finishExam() {
    const s = examState;
    clearInterval(examTimer);
    let correct = 0
      , total = 0;
    s.exam.modules.forEach( (mod, mi) => mod.forEach( (q, qi) => {
        total++;
        if (s.answers[mi][qi] === q.correct)
            correct++;
        else if (!db.mistakes.some(m => m.userId === currentUser.id && m.questionId === q.id))
            db.mistakes.push({
                userId: currentUser.id,
                questionId: q.id,
                skill: q.skill,
                prompt: q.prompt
            })
    }
    ));
    const score = 200 + Math.round((correct / total) * 600 / 10) * 10;
    db.results.push({
        id: uid('r'),
        userId: currentUser.id,
        type: 'mock',
        itemId: s.exam.id,
        title: s.exam.title,
        score,
        total: 800,
        date: new Date().toISOString().slice(0, 10),
        violations: s.violations
    });
    saveDB();
    examState = null;
    fullscreenGuard = false;
    document.exitFullscreen?.().catch( () => {}
    );
    $('#examShell').classList.add('hidden');
    document.body.style.overflow = '';
    openModal(`<div class="pending-view"><div class="score-circle" data-score="${score}" style="margin:auto"></div><h2 style="margin-top:18px">Mock complete</h2><p>${correct} of ${total} correct · ${s.violations} full-screen violations</p><div class="modal-actions" style="justify-content:center"><button class="btn btn-soft" id="askResult">Ask about a question</button><button class="btn btn-primary" id="closeResult">View weak points</button></div></div>`);
    $('#askResult').onclick = () => {
        closeModal();
        askModal(`${s.exam.title} · Result ${score}`)
    }
    ;
    $('#closeResult').onclick = () => {
        closeModal();
        navigate('weak')
    }
}
document.addEventListener('fullscreenchange', () => {
    if (examState && !examState.breaking && fullscreenGuard && !document.fullscreenElement) {
        examState.violations++;
        $('#examShell').insertAdjacentHTML('beforeend', `<div class="violation" id="violation"><div><div class="eyebrow" style="color:#8db1ff">EXAM PAUSED</div><h2>Return to full screen</h2><p>The attempt is protected. This exit has been recorded.</p><button class="btn btn-primary" id="returnFull">Return to exam</button></div></div>`);
        $('#returnFull').onclick = async () => {
            try {
                await document.documentElement.requestFullscreen();
                $('#violation')?.remove()
            } catch {
                toast('Full screen permission is required')
            }
        }
    }
}
);
/* v7: separated admin workspaces, OnePrep-style bank, richer SAT practice and account controls. */
db.settings.contacts ||= [{
    id: 'ct1',
    type: 'whatsapp',
    label: 'WhatsApp',
    value: '201011111111',
    show: true
}, {
    id: 'ct2',
    type: 'facebook',
    label: 'Facebook',
    value: 'https://facebook.com/',
    show: true
}, {
    id: 'ct3',
    type: 'telegram',
    label: 'Telegram',
    value: 'https://t.me/',
    show: true
}];
db.zoom ||= db.sessions.filter(s => !s.ended).map(s => ({
    ...s,
    id: `z_${s.id}`
}));
db.questionReviews ||= [];
db.pdfs.forEach( (p, i) => {
    if (!p.url && i === 0)
        p.url = 'assets/sample-sat-english-guide.pdf'
}
);
db.users.forEach(u => {
    u.country ||= '20';
    if (u.role === 'student')
        u.parentCountry ||= '20'
}
);

const adminNavV7 = [['overview', '▦', 'Dashboard'], ['applications', '◎', 'Applications'], ['courses', '▣', 'Courses'], ['pdf_admin', '▤', 'PDFs'], ['mock_admin', '◉', 'Mocks'], ['homework_admin', '✓', 'Homework'], ['qbank_admin', '?', 'Question Bank'], ['zoom_admin', 'Z', 'Zoom'], ['session_admin', '▶', 'Sessions'], ['students', '♙', 'Students'], ['assistants', '♧', 'Assistants'], ['inbox', '✦', 'Asks'], ['tracking', '★', 'Question Tracking'], ['contacts', '☎', 'Contact Links'], ['profile', '●', 'My Profile']];
navByRole.admin = adminNavV7;
navByRole.assistant = adminNavV7.filter( ([v]) => !['applications', 'courses', 'students', 'assistants', 'contacts'].includes(v));
courseNav.splice(5, 0, ['zoom', 'Z', 'Zoom']);
courseNav.push(['profile', '●', 'My Profile']);

const permissionMap = {
    overview: null,
    pdf_admin: 'manage_pdfs',
    mock_admin: 'add_mocks',
    homework_admin: 'add_hw',
    qbank_admin: 'manage_qbank',
    zoom_admin: 'manage_zoom',
    session_admin: 'add_session_rec',
    inbox: 'ask',
    tracking: 'review_questions',
    profile: null
};
can = function(view) {
    if (currentUser.role !== 'assistant')
        return true;
    const needed = permissionMap[view];
    return !needed || (currentUser.permissions || []).includes(needed)
}
;
permissionLabel = function(p) {
    return ({
        ask: 'Answer asks',
        add_hw: 'Manage homework',
        add_mocks: 'Manage mocks',
        add_session_rec: 'Manage recordings',
        manage_pdfs: 'Manage PDFs',
        manage_qbank: 'Manage Question Bank',
        manage_zoom: 'Manage Zoom',
        review_questions: 'Review question ratings'
    })[p] || p
}
;
const deviceId = localStorage.getItem('satHubDevice') || uid('device');
localStorage.setItem('satHubDevice', deviceId);
const loginV6 = login;
login = function(u) {
    if (u.role === 'student' && u.boundDevice && u.boundDevice !== deviceId) {
        toast('This account is already active on another device. Ask the admin to reset it.');
        return
    }
    if (u.role === 'student' && !u.boundDevice) {
        u.boundDevice = deviceId;
        saveDB()
    }
    loginV6(u)
}
;

setupApp = function() {
    const base = currentUser.role === 'student' && selectedCourseId ? courseNav : navByRole[currentUser.role]
      , items = base.filter( ([v]) => can(v))
      , askCount = currentUser.role === 'student' ? db.asks.filter(a => a.userId === currentUser.id && a.status !== 'answered').length : db.asks.filter(a => a.status !== 'answered').length;
    $('#sideNav').innerHTML = items.map( ([v,i,l]) => `<button class="nav-item" data-nav="${v}">${icon(i)}<span>${l}</span>${(v === 'inbox' || v === 'asks') && askCount ? `<b class="nav-badge">${askCount}</b>` : ''}</button>`).join('');
    $('#roleLabel').textContent = currentUser.role === 'student' && activeCourse() ? activeCourse().code : `${currentUser.role[0].toUpperCase() + currentUser.role.slice(1)} portal`;
    $('#sideUserName').textContent = currentUser.name;
    $('#sideUserMeta').textContent = currentUser.grade || currentUser.role;
    $('#userInitials').textContent = $('#mobileAvatar').textContent = initials(currentUser.name);
    if (currentUser.photo) {
        $('#userInitials').style.backgroundImage = $('#mobileAvatar').style.backgroundImage = `url(${currentUser.photo})`
    }
    $$('[data-nav]').forEach(b => b.onclick = () => {
        if (b.dataset.nav === 'courses' && currentUser.role === 'student') {
            selectedCourseId = '';
            sessionStorage.removeItem('satHubCourse');
            setupApp()
        }
        navigate(b.dataset.nav)
    }
    )
}
;
navigate = function(view) {
    if (!can(view))
        return toast('You do not have permission for this section');
    if (view !== 'qbank')
        exitFocusMode(false);
    currentView = view;
    $$('[data-nav]').forEach(b => b.classList.toggle('active', b.dataset.nav === view));
    $('.sidebar').classList.remove('open');
    renderApp(view);
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}
;

function whatsappNumber(phone, country='20') {
    let n = String(phone || '').replace(/\D/g, '').replace(/^0+/, '');
    return `${country}${n}`
}
function whatsappLink(phone, country) {
    return `https://wa.me/${whatsappNumber(phone, country)}`
}
function contactHref(c) {
    if (c.type === 'whatsapp')
        return `https://wa.me/${String(c.value).replace(/\D/g, '')}`;
    if (c.type === 'telegram' && !/^https?:/.test(c.value))
        return `https://t.me/${c.value.replace(/^@/, '')}`;
    return c.value
}
const syncPublicV6 = syncPublic;
syncPublic = function() {
    syncPublicV6();
    const box = $('#contactLinks');
    if (box)
        box.innerHTML = db.settings.contacts.filter(c => c.show).map(c => `<a class="contact-chip ${esc(c.type)}" href="${esc(contactHref(c))}" target="_blank" rel="noopener"><b>${c.type === 'whatsapp' ? 'WA' : c.type === 'facebook' ? 'f' : c.type === 'telegram' ? 'TG' : '↗'}</b>${esc(c.label)}</a>`).join('')
}
;

openPdf = function(id) {
    const p = db.pdfs.find(x => x.id === id);
    openModal(`<h2>${esc(p.title)}</h2><p class="muted">${esc(assignedTo(p))}</p>${p.url ? `<iframe class="pdf-frame" src="${esc(p.url)}#toolbar=1&navpanes=0" title="${esc(p.title)}"></iframe>` : `<div class="empty pdf-empty"><strong>PDF saved in the library</strong>Upload a PDF from the admin PDF section to preview it in this browser.</div>`}<div class="modal-actions"><button class="btn btn-soft" data-close-now>Close</button><button class="btn btn-primary" data-ask-pdf>Ask about this PDF</button></div>`);
    $('.modal-card').classList.add('wide-modal');
    $('[data-close-now]').onclick = () => {
        closeModal();
        $('.modal-card').classList.remove('wide-modal')
    }
    ;
    $('[data-ask-pdf]').onclick = () => {
        closeModal();
        askModal(`PDF · ${p.title}`)
    }
}
;

studentViews.zoom = () => head('LIVE CLASSES', `${esc(activeCourse()?.title || 'Course')} · Zoom`, 'Live Zoom meetings are separate from recorded sessions.') + `<div class="session-stack">${db.zoom.filter(z => belongs(z)).sort( (a, b) => new Date(a.date) - new Date(b.date)).map( (z, i) => `<article class="card session-row"><div class="session-order">${String(i + 1).padStart(2, '0')}</div><div class="date-icon"><span>ZOOM</span><b>${new Date(z.date + 'T12:00:00').getDate()}</b></div><div class="list-main"><h3>${esc(z.title)}</h3><p>${formatDate(z.date)} · ${esc(z.time)}</p></div><button class="btn btn-primary" data-zoom="${z.id}">Open Zoom</button></article>`).join('') || '<div class="empty">No Zoom meetings scheduled.</div>'}</div>`;
studentViews.sessions = () => head('RECORDING LIBRARY', `${esc(activeCourse()?.title || 'Course')} · Sessions`, 'Recorded sessions only, arranged in course order.') + `<div class="session-stack">${db.sessions.filter(s => belongs(s) && s.ended).sort( (a, b) => new Date(a.date) - new Date(b.date)).map( (s, i) => `<article class="card session-row"><div class="session-order">${String(i + 1).padStart(2, '0')}</div><div class="date-icon"><span>REC</span><b>▶</b></div><div class="list-main"><h3>${esc(s.title)}</h3><p>${formatDate(s.date)}</p></div><button class="btn btn-soft" data-recording="${s.id}">Show</button></article>`).join('') || '<div class="empty">No recordings yet.</div>'}</div>`;
studentViews.weak = () => {
    const mistakes = db.mistakes.filter(m => m.userId === currentUser.id);
    return head('PERSONAL ANALYSIS', 'Weak Points', 'Open each missed item directly in the Question Bank.') + `<article class="card"><div class="list">${mistakes.map(m => `<div class="list-row"><div class="file-icon">!</div><div class="list-main"><h4>${esc(m.skill)}</h4><p>${esc(m.prompt)}</p></div><button class="btn btn-soft btn-sm" data-open-weak="${esc(m.questionId)}">Open in Question Bank</button></div>`).join('') || '<div class="empty">No weak points yet.</div>'}</div></article>`
}
;

const qbSkillGroups = {
    'Craft and Structure': ['Cross-Text Connections', 'Text Structure and Purpose', 'Words in Context'],
    'Expression of Ideas': ['Rhetorical Synthesis', 'Transitions'],
    'Information and Ideas': ['Central Ideas and Details', 'Command of Evidence', 'Inferences'],
    'Standard English Conventions': ['Boundaries', 'Form, Structure, and Sense']
};
Object.entries(qbSkillGroups).forEach( ([domain,skills], di) => skills.forEach( (skill, si) => {
    if (!db.qbank.some(q => q.skill === skill)) {
        const base = sampleQuestions[(di + si) % sampleQuestions.length];
        db.qbank.push({
            ...structuredClone(base),
            id: `demo_${di}_${si}`,
            domain,
            skill,
            difficulty: ['Easy', 'Medium', 'Hard'][(di + si) % 3],
            courseIds: ['c1']
        })
    }
}
));
saveDB();
let qbFilters = {
    difficulty: 'All',
    status: 'All',
    order: 'Normal'
};
renderQbank = function() {
    const bank = db.qbank.filter(q => belongs(q));
    if (qbankState.mode === 'practice') {
        const pool = activeQpool()
          , q = pool[qIndex % Math.max(1, pool.length)];
        if (!q)
            return `<div class="empty">No questions match these filters.</div>`;
        const answered = qAnswers[q.id] !== undefined
          , review = db.questionReviews.find(r => r.userId === currentUser.id && r.questionId === q.id);
        return `<div class="practice-app qbank-practice"><header class="practice-header"><div><strong>Question Bank · ${esc(q.skill)}</strong><button class="directions-btn">Reading & Writing</button></div><div class="practice-center"><b>${qIndex + 1} / ${pool.length}</b><button>${esc(q.difficulty)}</button></div><div class="practice-tools"><button data-highlight>▤<span>Highlighter</span></button><button data-exit-qbank>↗<span>Exit</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage" id="qbankPassage"><p>${esc(q.passage)}</p>${q.image ? `<img class="question-media ${q.mediaStyle === 'square' ? 'square' : ''}" src="${esc(q.image)}" alt="Question visual" />` : ''}</section><section class="practice-question"><div class="question-label"><b>${qIndex + 1}</b><button data-mark-review>♡ Mark for Review</button><span>${esc(q.domain)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, i) => `<button class="choice ${answered ? (i === q.correct ? 'correct' : i === qAnswers[q.id] ? 'wrong' : '') : ''}" data-qanswer="${i}" ${answered ? 'disabled' : ''}><i>${String.fromCharCode(65 + i)}</i><span>${esc(c)}</span></button>`).join('')}</div>${answered ? `<div class="explain"><strong>Explanation</strong><br>${esc(q.explanation)}</div>` : ''}${review ? `<div class="rated-note">Solved · ${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</div>` : ''}</section></div><div class="question-dock">${pool.map( (x, i) => `<button class="${qAnswers[x.id] !== undefined ? 'done' : ''} ${i === qIndex ? 'active' : ''}" data-qjump="${i}">${i + 1}</button>`).join('')}</div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">${esc(q.skill)}</div><div><button class="nav-pill pale" data-qprev ${qIndex === 0 ? 'disabled' : ''}>Back</button>${answered ? `<button class="nav-pill pale" data-rate-question="${q.id}">${review ? 'Change rating' : 'Close & Rate'}</button>` : ''}<button class="nav-pill" data-qnext ${qIndex === pool.length - 1 ? 'disabled' : ''}>Next</button></div></footer></div>`
    }
    const reviewed = new Set(db.questionReviews.filter(r => r.userId === currentUser.id).map(r => r.questionId));
    return `<div class="qb-index"><button class="qb-back" data-nav="courses">‹ Back to Question Bank</button>${head('READING & WRITING', 'Question Bank', 'Choose topics, filter difficulty and continue your progress.')}<div class="qb-filters"><select data-qfilter="difficulty"><option>All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select><select data-qfilter="status"><option>All questions</option><option>Completed</option><option>Not completed</option></select><select data-qfilter="order"><option>Normal order</option><option>Hard first</option><option>Easy first</option></select><button class="btn btn-soft">⚑ Filters</button></div><div class="qb-practice-all"><div><strong>Practice all topics</strong><p>Start practicing every available Reading & Writing skill.</p></div><button class="btn btn-soft" data-start-topic="">Start practice</button></div><div class="qb-table-head"><span>Topic</span><span>Progress</span></div>${Object.entries(qbSkillGroups).map( ([domain,skills]) => `<section class="qb-group"><h2>${esc(domain)}</h2>${skills.map(skill => {
        const qs = bank.filter(q => q.skill === skill)
          , done = qs.filter(q => reviewed.has(q.id)).length;
        return `<button class="qb-topic" data-start-topic="${esc(skill)}"><span class="topic-check ${done && qs.length ? 'complete' : ''}"></span><b>${esc(skill)}</b><i><span style="width:${qs.length ? done / qs.length * 100 : 0}%"></span></i><em>${done}/${qs.length}</em></button>`
    }
    ).join('')}</section>`).join('')}</div>`
}
;
activeQpool = function() {
    let pool = db.qbank.filter(q => belongs(q));
    if (qbankState.skill)
        pool = pool.filter(q => q.skill === qbankState.skill);
    else if (qbankState.domain)
        pool = pool.filter(q => q.domain === qbankState.domain);
    const difficulty = qbankState.difficulty && qbankState.difficulty !== 'All' ? qbankState.difficulty : qbFilters.difficulty;
    if (difficulty && difficulty !== 'All')
        pool = pool.filter(q => q.difficulty === difficulty);
    const reviewed = new Set(db.questionReviews.filter(r => r.userId === currentUser.id).map(r => r.questionId));
    if (qbFilters.status === 'Completed')
        pool = pool.filter(q => reviewed.has(q.id));
    if (qbFilters.status === 'Not completed')
        pool = pool.filter(q => !reviewed.has(q.id));
    const rank = {
        Easy: 1,
        Medium: 2,
        Hard: 3
    };
    if (qbFilters.order === 'Hard first')
        pool.sort( (a, b) => rank[b.difficulty] - rank[a.difficulty]);
    if (qbFilters.order === 'Easy first')
        pool.sort( (a, b) => rank[a.difficulty] - rank[b.difficulty]);
    return pool
}
;

adminViews.overview = () => head('ADMIN PANEL', 'Student Dashboard', 'All students, their courses and direct WhatsApp contact.') + `<article class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Phone</th><th>Parent</th><th>Grade</th><th>Courses</th><th>Device</th></tr></thead><tbody>${db.users.filter(u => u.role === 'student').map(u => `<tr><td><strong>${esc(u.name)}</strong></td><td><a class="wa-link" href="${whatsappLink(u.phone, u.country)}" target="_blank">${esc(u.phone)} ↗</a></td><td><a class="wa-link" href="${whatsappLink(u.parent, u.parentCountry || u.country)}" target="_blank">${esc(u.parent || '—')} ↗</a></td><td>${esc(u.grade || '—')}</td><td>${esc((u.courses || []).map(courseName).join(', '))}</td><td>${u.boundDevice ? `<button class="btn btn-soft btn-sm" data-reset-device="${u.id}">Reset device</button>` : 'Not linked'}</td></tr>`).join('')}</tbody></table></div></article>`;
adminViews.students = adminViews.overview;
adminViews.pdf_admin = () => head('CONTENT', 'PDFs', 'Upload once, search by name, then choose which courses can see it.', `<button class="btn btn-primary" data-new-pdf>Add PDF</button>`) + `<div class="search-row"><input class="search-input" id="pdfSearch" placeholder="Search PDF name..." /></div><article class="card"><div class="list" id="pdfAdminList">${pdfAdminRows()}</div></article>`;
function pdfAdminRows(query='') {
    return db.pdfs.filter(p => p.title.toLowerCase().includes(query.toLowerCase())).map(p => `<div class="list-row"><div class="file-icon">PDF</div><div class="list-main"><h4>${esc(p.title)}</h4><p>${esc(assignedTo(p))} · ${p.pages || '—'} pages</p></div><button class="btn btn-soft btn-sm" data-preview-pdf="${p.id}">Preview</button><button class="btn btn-primary btn-sm" data-edit-pdf="${p.id}">Edit & Show</button></div>`).join('') || '<div class="empty">No matching PDFs.</div>'
}
adminViews.mock_admin = () => head('ASSESSMENTS', 'Mocks', 'Create two-module SAT English mocks, timing, break and questions.', `<button class="btn btn-primary" data-new-mock>Create Mock</button>`) + `<div class="grid">${db.exams.map(e => `<article class="card span-6"><div class="card-head"><span class="pill">2 modules</span><span class="pill green">${e.minutes} min · ${e.breakMinutes} min break</span></div><h2>${esc(e.title)}</h2><p class="muted">${e.modules.flat().length} questions · ${esc(assignedTo(e))}</p><button class="btn btn-soft" data-edit-mock="${e.id}">Edit Mock & Questions</button></article>`).join('')}</div>`;
adminViews.homework_admin = () => head('ASSIGNMENTS', 'Homework', 'Create an assignment, then edit its questions, answers and optional images.', `<button class="btn btn-primary" data-new-homework>Create Homework</button>`) + `<div class="grid">${db.homework.map(h => `<article class="card span-4"><span class="pill">${esc(h.session)}</span><h3>${esc(h.title)}</h3><p class="muted">${h.questions.length} questions · ${esc(assignedTo(h))}</p><button class="btn btn-soft" data-edit-homework="${h.id}">Edit Homework</button></article>`).join('')}</div>`;
adminViews.qbank_admin = () => head('QUESTION LIBRARY', 'Question Bank', 'Add questions manually with SAT classification or extract a full College Board PDF.', `<button class="btn btn-soft" data-import-qbank>Extract full PDF</button><button class="btn btn-primary" data-add-qbank>Add Question</button>`) + `<article class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Question</th><th>Domain</th><th>Skill</th><th>Difficulty</th><th>Courses</th><th></th></tr></thead><tbody>${db.qbank.map(q => `<tr><td>${esc(q.prompt.slice(0, 62))}...</td><td>${esc(q.domain)}</td><td>${esc(q.skill)}</td><td><span class="pill">${esc(q.difficulty)}</span></td><td>${esc(assignedTo(q))}</td><td><button class="btn btn-soft btn-sm" data-edit-qbank="${q.id}">Edit</button></td></tr>`).join('')}</tbody></table></div></article>`;
adminViews.zoom_admin = () => head('LIVE CLASSES', 'Zoom', 'Schedule live Zoom meetings separately from recordings.', `<button class="btn btn-primary" data-new-zoom>Add Zoom</button>`) + `<div class="session-stack">${db.zoom.map(z => `<article class="card session-row"><div class="date-icon"><span>ZOOM</span><b>${new Date(z.date + 'T12:00:00').getDate()}</b></div><div class="list-main"><h3>${esc(z.title)}</h3><p>${formatDate(z.date)} · ${esc(z.time)} · ${esc(assignedTo(z))}</p></div><button class="btn btn-soft" data-edit-zoom="${z.id}">Edit</button></article>`).join('')}</div>`;
adminViews.session_admin = () => head('VIDEO LIBRARY', 'Recorded Sessions', 'Add protected recordings with watermark and speed controls.', `<button class="btn btn-primary" data-new-recording>Add Recording</button>`) + `<div class="session-stack">${db.sessions.filter(s => s.ended).map(s => `<article class="card session-row"><div class="date-icon"><span>REC</span><b>▶</b></div><div class="list-main"><h3>${esc(s.title)}</h3><p>${formatDate(s.date)} · ${esc(assignedTo(s))}</p></div><button class="btn btn-soft" data-recording="${s.id}">Preview</button></article>`).join('')}</div>`;
adminViews.tracking = () => {
    const students = db.users.filter(u => u.role === 'student');
    return head('QUESTION REVIEW', 'Question Tracking', 'See unresolved, solved and rated questions for every student.') + `<div class="grid">${students.map(u => {
        const reviews = db.questionReviews.filter(r => r.userId === u.id)
          , solved = reviews.length
          , rated = reviews.filter(r => r.stars).length;
        return `<article class="card span-4"><div class="card-head"><div class="avatar">${initials(u.name)}</div><span class="pill ${rated ? 'green' : 'amber'}">${rated} rated</span></div><h3>${esc(u.name)}</h3><p class="muted">${solved} solved · ${Math.max(0, db.qbank.length - solved)} unresolved</p><div class="rating-summary">${reviews.length ? reviews.map(r => `<div><span>${esc(db.qbank.find(q => q.id === r.questionId)?.skill || 'Question')}</span><b>${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</b></div>`).join('') : 'No ratings yet.'}</div></article>`
    }
    ).join('')}</div>`
}
;
adminViews.contacts = () => head('PUBLIC SIGN IN', 'Contact Links', 'Choose any number of contact buttons and control which ones appear.', `<button class="btn btn-primary" data-add-contact>Add Contact</button>`) + `<article class="card"><div class="list">${db.settings.contacts.map( (c, i) => `<div class="list-row"><div class="contact-mini">${c.type === 'whatsapp' ? 'WA' : c.type === 'facebook' ? 'f' : c.type === 'telegram' ? 'TG' : '↗'}</div><div class="list-main"><h4>${esc(c.label)}</h4><p>${esc(c.value)}</p></div><span class="pill ${c.show ? 'green' : 'red'}">${c.show ? 'Shown' : 'Hidden'}</span><button class="btn btn-soft btn-sm" data-toggle-contact="${i}">${c.show ? 'Hide' : 'Show'}</button><button class="btn btn-soft btn-sm" data-edit-contact="${i}">Edit</button></div>`).join('')}</div></article>`;
adminViews.assistants = () => head('TEAM ACCESS', 'Assistants', 'Create accounts and edit every permission.', `<button class="btn btn-primary" data-add="assistant">Create assistant</button>`) + `<div class="grid">${db.users.filter(u => u.role === 'assistant').map(u => `<article class="card span-4"><div class="card-head"><div class="avatar">${initials(u.name)}</div><span class="pill green">Active</span></div><h3>${esc(u.name)}</h3><p class="muted">${esc(u.phone)}</p><div>${(u.permissions || []).map(p => `<span class="pill permission-pill">${esc(permissionLabel(p))}</span>`).join('')}</div><button class="btn btn-soft btn-block" data-edit-assistant="${u.id}">Edit account & permissions</button></article>`).join('')}</div>`;

studentViews.profile = adminViews.profile = () => head('ACCOUNT', 'My Profile', 'Update your photo and password. Student access is linked to one device.') + `<div class="grid"><article class="card span-5 profile-card"><div class="profile-photo ${currentUser.photo ? 'has-photo' : ''}" style="${currentUser.photo ? `background-image:url(${currentUser.photo})` : ''}">${currentUser.photo ? '' : initials(currentUser.name)}</div><h2>${esc(currentUser.name)}</h2><p class="muted">${esc(currentUser.phone)} · ${esc(currentUser.role)}</p><label class="btn btn-soft">Upload photo<input id="profilePhoto" type="file" accept="image/*" hidden /></label></article><article class="card span-7"><form class="modal-form" id="profileForm"><label>Name<input name="name" value="${esc(currentUser.name)}" required /></label><label>Current password<input name="current" type="password" required /></label><label>New password<input name="password" type="password" minlength="6" required /></label><button class="btn btn-primary">Save profile</button></form>${currentUser.role === 'student' ? `<div class="info-note profile-device"><strong>One-device access</strong><p>This account is linked to the current device. The admin can reset the link.</p></div>` : ''}</article></div>`;
assistantViews.profile = adminViews.profile;

function assignmentChecks(item) {
    return db.courses.map(c => `<label class="checkline"><input type="checkbox" name="courseIds" value="${c.id}" ${(item?.courseIds || [item?.courseId]).includes(c.id) ? 'checked' : ''} /> ${esc(c.title)}</label>`).join('')
}
function pdfEditor(id) {
    const p = id ? db.pdfs.find(x => x.id === id) : null;
    openModal(`<h2>${p ? 'Edit PDF' : 'Upload PDF'}</h2><form class="modal-form" id="pdfEditor"><label>PDF name<input name="title" value="${esc(p?.title || '')}" required /></label><label>PDF file<input name="file" type="file" accept="application/pdf" ${p ? '' : 'required'} /></label><label>Show in courses</label><div class="perm-grid">${assignmentChecks(p)}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#pdfEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , file = fd.get('file');
        if (p) {
            p.title = fd.get('title');
            p.courseIds = fd.getAll('courseIds');
            if (file?.size)
                p.url = URL.createObjectURL(file)
        } else
            db.pdfs.push({
                id: uid('p'),
                title: fd.get('title'),
                pages: '—',
                courseIds: fd.getAll('courseIds'),
                url: URL.createObjectURL(file),
                fileName: file.name
            });
        saveDB();
        closeModal();
        renderApp('pdf_admin');
        toast('PDF saved and course visibility updated')
    }
}
function mockEditor(id) {
    const e = id ? db.exams.find(x => x.id === id) : null;
    openModal(`<h2>${e ? 'Edit Mock' : 'Create Mock'}</h2><form class="modal-form" id="mockEditor"><label>Mock title<input name="title" value="${esc(e?.title || '')}" required /></label><div class="field-grid"><label>Minutes per module<input name="minutes" type="number" value="${e?.minutes || 32}" required /></label><label>Break minutes<input name="breakMinutes" type="number" value="${e?.breakMinutes || 10}" required /></label></div><label>Show in courses</label><div class="perm-grid">${assignmentChecks(e)}</div>${e ? `<div class="editor-list">${e.modules.flatMap( (m, mi) => m.map( (q, qi) => `<button type="button" class="editor-question" data-edit-mock-question="${mi}:${qi}"><b>M${mi + 1} · Q${qi + 1}</b><span>${esc(q.prompt)}</span></button>`)).join('')}</div><button class="btn btn-soft" type="button" id="addMockQuestion">Add question</button>` : ''}${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    if (e) {
        $$('[data-edit-mock-question]').forEach(b => b.onclick = () => {
            const [m,q] = b.dataset.editMockQuestion.split(':').map(Number);
            questionEditor('mock', e.id, e.modules[m][q], m, q)
        }
        );
        $('#addMockQuestion').onclick = () => questionEditor('mock', e.id)
    }
    $('#mockEditor').onsubmit = ev => {
        ev.preventDefault();
        const fd = new FormData(ev.target);
        if (e) {
            e.title = fd.get('title');
            e.minutes = +fd.get('minutes');
            e.breakMinutes = +fd.get('breakMinutes');
            e.courseIds = fd.getAll('courseIds')
        } else
            db.exams.push({
                id: uid('e'),
                title: fd.get('title'),
                minutes: +fd.get('minutes'),
                breakMinutes: +fd.get('breakMinutes'),
                courseIds: fd.getAll('courseIds'),
                modules: [[], []]
            });
        saveDB();
        closeModal();
        renderApp('mock_admin');
        toast('Mock saved')
    }
}
function homeworkEditor(id) {
    const h = id ? db.homework.find(x => x.id === id) : null;
    openModal(`<h2>${h ? 'Edit Homework' : 'Create Homework'}</h2><form class="modal-form" id="homeworkEditor"><label>Title<input name="title" value="${esc(h?.title || '')}" required /></label><div class="field-grid"><label>Session label<input name="session" value="${esc(h?.session || '')}" required /></label><label>Due date<input name="due" type="date" value="${h?.due || ''}" required /></label></div><label>Show in courses</label><div class="perm-grid">${assignmentChecks(h)}</div>${h ? `<div class="editor-list">${h.questions.map( (q, i) => `<button type="button" class="editor-question" data-edit-hw-question="${i}"><b>Q${i + 1}</b><span>${esc(q.prompt)}</span></button>`).join('')}</div><button class="btn btn-soft" type="button" id="addHwQuestion">Add question</button>` : ''}${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    if (h) {
        $$('[data-edit-hw-question]').forEach(b => b.onclick = () => questionEditor('homework', h.id, h.questions[+b.dataset.editHwQuestion], 0, +b.dataset.editHwQuestion));
        $('#addHwQuestion').onclick = () => questionEditor('homework', h.id)
    }
    $('#homeworkEditor').onsubmit = ev => {
        ev.preventDefault();
        const fd = new FormData(ev.target);
        if (h) {
            h.title = fd.get('title');
            h.session = fd.get('session');
            h.due = fd.get('due');
            h.courseIds = fd.getAll('courseIds')
        } else
            db.homework.push({
                id: uid('h'),
                title: fd.get('title'),
                session: fd.get('session'),
                due: fd.get('due'),
                courseIds: fd.getAll('courseIds'),
                questions: []
            });
        saveDB();
        closeModal();
        renderApp('homework_admin');
        toast('Homework saved')
    }
}
function questionEditor(kind, parentId, q=null, moduleIndex=0, questionIndex=-1) {
    const isBank = kind === 'qbank';
    openModal(`<h2>${q ? 'Edit' : 'Add'} ${isBank ? 'Question Bank' : 'question'}</h2><form class="modal-form" id="questionEditor">${kind === 'mock' ? `<label>Module<select name="module"><option value="0" ${moduleIndex === 0 ? 'selected' : ''}>Module 1</option><option value="1" ${moduleIndex === 1 ? 'selected' : ''}>Module 2</option></select></label>` : ''}<label>Passage<textarea name="passage" required>${esc(q?.passage || '')}</textarea></label><label>Question<textarea name="prompt" required>${esc(q?.prompt || '')}</textarea></label><div class="field-grid">${[0, 1, 2, 3].map(i => `<label>Choice ${String.fromCharCode(65 + i)}<input name="choice${i}" value="${esc(q?.choices?.[i] || '')}" required /></label>`).join('')}</div><label>Correct answer<select name="correct">${[0, 1, 2, 3].map(i => `<option value="${i}" ${q?.correct === i ? 'selected' : ''}>${String.fromCharCode(65 + i)}</option>`).join('')}</select></label><div class="field-grid"><label>Domain<select name="domain">${Object.keys(qbSkillGroups).map(x => `<option ${q?.domain === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>Skill<input name="skill" value="${esc(q?.skill || '')}" required /></label></div><div class="field-grid"><label>Difficulty<select name="difficulty">${['Easy', 'Medium', 'Hard'].map(x => `<option ${q?.difficulty === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>SAT type<select name="satType"><option>Reading & Writing</option></select></label></div><label>Explanation<textarea name="explanation" required>${esc(q?.explanation || '')}</textarea></label><div class="field-grid"><label>Optional image<input name="image" type="file" accept="image/*" /></label><label>Image layout<select name="mediaStyle"><option value="wide">Wide</option><option value="square" ${q?.mediaStyle === 'square' ? 'selected' : ''}>Square card</option></select></label></div>${isBank ? `<label>Show in courses</label><div class="perm-grid">${assignmentChecks(q)}</div>` : ''}${actions()}</form>`);
    $('.modal-card').classList.add('wide-modal');
    $('[data-close-now]').onclick = () => {
        closeModal();
        $('.modal-card').classList.remove('wide-modal')
    }
    ;
    $('#questionEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , img = fd.get('image')
          , data = {
            id: q?.id || uid('q'),
            passage: fd.get('passage'),
            prompt: fd.get('prompt'),
            choices: [0, 1, 2, 3].map(i => fd.get(`choice${i}`)),
            correct: +fd.get('correct'),
            domain: fd.get('domain'),
            skill: fd.get('skill'),
            difficulty: fd.get('difficulty'),
            satType: fd.get('satType'),
            explanation: fd.get('explanation'),
            mediaStyle: fd.get('mediaStyle'),
            image: img?.size ? URL.createObjectURL(img) : (q?.image || ''),
            courseIds: isBank ? fd.getAll('courseIds') : (q?.courseIds || [])
        };
        if (isBank) {
            if (q)
                Object.assign(q, data);
            else
                db.qbank.push(data)
        } else if (kind === 'mock') {
            const parent = db.exams.find(x => x.id === parentId)
              , target = +fd.get('module');
            if (q && questionIndex >= 0) {
                parent.modules[moduleIndex].splice(questionIndex, 1);
                parent.modules[target].push(data)
            } else
                parent.modules[target].push(data)
        } else {
            const parent = db.homework.find(x => x.id === parentId);
            if (q && questionIndex >= 0)
                parent.questions[questionIndex] = data;
            else
                parent.questions.push(data)
        }
        saveDB();
        closeModal();
        $('.modal-card').classList.remove('wide-modal');
        renderApp(isBank ? 'qbank_admin' : kind === 'mock' ? 'mock_admin' : 'homework_admin');
        toast('Question saved')
    }
}
function zoomEditor(id) {
    const z = id ? db.zoom.find(x => x.id === id) : null;
    openModal(`<h2>${z ? 'Edit Zoom' : 'Add Zoom'}</h2><form class="modal-form" id="zoomEditor"><label>Title<input name="title" value="${esc(z?.title || '')}" required /></label><div class="field-grid"><label>Date<input name="date" type="date" value="${z?.date || ''}" required /></label><label>Time<input name="time" type="time" value="${z?.time || ''}" required /></label></div><label>Zoom link<input name="zoom" type="url" value="${esc(z?.zoom || '')}" required /></label><label>Show in courses</label><div class="perm-grid">${assignmentChecks(z)}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#zoomEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , d = {
            title: fd.get('title'),
            date: fd.get('date'),
            time: fd.get('time'),
            zoom: fd.get('zoom'),
            courseIds: fd.getAll('courseIds')
        };
        z ? Object.assign(z, d) : db.zoom.push({
            id: uid('z'),
            ...d
        });
        saveDB();
        closeModal();
        renderApp('zoom_admin')
    }
}
function recordingEditor() {
    openModal(`<h2>Add recorded session</h2><form class="modal-form" id="recordingEditor"><label>Title<input name="title" required /></label><label>Date<input name="date" type="date" required /></label><label>Video file<input name="file" type="file" accept="video/*" required /></label><label>Show in courses</label><div class="perm-grid">${assignmentChecks(null)}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#recordingEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , f = fd.get('file');
        db.sessions.push({
            id: uid('s'),
            title: fd.get('title'),
            date: fd.get('date'),
            time: '',
            recording: URL.createObjectURL(f),
            ended: true,
            courseIds: fd.getAll('courseIds')
        });
        saveDB();
        closeModal();
        renderApp('session_admin')
    }
}
function assistantEditor(id) {
    const u = db.users.find(x => x.id === id)
      , perms = ['ask', 'manage_pdfs', 'add_mocks', 'add_hw', 'manage_qbank', 'manage_zoom', 'add_session_rec', 'review_questions'];
    openModal(`<h2>Edit assistant</h2><form class="modal-form" id="assistantEditor"><label>Name<input name="name" value="${esc(u.name)}" required /></label><label>Phone<input name="phone" value="${esc(u.phone)}" required /></label><label>Permissions</label><div class="perm-grid">${perms.map(p => `<label class="perm"><input type="checkbox" name="permissions" value="${p}" ${(u.permissions || []).includes(p) ? 'checked' : ''} /> ${esc(permissionLabel(p))}</label>`).join('')}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#assistantEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        u.name = fd.get('name');
        u.phone = fd.get('phone');
        u.permissions = fd.getAll('permissions');
        saveDB();
        closeModal();
        setupApp();
        renderApp('assistants')
    }
}
function contactEditor(index) {
    const c = Number.isInteger(index) ? db.settings.contacts[index] : null;
    openModal(`<h2>${c ? 'Edit' : 'Add'} contact link</h2><form class="modal-form" id="contactEditor"><label>Type<select name="type"><option value="whatsapp" ${c?.type === 'whatsapp' ? 'selected' : ''}>WhatsApp</option><option value="facebook" ${c?.type === 'facebook' ? 'selected' : ''}>Facebook</option><option value="telegram" ${c?.type === 'telegram' ? 'selected' : ''}>Telegram</option><option value="other" ${c?.type === 'other' ? 'selected' : ''}>Other</option></select></label><label>Button label<input name="label" value="${esc(c?.label || '')}" required /></label><label>Number or link<input name="value" value="${esc(c?.value || '')}" required /></label><label class="checkline"><input type="checkbox" name="show" ${c?.show !== false ? 'checked' : ''} /> Show on sign in</label>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#contactEditor').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target)
          , d = {
            id: c?.id || uid('ct'),
            type: fd.get('type'),
            label: fd.get('label'),
            value: fd.get('value'),
            show: fd.get('show') === 'on'
        };
        c ? Object.assign(c, d) : db.settings.contacts.push(d);
        saveDB();
        syncPublic();
        closeModal();
        renderApp('contacts')
    }
}

let homeworkState = null;
startHomework = async function(id) {
    const h = db.homework.find(x => x.id === id);
    if (!h?.questions?.length)
        return toast('This homework has no questions yet');
    homeworkState = {
        homework: h,
        index: 0,
        answers: {}
    };
    await enterFocusMode('homework');
    $('#modal').classList.add('hidden');
    renderHomeworkPractice()
}
;
function renderHomeworkPractice() {
    const s = homeworkState
      , h = s.homework
      , q = h.questions[s.index]
      , ans = s.answers[s.index];
    $('#examShell').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    $('#examShell').innerHTML = `<div class="practice-app exam-practice homework-expanded"><header class="practice-header"><div><strong>${esc(h.title)}</strong><button class="directions-btn">Homework · ${esc(h.session)}</button></div><div class="practice-center"><b>${s.index + 1} / ${h.questions.length}</b><button>Full screen</button></div><div class="practice-tools"><button data-highlight>▤<span>Highlighter</span></button><button data-exit-homework>↗<span>Exit</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern exam-watermark">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage" id="homeworkPassage"><p>${esc(q.passage)}</p>${q.image ? `<img class="question-media ${q.mediaStyle === 'square' ? 'square' : ''}" src="${esc(q.image)}" />` : ''}</section><section class="practice-question"><div class="question-label"><b>${s.index + 1}</b><span>${esc(q.skill)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, i) => `<button class="choice ${ans === i ? 'selected' : ''}" data-hw-choice="${i}"><i>${String.fromCharCode(65 + i)}</i><span>${esc(c)}</span></button>`).join('')}</div></section></div><div class="question-dock">${h.questions.map( (x, i) => `<button class="${s.answers[i] !== undefined ? 'done' : ''} ${i === s.index ? 'active' : ''}" data-hw-jump="${i}">${i + 1}</button>`).join('')}</div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">Question ${s.index + 1} of ${h.questions.length}</div><div><button class="nav-pill pale" data-hw-prev ${s.index === 0 ? 'disabled' : ''}>Back</button><button class="nav-pill" data-hw-next>${s.index === h.questions.length - 1 ? 'Submit' : 'Next'}</button></div></footer></div>`;
    $$('[data-hw-choice]').forEach(b => b.onclick = () => {
        s.answers[s.index] = +b.dataset.hwChoice;
        renderHomeworkPractice()
    }
    );
    $$('[data-hw-jump]').forEach(b => b.onclick = () => {
        s.index = +b.dataset.hwJump;
        renderHomeworkPractice()
    }
    );
    $('[data-hw-prev]').onclick = () => {
        s.index--;
        renderHomeworkPractice()
    }
    ;
    $('[data-hw-next]').onclick = () => {
        if (s.index < h.questions.length - 1) {
            s.index++;
            renderHomeworkPractice()
        } else
            submitHomework()
    }
    ;
    $('[data-highlight]').onclick = applyHighlight;
    $('[data-exit-homework]').onclick = () => {
        if (confirm('Exit this homework attempt?'))
            closePracticeShell()
    }
}
function submitHomework() {
    const s = homeworkState
      , h = s.homework
      , wrong = [];
    let correct = 0;
    h.questions.forEach( (q, i) => {
        if (s.answers[i] === q.correct)
            correct++;
        else {
            wrong.push(q);
            if (!db.mistakes.some(m => m.userId === currentUser.id && m.questionId === q.id))
                db.mistakes.push({
                    userId: currentUser.id,
                    questionId: q.id,
                    skill: q.skill,
                    prompt: q.prompt
                })
        }
    }
    );
    const score = Math.round(correct / Math.max(1, h.questions.length) * 100)
      , attempt = db.results.filter(r => r.userId === currentUser.id && r.type === 'homework' && r.itemId === h.id).length + 1;
    db.results.push({
        id: uid('r'),
        userId: currentUser.id,
        type: 'homework',
        itemId: h.id,
        title: h.title,
        score,
        total: 100,
        date: new Date().toISOString().slice(0, 10),
        attempt
    });
    saveDB();
    closePracticeShell();
    openModal(`<h2>Homework submitted · ${score}%</h2><p class="muted">${correct} of ${h.questions.length} correct.</p><div class="result-review">${wrong.map(q => `<div><strong>${esc(q.prompt)}</strong><p>${esc(q.explanation)}</p></div>`).join('') || '<div class="info-note"><strong>Perfect work</strong><p>Every answer is correct.</p></div>'}</div><div class="modal-actions"><button class="btn btn-primary" data-close-now>Done</button></div>`);
    $('[data-close-now]').onclick = closeModal
}
function closePracticeShell() {
    clearInterval(examTimer);
    examState = null;
    homeworkState = null;
    fullscreenGuard = false;
    $('#examShell').classList.add('hidden');
    $('#examShell').innerHTML = '';
    document.body.style.overflow = '';
    exitFocusMode()
}

confirmExam = function(id) {
    const e = db.exams.find(x => x.id === id);
    if (!e?.modules?.[0]?.length || !e?.modules?.[1]?.length)
        return toast('The admin must add questions to both modules first');
    openModal(`<h2>${esc(e.title)}</h2><div class="detail-grid"><div><span>Modules</span><strong>2</strong></div><div><span>Time</span><strong>${e.minutes} min each</strong></div><div><span>Break</span><strong>${e.breakMinutes} min</strong></div></div><div class="info-note"><strong>Bluebook-style tools</strong><p>Highlighter, question navigator, back/next, timer and final explanations are included.</p></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><button class="btn btn-primary" id="beginExam">Start Full Screen</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $('#beginExam').onclick = () => {
        closeModal();
        startExam(e)
    }
}
;
startExam = async function(exam) {
    examState = {
        exam,
        module: 0,
        index: 0,
        answers: [{}, {}],
        seconds: exam.minutes * 60,
        violations: 0,
        breaking: false
    };
    $('#examShell').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    try {
        await document.documentElement.requestFullscreen?.();
        fullscreenGuard = !!document.fullscreenElement
    } catch {
        fullscreenGuard = false
    }
    renderExam();
    startTimer()
}
;
renderExam = function() {
    const s = examState
      , e = s.exam
      , mod = e.modules[s.module]
      , q = mod[s.index]
      , ans = s.answers[s.module][s.index];
    $('#examShell').innerHTML = `<div class="practice-app exam-practice"><header class="practice-header"><div><strong>Module ${s.module + 1}: Reading and Writing</strong><button class="directions-btn">${esc(e.title)}</button></div><div class="practice-center"><b class="exam-timer" id="examTimer">${timeText(s.seconds)}</b><button>Hide</button></div><div class="practice-tools"><button data-highlight>▤<span>Highlighter</span></button><button data-exit-exam>↗<span>Exit</span></button></div></header><div class="spectrum-line"></div><div class="watermark-pattern exam-watermark">${watermarkTiles()}</div><div class="practice-split"><section class="practice-passage" id="examPassage"><p>${esc(q.passage)}</p>${q.image ? `<img class="question-media ${q.mediaStyle === 'square' ? 'square' : ''}" src="${esc(q.image)}" />` : ''}</section><section class="practice-question"><div class="question-label"><b>${s.index + 1}</b><button data-mark-review>♡ Mark for Review</button><span>${esc(q.skill)}</span></div><h3>${esc(q.prompt)}</h3><div class="choice-list">${q.choices.map( (c, i) => `<button class="choice ${ans === i ? 'selected' : ''}" data-exam-answer="${i}"><i>${String.fromCharCode(65 + i)}</i><span>${esc(c)}</span></button>`).join('')}</div></section></div><div class="question-dock">${mod.map( (x, i) => `<button class="${s.answers[s.module][i] !== undefined ? 'done' : ''} ${i === s.index ? 'active' : ''}" data-exam-jump="${i}">${i + 1}</button>`).join('')}</div><footer class="practice-footer"><strong>${esc(currentUser.name)}</strong><div class="question-progress">Module ${s.module + 1} · Question ${s.index + 1} of ${mod.length}</div><div><button class="nav-pill pale" data-exam-prev ${s.index === 0 ? 'disabled' : ''}>Back</button><button class="nav-pill" data-exam-next>${s.index === mod.length - 1 ? (s.module === 0 ? 'Finish Module' : 'Submit Mock') : 'Next'}</button></div></footer></div>`;
    $$('[data-exam-answer]').forEach(b => b.onclick = () => {
        s.answers[s.module][s.index] = +b.dataset.examAnswer;
        renderExam()
    }
    );
    $$('[data-exam-jump]').forEach(b => b.onclick = () => {
        s.index = +b.dataset.examJump;
        renderExam()
    }
    );
    $('[data-exam-prev]').onclick = () => {
        s.index--;
        renderExam()
    }
    ;
    $('[data-exam-next]').onclick = () => {
        if (s.index < mod.length - 1) {
            s.index++;
            renderExam()
        } else
            finishModule()
    }
    ;
    $('[data-highlight]').onclick = applyHighlight;
    $('[data-exit-exam]').onclick = () => {
        if (confirm('Exit this mock? Your attempt will not be submitted.'))
            closePracticeShell()
    }
    ;
    $('[data-mark-review]').onclick = () => toast('Question marked for review');
    $('#examShell').oncontextmenu = e => e.preventDefault();
    $('#examShell').oncopy = e => e.preventDefault()
}
;
function applyHighlight() {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed)
        return toast('Select text in the passage first');
    try {
        const range = sel.getRangeAt(0)
          , mark = document.createElement('mark');
        mark.className = 'student-highlight';
        range.surroundContents(mark);
        sel.removeAllRanges()
    } catch {
        toast('Select a smaller text section')
    }
}
finishExam = function() {
    const s = examState
      , wrong = [];
    clearInterval(examTimer);
    let correct = 0
      , total = 0;
    s.exam.modules.forEach( (mod, mi) => mod.forEach( (q, qi) => {
        total++;
        if (s.answers[mi][qi] === q.correct)
            correct++;
        else {
            wrong.push(q);
            if (!db.mistakes.some(m => m.userId === currentUser.id && m.questionId === q.id))
                db.mistakes.push({
                    userId: currentUser.id,
                    questionId: q.id,
                    skill: q.skill,
                    prompt: q.prompt
                })
        }
    }
    ));
    const score = 200 + Math.round((correct / Math.max(1, total)) * 600 / 10) * 10;
    db.results.push({
        id: uid('r'),
        userId: currentUser.id,
        type: 'mock',
        itemId: s.exam.id,
        title: s.exam.title,
        score,
        total: 800,
        date: new Date().toISOString().slice(0, 10),
        violations: s.violations
    });
    saveDB();
    closePracticeShell();
    openModal(`<h2>Mock submitted · ${score}/800</h2><p class="muted">${correct} of ${total} correct. Review every missed item below.</p><div class="result-review">${wrong.map(q => `<div><strong>${esc(q.prompt)}</strong><p><b>Correct answer:</b> ${esc(q.choices[q.correct])}</p><p>${esc(q.explanation)}</p></div>`).join('') || '<div class="info-note"><strong>Perfect score</strong><p>No mistakes to review.</p></div>'}</div><div class="modal-actions"><button class="btn btn-primary" data-close-now>Done</button></div>`);
    $('.modal-card').classList.add('wide-modal');
    $('[data-close-now]').onclick = () => {
        closeModal();
        $('.modal-card').classList.remove('wide-modal')
    }
}
;

function rateQuestion(id) {
    const old = db.questionReviews.find(r => r.userId === currentUser.id && r.questionId === id);
    openModal(`<h2>Close & rate this question</h2><p class="muted">Your teacher will see that it is solved and how useful it was.</p><div class="star-picker">${[1, 2, 3, 4, 5].map(n => `<button data-stars="${n}" class="${old?.stars === n ? 'active' : ''}">${'★'.repeat(n)}</button>`).join('')}</div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button></div>`);
    $('[data-close-now]').onclick = closeModal;
    $$('[data-stars]').forEach(b => b.onclick = () => {
        const stars = +b.dataset.stars;
        if (old)
            old.stars = stars;
        else
            db.questionReviews.push({
                id: uid('qr'),
                userId: currentUser.id,
                questionId: id,
                status: 'solved',
                stars,
                date: new Date().toISOString().slice(0, 10)
            });
        saveDB();
        closeModal();
        toast('Question closed and rating sent');
        renderApp('qbank')
    }
    )
}

const bindDynamicV6 = bindDynamic;
bindDynamic = function() {
    bindDynamicV6();
    $$('#appContent [data-nav]').forEach(b => b.onclick = () => {
        if (b.dataset.nav === 'courses' && currentUser.role === 'student') {
            selectedCourseId = '';
            sessionStorage.removeItem('satHubCourse');
            setupApp()
        }
        navigate(b.dataset.nav)
    }
    );
    $$('[data-open-weak]').forEach(b => b.onclick = () => {
        const q = db.qbank.find(x => x.id === b.dataset.openWeak);
        if (q) {
            qbankState = {
                mode: 'practice',
                skill: q.skill,
                difficulty: 'All'
            };
            qIndex = Math.max(0, activeQpool().findIndex(x => x.id === q.id));
            enterFocusMode('qbank');
            navigate('qbank')
        }
    }
    );
    $$('[data-start-topic]').forEach(b => b.onclick = () => {
        qbankState = {
            mode: 'practice',
            skill: b.dataset.startTopic,
            difficulty: 'All'
        };
        qIndex = 0;
        enterFocusMode('qbank');
        renderApp('qbank')
    }
    );
    $$('[data-qjump]').forEach(b => b.onclick = () => {
        qIndex = +b.dataset.qjump;
        renderApp('qbank')
    }
    );
    $$('[data-qprev]').forEach(b => b.onclick = () => {
        qIndex--;
        renderApp('qbank')
    }
    );
    $$('[data-qnext]').forEach(b => b.onclick = () => {
        qIndex++;
        renderApp('qbank')
    }
    );
    $$('[data-exit-qbank]').forEach(b => b.onclick = () => {
        exitFocusMode();
        qbankState = {
            mode: 'browse',
            domain: '',
            difficulty: ''
        };
        renderApp('qbank')
    }
    );
    $$('[data-highlight]').forEach(b => b.onclick = applyHighlight);
    $$('[data-rate-question]').forEach(b => b.onclick = () => rateQuestion(b.dataset.rateQuestion));
    $$('[data-qfilter]').forEach(s => {
        const key = s.dataset.qfilter;
        s.onchange = () => {
            const value = s.value.replace(' difficulties', '').replace(' questions', '').replace(' order', '');
            qbFilters[key] = value.startsWith('All') ? 'All' : value;
            toast(`${key} filter updated`)
        }
    }
    );
    $$('[data-new-pdf]').forEach(b => b.onclick = () => pdfEditor());
    $$('[data-edit-pdf]').forEach(b => b.onclick = () => pdfEditor(b.dataset.editPdf));
    $$('[data-preview-pdf]').forEach(b => b.onclick = () => openPdf(b.dataset.previewPdf));
    const ps = $('#pdfSearch');
    if (ps)
        ps.oninput = () => {
            $('#pdfAdminList').innerHTML = pdfAdminRows(ps.value);
            bindDynamic()
        }
        ;
    $$('[data-new-mock]').forEach(b => b.onclick = () => mockEditor());
    $$('[data-edit-mock]').forEach(b => b.onclick = () => mockEditor(b.dataset.editMock));
    $$('[data-new-homework]').forEach(b => b.onclick = () => homeworkEditor());
    $$('[data-edit-homework]').forEach(b => b.onclick = () => homeworkEditor(b.dataset.editHomework));
    $$('[data-add-qbank]').forEach(b => b.onclick = () => questionEditor('qbank'));
    $$('[data-edit-qbank]').forEach(b => b.onclick = () => questionEditor('qbank', null, db.qbank.find(q => q.id === b.dataset.editQbank)));
    $$('[data-new-zoom]').forEach(b => b.onclick = () => zoomEditor());
    $$('[data-edit-zoom]').forEach(b => b.onclick = () => zoomEditor(b.dataset.editZoom));
    $$('[data-new-recording]').forEach(b => b.onclick = recordingEditor);
    $$('[data-edit-assistant]').forEach(b => b.onclick = () => assistantEditor(b.dataset.editAssistant));
    $$('[data-add-contact]').forEach(b => b.onclick = () => contactEditor());
    $$('[data-edit-contact]').forEach(b => b.onclick = () => contactEditor(+b.dataset.editContact));
    $$('[data-toggle-contact]').forEach(b => b.onclick = () => {
        const c = db.settings.contacts[+b.dataset.toggleContact];
        c.show = !c.show;
        saveDB();
        syncPublic();
        renderApp('contacts')
    }
    );
    $$('[data-reset-device]').forEach(b => b.onclick = () => {
        const u = db.users.find(x => x.id === b.dataset.resetDevice);
        u.boundDevice = '';
        saveDB();
        renderApp('overview');
        toast('Device link reset')
    }
    );
    const pf = $('#profileForm');
    if (pf)
        pf.onsubmit = e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            if (fd.get('current') !== currentUser.password)
                return toast('Current password is incorrect');
            currentUser.name = fd.get('name');
            currentUser.password = fd.get('password');
            saveDB();
            setupApp();
            renderApp('profile');
            toast('Profile updated')
        }
        ;
    const photo = $('#profilePhoto');
    if (photo)
        photo.onchange = e => {
            const f = e.target.files[0];
            if (!f)
                return;
            currentUser.photo = URL.createObjectURL(f);
            saveDB();
            setupApp();
            renderApp('profile')
        }
        ;
}
;

const openZoomV6 = openZoom;
openZoom = function(id) {
    const s = db.zoom.find(x => x.id === id) || db.sessions.find(x => x.id === id);
    if (!s)
        return;
    openModal(`<h2>Open Zoom meeting</h2><p class="muted">${esc(s.title)} · ${formatDate(s.date)} at ${esc(s.time)}</p><div class="info-note"><strong>Secure handoff</strong><p>The meeting link appears only after sign in.</p></div><div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><a class="btn btn-primary" href="${esc(s.zoom)}" target="_blank" rel="noopener">Open Zoom</a></div>`);
    $('[data-close-now]').onclick = closeModal
}
;

const addModalV6 = addModal;
addModal = function(type) {
    if (type !== 'assistant')
        return addModalV6(type);
    const perms = ['ask', 'manage_pdfs', 'add_mocks', 'add_hw', 'manage_qbank', 'manage_zoom', 'add_session_rec', 'review_questions'];
    openModal(`<h2>Create assistant account</h2><form class="modal-form" id="addAssistantV7"><label>Name<input name="name" required /></label><label>Phone<input name="phone" required /></label><label>Temporary password<input name="password" minlength="6" required /></label><label>Permissions</label><div class="perm-grid">${perms.map(p => `<label class="perm"><input type="checkbox" name="permissions" value="${p}" /> ${esc(permissionLabel(p))}</label>`).join('')}</div>${actions()}</form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#addAssistantV7').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        db.users.push({
            id: uid('u'),
            role: 'assistant',
            name: fd.get('name'),
            phone: fd.get('phone'),
            password: fd.get('password'),
            approved: true,
            permissions: fd.getAll('permissions')
        });
        saveDB();
        closeModal();
        renderApp('assistants')
    }
}
;

function syncPublic() {
    $('#publicBrand').textContent = db.settings.brand;
    const parts = db.settings.heroTitle.split('.').map(x => x.trim()).filter(Boolean);
    $('#heroTitle').innerHTML = parts.length > 1 ? `${esc(parts[0])}.<br><em>${esc(parts.slice(1).join('. '))}.</em>` : esc(db.settings.heroTitle);
    $('#heroText').textContent = db.settings.heroText;
    $('#applyCourse').innerHTML = '<option value="">Choose a course</option>' + db.courses.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('');
    const box = $('#contactLinks');
    if (box)
        box.innerHTML = db.settings.contacts.filter(c => c.show).map(c => `<a class="contact-chip ${esc(c.type)}" href="${esc(contactHref(c))}" target="_blank" rel="noopener"><b>${c.type === 'whatsapp' ? 'WA' : c.type === 'facebook' ? 'f' : c.type === 'telegram' ? 'TG' : '↗'}</b>${esc(c.label)}</a>`).join('')
}

/* v8: Bluebook question drawer, in-tab Question Bank, skill plan and real client-side PDF text extraction. */
let questionDrawerOpen = false
  , qbFilterOpen = '';
const countryFlags = {
    '20': '🇪🇬',
    '966': '🇸🇦',
    '971': '🇦🇪',
    '965': '🇰🇼',
    '974': '🇶🇦'
};
function countryFlag(code) {
    return countryFlags[String(code)] || '🌍'
}

openPdf = function(id) {
    const p = db.pdfs.find(x => x.id === id);
    if (!p?.url)
        return toast('The admin has not uploaded this PDF file yet');
    const opened = window.open(p.url, '_blank', 'noopener,noreferrer');
    if (!opened)
        toast('Allow pop-ups to open the PDF in a new tab')
}
;

openRecording = function(id) {
    const s = db.sessions.find(x => x.id === id)
      , src = s?.recording || '';
    openModal(`<h2>${esc(s?.title || 'Recorded Session')}</h2><div class="video-wrap protected-video"><div class="video-watermark-pattern">${watermarkTiles()}</div>${src ? `<video id="lessonVideo" src="${esc(src)}" controls controlsList="nodownload"></video>` : `<div class="video-placeholder"><strong>Recording player ready</strong><p>Upload the protected video from Recorded Sessions.</p></div>`}</div><div class="speed-row">${[.5, 1, 1.5, 2, 3].map(n => `<button data-speed="${n}" class="${n === 1 ? 'active' : ''}">${n}×</button>`).join('')}<button data-full-video>Full screen</button></div>`);
    $('.modal-card').classList.add('wide-modal');
    $$('[data-speed]').forEach(b => b.onclick = () => {
        const v = $('#lessonVideo');
        if (v)
            v.playbackRate = +b.dataset.speed;
        $$('[data-speed]').forEach(x => x.classList.toggle('active', x === b))
    }
    );
    $('[data-full-video]').onclick = () => $('.video-wrap').requestFullscreen?.()
}
;

function filteredBankV8() {
    let pool = db.qbank.filter(q => belongs(q));
    const reviewed = new Set(db.questionReviews.filter(r => r.userId === currentUser.id).map(r => r.questionId));
    if (qbFilters.difficulty && qbFilters.difficulty !== 'All')
        pool = pool.filter(q => q.difficulty === qbFilters.difficulty);
    if (qbFilters.status === 'Completed')
        pool = pool.filter(q => reviewed.has(q.id));
    if (qbFilters.status === 'Not completed')
        pool = pool.filter(q => !reviewed.has(q.id));
    const rank = {
        Easy: 1,
        Medium: 2,
        Hard: 3
    };
    if (qbFilters.order === 'Hard first')
        pool.sort( (a, b) => rank[b.difficulty] - rank[a.difficulty]);
    if (qbFilters.order === 'Easy first')
        pool.sort( (a, b) => rank[a.difficulty] - rank[b.difficulty]);
    return pool
}
function filterPopoverV8() {
    if (!qbFilterOpen)
        return '';
    const specs = {
        difficulty: ['Easy', 'Medium', 'Hard'],
        status: ['Completed', 'Not completed'],
        order: ['Normal', 'Hard first', 'Easy first']
    }
      , title = {
        difficulty: 'Difficulty',
        status: 'Completion',
        order: 'Order'
    };
    return `<div class="qb-filter-popover"><strong>${title[qbFilterOpen]}</strong>${specs[qbFilterOpen].map(v => `<button data-set-filter="${qbFilterOpen}:${v}"><span class="filter-radio ${qbFilters[qbFilterOpen] === v ? 'selected' : ''}"></span>${v === 'Hard' ? 'Hard & Challenge' : v}</button>`).join('')}<button class="filter-clear" data-set-filter="${qbFilterOpen}:All">Clear filter</button></div>`
}
function renderQbankIndexV8() {
    const bank = filteredBankV8()
      , all = db.qbank.filter(q => belongs(q))
      , reviewed = new Set(db.questionReviews.filter(r => r.userId === currentUser.id).map(r => r.questionId));
    return `<div class="qb-index qbank-tab-view"><button class="qb-back" data-nav="courses">‹ Back to Question Bank</button>${head('READING & WRITING', 'Question Bank', 'Choose topics and practice without leaving this tab.')}<div class="qb-filter-wrap"><div class="qb-filters"><button class="${qbFilterOpen === 'difficulty' ? 'active' : ''}" data-open-filter="difficulty">▥ ${qbFilters.difficulty === 'All' ? 'Difficulty' : qbFilters.difficulty}⌄</button><button class="${qbFilterOpen === 'status' ? 'active' : ''}" data-open-filter="status">● ${qbFilters.status === 'All' ? 'Completed' : qbFilters.status}⌄</button><button class="${qbFilterOpen === 'order' ? 'active' : ''}" data-open-filter="order">⌁ Order: ${qbFilters.order}⌄</button><button>⚑ Filters</button></div>${filterPopoverV8()}</div><div class="qb-practice-all"><div><strong>Practice all topics</strong><p>Practice ${bank.length} matching questions across Reading & Writing.</p></div><button class="btn btn-soft" data-start-topic="">Start practice</button></div><div class="qb-table-head"><span>Topic</span><span>Progress</span></div>${Object.entries(qbSkillGroups).map( ([domain,skills]) => `<section class="qb-group"><h2>${esc(domain)}</h2>${skills.map(skill => {
        const total = all.filter(q => q.skill === skill)
          , visible = bank.filter(q => q.skill === skill)
          , done = total.filter(q => reviewed.has(q.id)).length;
        return `<button class="qb-topic" data-start-topic="${esc(skill)}" ${visible.length ? '' : 'disabled'}><span class="topic-check ${done && done === total.length ? 'complete' : ''}"></span><b>${esc(skill)}</b><i><span style="width:${total.length ? done / total.length * 100 : 0}%"></span></i><em>${done}/${total.length}</em></button>`
    }
    ).join('')}</section>`).join('')}</div>`
}
const renderQbankV7 = renderQbank;
renderQbank = function() {
    return qbankState.mode === 'practice' ? renderQbankV7() : renderQbankIndexV8()
}
;

function decorateQuestionDock() {
    const dock = $('.question-dock');
    if (!dock)
        return;
    dock.classList.toggle('open', questionDrawerOpen);
    let toggle = $('.question-dock-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.className = 'question-dock-toggle';
        dock.insertAdjacentElement('afterend', toggle)
    }
    const current = (examState?.index ?? homeworkState?.index ?? qIndex) + 1
      , total = examState ? examState.exam.modules[examState.module].length : homeworkState ? homeworkState.homework.questions.length : activeQpool().length;
    toggle.textContent = `${current} of ${total} ${questionDrawerOpen ? '⌄' : '⌃'}`;
    toggle.onclick = () => {
        questionDrawerOpen = !questionDrawerOpen;
        dock.classList.toggle('open', questionDrawerOpen);
        toggle.textContent = `${current} of ${total} ${questionDrawerOpen ? '⌄' : '⌃'}`
    }
}
const renderExamV7 = renderExam;
renderExam = function() {
    renderExamV7();
    decorateQuestionDock()
}
;
const renderHomeworkPracticeV7 = renderHomeworkPractice;
renderHomeworkPractice = function() {
    renderHomeworkPracticeV7();
    decorateQuestionDock()
}
;

studentViews.weak = () => {
    const bank = db.qbank.filter(q => belongs(q))
      , mistakes = db.mistakes.filter(m => m.userId === currentUser.id)
      , reviews = db.questionReviews.filter(r => r.userId === currentUser.id);
    const skills = [...new Set(bank.map(q => q.skill))].map(skill => {
        const total = bank.filter(q => q.skill === skill).length
          , missed = mistakes.filter(m => m.skill === skill).length
          , solved = reviews.filter(r => bank.some(q => q.id === r.questionId && q.skill === skill)).length
          , mastery = Math.max(28, Math.min(100, Math.round(100 - (missed * 22) + (solved / Math.max(1, total)) * 20)))
          , needed = Math.max(0, Math.ceil((100 - mastery) / 8));
        return {
            skill,
            total,
            missed,
            mastery,
            needed
        }
    }
    ).sort( (a, b) => a.mastery - b.mastery);
    const average = Math.round(skills.reduce( (a, s) => a + s.mastery, 0) / Math.max(1, skills.length));
    return head('MASTERY PLAN', 'Weak Points', `Your current mastery is ${average}%. Work on the skills below to reach 100%.`) + `<div class="mastery-overview"><div class="mastery-ring" style="--mastery:${average * 3.6}deg"><strong>${average}%</strong><span>Overall mastery</span></div><div><h2>Your route to 100%</h2><p>Start with the lowest skill, complete the recommended questions, then check this plan again.</p></div></div><div class="skill-plan">${skills.map( (s, i) => `<article class="card skill-plan-row"><div class="skill-priority p${i < 2 ? 'high' : i < 5 ? 'medium' : 'low'}">${i < 2 ? 'Priority' : i < 5 ? 'Improve' : 'Maintain'}</div><div class="list-main"><h3>${esc(s.skill)}</h3><div class="mastery-bar"><i style="width:${s.mastery}%"></i></div><p>${s.mastery}% mastery · ${s.missed} missed · ${s.needed ? `Practice ${s.needed} more question${s.needed === 1 ? '' : 's'} to target 100%` : 'Target reached'}</p></div><button class="btn ${s.needed ? 'btn-primary' : 'btn-soft'}" data-start-topic="${esc(s.skill)}">${s.needed ? 'Practice skill' : 'Review'}</button></article>`).join('')}</div>`
}
;

adminViews.overview = () => head('ADMIN PANEL', 'Student Dashboard', 'All students, countries, courses and direct WhatsApp contact.') + `<article class="card"><div class="table-wrap"><table class="data-table"><thead><tr><th>Student</th><th>Phone</th><th>Parent</th><th>Grade</th><th>Courses</th><th>Device</th></tr></thead><tbody>${db.users.filter(u => u.role === 'student').map(u => `<tr><td><strong>${esc(u.name)}</strong></td><td><a class="wa-link" href="${whatsappLink(u.phone, u.country)}" target="_blank">${countryFlag(u.country)} ${esc(u.phone)} ↗</a></td><td><a class="wa-link" href="${whatsappLink(u.parent, u.parentCountry || u.country)}" target="_blank">${countryFlag(u.parentCountry || u.country)} ${esc(u.parent || '—')} ↗</a></td><td>${esc(u.grade || '—')}</td><td>${esc((u.courses || []).map(courseName).join(', '))}</td><td>${u.boundDevice ? `<button class="btn btn-soft btn-sm" data-reset-device="${u.id}">Reset device</button>` : 'Not linked'}</td></tr>`).join('')}</tbody></table></div></article>`;
adminViews.students = adminViews.overview;

importQbankModal = function() {
    openModal(`<div class="extract-head"><span class="pill green">1 · Upload</span><span class="pill">2 · Read PDF</span><span class="pill">3 · Auto classify</span><span class="pill">4 · Review</span></div><h2>Import full Question Bank PDF</h2><p class="muted">Upload the College Board PDF once. The browser reads every page, splits question records and detects domain, skill, difficulty, choices and answer keys when present.</p><form class="modal-form" id="realImportForm"><label>College Board PDF<input type="file" name="file" accept="application/pdf" required /></label><label>Default course<select name="courseId">${db.courses.map(c => `<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label><label class="checkline"><input type="checkbox" required /> I have permission to use this question content.</label><div class="info-note"><strong>Large files supported</strong><p>A 2,000-question PDF is processed page by page. Any uncertain record is flagged for admin review instead of being published silently.</p></div><div class="modal-actions"><button class="btn btn-soft" type="button" data-close-now>Cancel</button><button class="btn btn-primary">Extract full PDF</button></div></form>`);
    $('[data-close-now]').onclick = closeModal;
    $('#realImportForm').onsubmit = e => {
        e.preventDefault();
        const fd = new FormData(e.target);
        extractFullQuestionPdf(fd.get('file'), fd.get('courseId'))
    }
}
;
async function extractFullQuestionPdf(file, courseId) {
    $('#modalContent').innerHTML = `<div class="extract-processing"><div class="loader"></div><h2>Reading ${esc(file.name)}</h2><p class="muted" id="extractStatus">Loading the PDF engine…</p><div class="extract-progress"><i id="extractProgress"></i></div></div>`;
    try {
        const pdfjs = await import('./vendor/pdf.min.mjs');
        pdfjs.GlobalWorkerOptions.workerSrc = './vendor/pdf.worker.min.mjs';
        const pdf = await pdfjs.getDocument({
            data: await file.arrayBuffer()
        }).promise
          , pages = [];
        for (let n = 1; n <= pdf.numPages; n++) {
            const page = await pdf.getPage(n)
              , content = await page.getTextContent()
              , text = content.items.map(x => x.str).join(' ').replace(/\s+/g, ' ').trim();
            if (text)
                pages.push(text);
            const pct = Math.round(n / pdf.numPages * 100);
            $('#extractStatus').textContent = `Reading page ${n} of ${pdf.numPages}`;
            $('#extractProgress').style.width = `${pct}%`;
            await new Promise(r => setTimeout(r, 0))
        }
        const joined = pages.join('\nQuestion ID: ')
          , segments = joined.split(/(?=Question ID\s*:?)/i).filter(x => x.length > 80)
          , records = (segments.length > 1 ? segments : pages).slice(0, 2000).map( (text, i) => parseExtractedQuestion(text, i, courseId));
        reviewFullExtract(file.name, records, pdf.numPages)
    } catch (err) {
        $('#modalContent').innerHTML = `<h2>Could not read this PDF</h2><p class="muted">${esc(err.message || 'Unknown PDF error')}</p><div class="info-note"><strong>Try an original text PDF</strong><p>Scanned image-only files need OCR on the production server.</p></div><div class="modal-actions"><button class="btn btn-primary" data-close-now>Close</button></div>`;
        $('[data-close-now]').onclick = closeModal
    }
}
function parseExtractedQuestion(text, i, courseId) {
    const domains = Object.keys(qbSkillGroups)
      , domain = domains.find(d => text.toLowerCase().includes(d.toLowerCase())) || (/transition/i.test(text) ? 'Expression of Ideas' : /boundary|punctuation|convention/i.test(text) ? 'Standard English Conventions' : /evidence|inference|central idea/i.test(text) ? 'Information and Ideas' : 'Craft and Structure')
      , skills = qbSkillGroups[domain]
      , skill = skills.find(s => text.toLowerCase().includes(s.toLowerCase())) || skills[0]
      , difficulty = /\bHard\b/i.test(text) ? 'Hard' : /\bEasy\b/i.test(text) ? 'Easy' : 'Medium'
      , correctLetter = (text.match(/Correct Answer\s*:?\s*([A-D])/i) || [])[1]
      , correct = correctLetter ? correctLetter.charCodeAt(0) - 65 : 0
      , choiceMatches = [...text.matchAll(/(?:^|\s)([A-D])[\.)]\s+(.+?)(?=\s+[A-D][\.)]\s+|Correct Answer|Rationale|$)/gi)]
      , choices = choiceMatches.length >= 4 ? choiceMatches.slice(0, 4).map(x => x[2].trim()) : ['Review choice A', 'Review choice B', 'Review choice C', 'Review choice D']
      , prompt = (text.match(/(?:Question|Which|What|How)\b(.+?)(?=\s+A[\.)]\s+)/i) || [])[0]?.trim() || `Imported question ${i + 1} — review wording before publishing`
      , explanation = (text.match(/(?:Rationale|Explanation)\s*:?\s*(.+)$/i) || [])[1]?.trim() || 'Explanation was not detected. Add it during admin review.';
    return {
        id: uid('q'),
        domain,
        skill,
        difficulty,
        passage: text.slice(0, 1800),
        prompt,
        choices,
        correct,
        explanation,
        courseIds: [courseId],
        source: 'PDF import',
        needsReview: !correctLetter || choiceMatches.length < 4
    }
}
function reviewFullExtract(fileName, records, pageCount) {
    const flagged = records.filter(r => r.needsReview).length;
    $('#modalContent').innerHTML = `<div class="extract-head"><span class="pill green">✓ Upload</span><span class="pill green">✓ ${pageCount} pages</span><span class="pill green">✓ ${records.length} records</span><span class="pill amber">${flagged} need review</span></div><h2>Extraction complete</h2><p class="muted">${esc(fileName)} was divided automatically. Review uncertain records before students see them.</p><div class="import-summary"><div><strong>${records.length}</strong><span>Questions detected</span></div><div><strong>${records.filter(r => r.difficulty === 'Easy').length}</strong><span>Easy</span></div><div><strong>${records.filter(r => r.difficulty === 'Medium').length}</strong><span>Medium</span></div><div><strong>${records.filter(r => r.difficulty === 'Hard').length}</strong><span>Hard</span></div></div><div class="extract-review">${records.slice(0, 20).map( (q, i) => `<div class="extract-row"><b>${i + 1}</b><div><strong>${esc(q.prompt)}</strong><span>${esc(q.domain)} · ${esc(q.skill)}</span></div><span class="pill ${q.needsReview ? 'amber' : 'green'}">${q.needsReview ? 'Review' : 'Ready'}</span></div>`).join('')}</div>${records.length > 20 ? `<p class="small muted">Showing the first 20 of ${records.length} extracted records.</p>` : ''}<div class="modal-actions"><button class="btn btn-soft" data-close-now>Cancel</button><button class="btn btn-primary" id="publishFullExtract">Publish ready questions</button></div>`;
    $('[data-close-now]').onclick = closeModal;
    $('#publishFullExtract').onclick = () => {
        db.qbank.push(...records);
        try {
            saveDB();
            closeModal();
            toast(`${records.length} questions added and classified`);
            renderApp('qbank_admin')
        } catch {
            db.qbank.splice(-records.length);
            openModal(`<h2>Browser storage is full</h2><p class="muted">This file is too large for the front-end demo. The production database can store the complete import.</p><button class="btn btn-primary" data-close-now>Close</button>`);
            $('[data-close-now]').onclick = closeModal
        }
    }
}

const bindDynamicV7 = bindDynamic;
bindDynamic = function() {
    bindDynamicV7();
    decorateQuestionDock();
    $$('[data-start-topic]').forEach(b => b.onclick = () => {
        exitFocusMode();
        qbankState = {
            mode: 'practice',
            skill: b.dataset.startTopic,
            difficulty: 'All'
        };
        qIndex = 0;
        questionDrawerOpen = false;
        renderApp('qbank')
    }
    );
    $$('[data-open-weak]').forEach(b => b.onclick = () => {
        const q = db.qbank.find(x => x.id === b.dataset.openWeak);
        if (q) {
            exitFocusMode();
            qbankState = {
                mode: 'practice',
                skill: q.skill,
                difficulty: 'All'
            };
            qIndex = Math.max(0, activeQpool().findIndex(x => x.id === q.id));
            renderApp('qbank')
        }
    }
    );
    $$('[data-open-filter]').forEach(b => b.onclick = () => {
        qbFilterOpen = qbFilterOpen === b.dataset.openFilter ? '' : b.dataset.openFilter;
        renderApp('qbank')
    }
    );
    $$('[data-set-filter]').forEach(b => b.onclick = () => {
        const [key,value] = b.dataset.setFilter.split(':');
        qbFilters[key] = value;
        qbFilterOpen = '';
        renderApp('qbank')
    }
    );
    $$('[data-exit-qbank]').forEach(b => b.onclick = () => {
        exitFocusMode();
        qbankState = {
            mode: 'browse',
            domain: '',
            difficulty: ''
        };
        questionDrawerOpen = false;
        renderApp('qbank')
    }
    )
}
;
syncPublic();
const saved = sessionStorage.getItem('satHubUser')
  , restored = db.users.find(u => u.id === saved);
if (restored)
    login(restored);
