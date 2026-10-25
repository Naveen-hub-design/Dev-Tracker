const http = require('http');

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) { json = data; }
        resolve({ status: res.statusCode, headers: res.headers, data: json });
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- DevTrack CodeChef Integration Test Suite ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Test unauthenticated access to protected endpoints
    console.log('\n1. Testing Protected Endpoints (Auth Guard):');
    const unauthMe = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/me',
      method: 'GET',
    });
    assert(unauthMe.status === 401, `GET /api/codechef/me returns 401 for unauthenticated request (got ${unauthMe.status})`);

    const unauthPut = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/username',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }, { username: 'tourist' });
    assert(unauthPut.status === 401, `PUT /api/codechef/username returns 401 for unauthenticated request (got ${unauthPut.status})`);

    const unauthRefresh = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/refresh',
      method: 'POST',
    });
    assert(unauthRefresh.status === 401, `POST /api/codechef/refresh returns 401 for unauthenticated request (got ${unauthRefresh.status})`);

    // 2. Test fetching public profile with valid handle
    console.log('\n2. Testing Public Profile Fetch (Valid Handle - tourist):');
    const validUser = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/tourist',
      method: 'GET',
    });
    assert(validUser.status === 200, `GET /api/codechef/tourist returns 200 (got ${validUser.status})`);
    assert(validUser.data?.username === 'tourist', `Profile username matches 'tourist'`);
    assert(typeof validUser.data?.currentRating === 'number' && validUser.data?.currentRating > 0, `Profile contains numeric currentRating (${validUser.data?.currentRating})`);
    assert(typeof validUser.data?.stars === 'string' && validUser.data?.stars.includes('★'), `Profile contains stars rating (${validUser.data?.stars})`);
    assert(Array.isArray(validUser.data?.ratingHistory) && validUser.data?.ratingHistory.length > 0, `Profile contains contest rating history array (len: ${validUser.data?.ratingHistory?.length})`);
    assert(typeof validUser.data?.totalSolved === 'number' && validUser.data?.totalSolved > 0, `Profile contains totalSolved count (${validUser.data?.totalSolved})`);

    // 3. Test fetching invalid / non-existent handle
    console.log('\n3. Testing Invalid / Non-existent Handle:');
    const invalidUser = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/this_user_definitely_does_not_exist_987654321',
      method: 'GET',
    });
    assert(invalidUser.status === 404, `GET /api/codechef/invalid returns 404 (got ${invalidUser.status})`);

    // 4. Test handle validation (special chars not allowed by CodeChef)
    console.log('\n4. Testing Input Validation (Invalid Handle Characters):');
    const badHandle = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/codechef/bad%20handle%21%40%23',
      method: 'GET',
    });
    assert(badHandle.status === 400, `GET /api/codechef with invalid chars returns 400 (got ${badHandle.status})`);

    // 5. Test existing services remain intact (Health, Contests, LeetCode daily)
    console.log('\n5. Testing Existing Service Stability:');
    const health = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET',
    });
    assert(health.status === 200 && health.data?.status === 'ok', `GET /api/health returns 200 OK`);

    const leetDaily = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/leetcode/daily',
      method: 'GET',
    });
    assert(leetDaily.status === 200, `GET /api/leetcode/daily returns 200`);

    console.log(`\n========================================`);
    console.log(`Tests Completed: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test suite failed with unexpected error:', err);
    process.exit(1);
  }
}

runTests();
