// Quick server status checker
// Run this with: node check-server.js

const http = require('http');

const tests = [
    { url: 'http://localhost/', name: 'Basic Server' },
    { url: 'http://localhost/WDPF/React-project/real-estate-management-system/API/test-simple.php', name: 'Simple PHP' },
    { url: 'http://localhost/WDPF/React-project/real-estate-management-system/API/debug-server.php', name: 'Debug Server' },
    { url: 'http://localhost/WDPF/React-project/real-estate-management-system/API/get-agents.php', name: 'Agents API' }
];

async function checkServer(url, name) {
    return new Promise((resolve) => {
        const req = http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    name,
                    url,
                    status: res.statusCode,
                    success: res.statusCode === 200,
                    response: data.substring(0, 100)
                });
            });
        });
        
        req.on('error', (error) => {
            resolve({
                name,
                url,
                status: 'ERROR',
                success: false,
                error: error.message
            });
        });
        
        req.setTimeout(5000, () => {
            req.destroy();
            resolve({
                name,
                url,
                status: 'TIMEOUT',
                success: false,
                error: 'Request timeout'
            });
        });
    });
}

async function runTests() {
    console.log('🔧 Checking Server Status...\n');
    
    for (const test of tests) {
        const result = await checkServer(test.url, test.name);
        const status = result.success ? '✅ SUCCESS' : '❌ FAILED';
        
        console.log(`${status} - ${result.name}`);
        console.log(`   URL: ${result.url}`);
        console.log(`   Status: ${result.status}`);
        
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        } else if (result.response) {
            console.log(`   Response: ${result.response}...`);
        }
        console.log('');
    }
    
    console.log('📋 Next Steps:');
    console.log('1. If all tests fail: Start XAMPP/WAMP');
    console.log('2. If Basic Server fails: Check if Apache is running');
    console.log('3. If PHP tests fail: Check file paths');
    console.log('4. If API tests fail: Check database connection');
}

runTests().catch(console.error);