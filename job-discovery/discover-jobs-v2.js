#!/usr/bin/env node
/**
 * Job Discovery Script v2 - Optimized Search
 * 
 * Approach:
 * 1. Target specific companies with known high-comp roles
 * 2. Use API filters for location (Remote US, Seattle/WA) when available
 * 3. Filter by role title keywords (Product, Design, Director-level)
 * 4. Deduplicate and sort by relevance + posted date
 * 
 * Usage: node discover-jobs-v2.js [--output jobs-data.js]
 */

const https = require('https');
const fs = require('fs');

// Curated company list - known for $200K+ product/design roles
const TARGET_COMPANIES = {
    greenhouse: [
        'discord',      // Gaming, SF/Remote
        'roblox',       // Gaming, SF
        'duolingo',     // EdTech, Pittsburgh/Remote
        'stripe',       // Fintech, SF/Remote (if they use Greenhouse)
        'notion',       // Productivity, SF/Remote
        'figma',        // Design tools, SF/Remote
        'webflow',      // Web platform, SF/Remote
        'airtable',     // Productivity, SF/Remote
    ],
    lever: [
        'netflix',      // Entertainment, LA/Remote
        'spotify',      // Music, NYC/Remote
        'twitch',       // Gaming/streaming, SF/Remote
        'unity',        // Gaming platform, SF/Remote
        'lever'         // Meta-search (Lever itself posts jobs)
    ]
};

// Role keywords we care about (senior+ product/design)
const ROLE_KEYWORDS = [
    'senior product manager',
    'principal product manager',
    'staff product manager',
    'director of product',
    'director, product',
    'product director',
    'vp product',
    'head of product',
    'chief product officer',
    'senior product designer',
    'principal product designer',
    'design director',
    'director of design',
    'game director',
    'creative director',
    'senior design manager',
    'product owner'
];

// Location eligibility (matches app filter)
function isLocationEligible(location) {
    if (!location) return false;
    const loc = location.toLowerCase();
    
    // Remote US
    if (loc.includes('remote')) {
        if (loc.includes('us') || loc.includes('u.s.') || loc.includes('united states')) {
            return true;
        }
        if (loc === 'remote') {
            return true;
        }
        // Hybrid formats like "LA / Remote"
        if (loc.includes('/') || loc.includes('or')) {
            return true;
        }
    }
    
    // Seattle/WA area
    if (loc.includes('seattle') || loc.includes('washington') || loc.includes(' wa')) {
        return true;
    }
    
    return false;
}

// Title relevance check
function isRelevantRole(title) {
    const lowerTitle = title.toLowerCase();
    return ROLE_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
}

// Fetch from Greenhouse API
async function fetchGreenhouseJobs(company) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    const jobs = json.jobs || [];
                    
                    const filtered = jobs
                        .filter(job => isRelevantRole(job.title))
                        .filter(job => isLocationEligible(job.location?.name))
                        .map(job => ({
                            id: `greenhouse-${company}-${job.id}`,
                            title: job.title,
                            company: company.charAt(0).toUpperCase() + company.slice(1),
                            location: job.location?.name || 'Remote',
                            url: job.absolute_url,
                            posted_date: job.updated_at?.split('T')[0] || new Date().toISOString().split('T')[0],
                            source: 'Greenhouse',
                            verified_active: true,
                            industry: guessIndustry(company, job.title)
                        }));
                    
                    resolve(filtered);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Fetch from Lever API
async function fetchLeverJobs(company) {
    const url = `https://api.lever.co/v0/postings/${company}?mode=json`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const jobs = JSON.parse(data);
                    
                    // Handle both array and object responses
                    if (!Array.isArray(jobs)) {
                        resolve([]);
                        return;
                    }
                    
                    const filtered = jobs
                        .filter(job => isRelevantRole(job.text))
                        .filter(job => isLocationEligible(job.categories?.location))
                        .map(job => ({
                            id: `lever-${company}-${job.id}`,
                            title: job.text,
                            company: company.charAt(0).toUpperCase() + company.slice(1),
                            location: job.categories?.location || 'Remote',
                            url: job.hostedUrl,
                            posted_date: new Date(job.createdAt).toISOString().split('T')[0],
                            source: 'Lever',
                            verified_active: true,
                            industry: guessIndustry(company, job.text)
                        }));
                    
                    resolve(filtered);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

function guessIndustry(company, title) {
    const gamingCompanies = ['roblox', 'discord', 'riot', 'epic', 'twitch', 'unity'];
    const titleKeywords = title.toLowerCase();
    
    if (gamingCompanies.includes(company.toLowerCase()) || titleKeywords.includes('game')) {
        return 'gaming';
    }
    if (titleKeywords.includes('edtech') || company === 'duolingo') {
        return 'edtech';
    }
    if (titleKeywords.includes('fintech') || company === 'stripe') {
        return 'fintech';
    }
    return 'tech';
}

// Main discovery function
async function discoverJobs() {
    console.log('🔍 Discovering curated jobs with location + role filters...\n');
    
    let allJobs = [];
    
    // Fetch from Greenhouse companies
    console.log('📥 Greenhouse API:');
    for (const company of TARGET_COMPANIES.greenhouse) {
        try {
            const jobs = await fetchGreenhouseJobs(company);
            if (jobs.length > 0) {
                console.log(`  ✓ ${company}: ${jobs.length} relevant jobs`);
                allJobs.push(...jobs);
            } else {
                console.log(`  - ${company}: no matches`);
            }
        } catch (e) {
            console.log(`  ⚠️  ${company}: ${e.message}`);
        }
    }
    
    console.log('\n📥 Lever API:');
    // Fetch from Lever companies
    for (const company of TARGET_COMPANIES.lever) {
        try {
            const jobs = await fetchLeverJobs(company);
            if (jobs.length > 0) {
                console.log(`  ✓ ${company}: ${jobs.length} relevant jobs`);
                allJobs.push(...jobs);
            } else {
                console.log(`  - ${company}: no matches`);
            }
        } catch (e) {
            console.log(`  ⚠️  ${company}: ${e.message}`);
        }
    }
    
    // Sort by posted date (newest first)
    allJobs.sort((a, b) => new Date(b.posted_date) - new Date(a.posted_date));
    
    console.log(`\n✓ Total curated jobs: ${allJobs.length}\n`);
    
    return allJobs;
}

// CLI execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const outputArg = args.find(a => a.startsWith('--output='));
    const output = outputArg ? outputArg.split('=')[1] : 'jobs-data.js';
    
    discoverJobs().then(jobs => {
        if (jobs.length === 0) {
            console.log('⚠️  No jobs found matching criteria.');
            process.exit(0);
        }
        
        const fileContent = `// Auto-generated by discover-jobs-v2.js on ${new Date().toISOString()}
// ${jobs.length} verified active postings (curated search with location + role filters)

const initialJobs = ${JSON.stringify(jobs, null, 4)};
`;
        
        fs.writeFileSync(output, fileContent);
        console.log(`📝 Wrote ${jobs.length} jobs to ${output}\n`);
        
        // Print summary
        console.log('📋 Job Summary:');
        jobs.slice(0, 10).forEach((job, i) => {
            console.log(`\n${i + 1}. ${job.title}`);
            console.log(`   ${job.company} · ${job.location}`);
            console.log(`   ${job.url}`);
        });
        
        if (jobs.length > 10) {
            console.log(`\n... and ${jobs.length - 10} more`);
        }
    }).catch(err => {
        console.error('❌ Error:', err);
        process.exit(1);
    });
}

module.exports = { discoverJobs };
