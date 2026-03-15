// Job Discovery App
const STORAGE_KEY = 'job-discovery-data';

// Initialize or load data
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return {
        jobs: initialJobs,
        decisions: {}
    };
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let appData = loadData();

// Render functions
function renderJobs() {
    const newContainer = document.getElementById('jobs-new');
    const interestedContainer = document.getElementById('jobs-interested');
    const archivedContainer = document.getElementById('jobs-archived');

    newContainer.innerHTML = '';
    interestedContainer.innerHTML = '';
    archivedContainer.innerHTML = '';

    let newCount = 0;
    let interestedCount = 0;
    let archivedCount = 0;

    appData.jobs.forEach(job => {
        const status = appData.decisions[job.id] || 'new';
        const card = createJobCard(job, status);

        if (status === 'new') {
            newContainer.appendChild(card);
            newCount++;
        } else if (status === 'interested') {
            interestedContainer.appendChild(card);
            interestedCount++;
        } else if (status === 'archived') {
            archivedContainer.appendChild(card);
            archivedCount++;
        }
    });

    // Update stats
    document.getElementById('stat-new').textContent = newCount;
    document.getElementById('stat-interested').textContent = interestedCount;
    document.getElementById('stat-archived').textContent = archivedCount;

    // Show empty states
    if (newCount === 0) {
        newContainer.innerHTML = '<div class="empty-state">no new jobs</div>';
    }
    if (interestedCount === 0) {
        interestedContainer.innerHTML = '<div class="empty-state">no jobs marked as interested</div>';
    }
    if (archivedCount === 0) {
        archivedContainer.innerHTML = '<div class="empty-state">no archived jobs</div>';
    }
}

function createJobCard(job, status) {
    const card = document.createElement('div');
    card.className = 'job-card';

    const statusBadge = job.verified_active ? 
        '<span class="status-badge active">active</span>' : 
        '<span class="status-badge">unverified</span>';

    card.innerHTML = `
        <div class="job-header">
            <div>
                <div class="job-title">${job.title}</div>
                <div class="job-company">${job.company}</div>
            </div>
            ${statusBadge}
        </div>
        <div class="job-details">
            <div class="detail-item">
                <span class="detail-label">salary</span>
                <span class="detail-value">${job.salary}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">location</span>
                <span class="detail-value">${job.location}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">posted</span>
                <span class="detail-value">${job.posted_date}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">source</span>
                <span class="detail-value">${job.source}</span>
            </div>
        </div>
        <div class="job-actions">
            <a href="${job.url}" target="_blank" class="btn">view posting</a>
            ${status === 'new' ? `
                <button class="btn btn-primary" onclick="markInterested('${job.id}')">interested</button>
                <button class="btn" onclick="markArchived('${job.id}')">not interested</button>
            ` : ''}
            ${status === 'interested' ? `
                <button class="btn" onclick="markArchived('${job.id}')">archive</button>
            ` : ''}
            ${status === 'archived' ? `
                <button class="btn" onclick="markInterested('${job.id}')">restore</button>
            ` : ''}
        </div>
    `;

    return card;
}

// Action handlers
function markInterested(jobId) {
    appData.decisions[jobId] = 'interested';
    saveData(appData);
    renderJobs();
}

function markArchived(jobId) {
    appData.decisions[jobId] = 'archived';
    saveData(appData);
    renderJobs();
}

// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${tabName}`).classList.add('active');
    });
});

// Initial render
renderJobs();
