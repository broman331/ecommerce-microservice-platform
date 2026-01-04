const BASE_URL = 'http://localhost:3004/store/products';

async function testCrash() {
    try {
        console.log("1. Fetching all products...");
        const res1 = await fetch(BASE_URL);
        if (!res1.ok) throw new Error(`Fetch 1 failed: ${res1.status}`);
        const products = await res1.json();
        console.log(`Success. Got ${products.length} products.`);

        const product = products[0];
        const productId = product.id;
        console.log(`2. Disabling product ${productId}...`);

        const resPatch = await fetch(`${BASE_URL}/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: false })
        });
        if (!resPatch.ok) throw new Error(`Patch failed: ${resPatch.status}`);
        console.log("Disable success.");

        console.log("3. Fetching all products again...");
        const res2 = await fetch(BASE_URL);
        if (!res2.ok) throw new Error(`Fetch 2 failed: ${res2.status}`);
        const products2 = await res2.json();
        console.log(`Success. Got ${products2.length} products.`);

        const disabledProduct = products2.find(p => p.id === productId);
        console.log("Disabled Product state:", disabledProduct.enabled);

    } catch (e) {
        console.error("CRASH DETECTED:");
        console.error(e);
    }
}

testCrash();
