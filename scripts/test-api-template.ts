const BASE_URL = "http://localhost:3001";

async function testAPIUpdate() {
  console.log("Starting API test for template update...\n");

  try {
    // 1. Login to get auth cookie
    console.log("1. Logging in as admin...");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "adminevent@gmail.com",
        password: "1234qwerty",
      }),
    });

    const loginData = await loginRes.json();
    const cookie = loginRes.headers.get("set-cookie");

    if (!loginRes.ok || !cookie) {
      console.log("❌ Login failed:", loginData);
      return;
    }
    console.log("✓ Login successful!");

    const cookieHeader = cookie.split(";")[0];

    // 2. Get event ID first
    console.log("\n2. Fetching events list...");
    const eventsRes = await fetch(`${BASE_URL}/api/event`, {
      headers: { Cookie: cookieHeader },
    });
    const events = await eventsRes.json();

    if (!events || events.length === 0) {
      console.log("❌ No events found");
      return;
    }

    const eventId = events[0].eventId;
    console.log(`✓ Found event ID: ${eventId}`);
    console.log(
      `  Current orientation: ${events[0].orientation || "portrait (default)"}`,
    );

    // 3. Test API update to landscape
    console.log(
      "\n3. Testing PUT /api/event/[id] with orientation=landscape...",
    );

    const updateRes = await fetch(`${BASE_URL}/api/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        orientation: "landscape",
        gridCols: 3,
      }),
    });

    const updateData = await updateRes.json();
    console.log(`  Status: ${updateRes.status}`);
    console.log(`  Response orientation: ${updateData.orientation}`);
    console.log(`  Response gridCols: ${updateData.gridCols}`);

    if (
      updateRes.ok &&
      updateData.orientation === "landscape" &&
      updateData.gridCols === 3
    ) {
      console.log("✅ API update to landscape works!");
    } else {
      console.log("❌ API update failed!");
      console.log("  Response:", JSON.stringify(updateData, null, 2));
    }

    // 4. Test partial update (only position)
    console.log("\n4. Testing partial update (only qrX, qrY)...");

    const partialRes = await fetch(`${BASE_URL}/api/event/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        qrX: 200,
        qrY: 300,
      }),
    });

    const partialData = await partialRes.json();
    console.log(`  Status: ${partialRes.status}`);
    console.log(`  qrX: ${partialData.qrX}, qrY: ${partialData.qrY}`);
    console.log(`  orientation preserved: ${partialData.orientation}`);

    if (
      partialRes.ok &&
      partialData.qrX === 200 &&
      partialData.qrY === 300 &&
      partialData.orientation === "landscape"
    ) {
      console.log("✅ Partial update works! Other fields preserved.");
    } else {
      console.log("❌ Partial update failed!");
      console.log("  Response:", JSON.stringify(partialData, null, 2));
    }

    // 5. Verify GET returns updated values
    console.log("\n5. Verifying with GET /api/event/[id]...");
    const getRes = await fetch(`${BASE_URL}/api/event/${eventId}`, {
      headers: { Cookie: cookieHeader },
    });
    const getData = await getRes.json();

    if (getData.orientation === "landscape" && getData.qrX === 200) {
      console.log("✅ Values persisted correctly!");
      console.log(`  orientation: ${getData.orientation}`);
      console.log(`  qrX: ${getData.qrX}`);
    } else {
      console.log("❌ Values not persisted!");
      console.log("  GET response:", JSON.stringify(getData, null, 2));
    }

    console.log("\n=== API tests completed ===");
  } catch (error) {
    console.error("\n❌ Test failed with error:", error);
  }
}

testAPIUpdate();
