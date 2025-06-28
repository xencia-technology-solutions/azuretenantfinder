document.getElementById('tenantForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tenantName = document.getElementById('tenantName').value.trim();
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = 'Summoning the Azure spirits...';
    resultDiv.className = '';

    if (!tenantName) {
        resultDiv.textContent = 'Please enter a tenant name. Even ghosts need a clue!';
        resultDiv.className = 'invalid';
        return;
    }

    try {
        // Microsoft exposes OpenID configuration for each tenant at this endpoint
        const url = `https://login.microsoftonline.com/${encodeURIComponent(tenantName)}/v2.0/.well-known/openid-configuration`;
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            // The tenant ID is in the issuer URL
            const match = data.issuer.match(/https:\/\/login\.microsoftonline\.com\/([a-f0-9-]+)/i);
            if (match && match[1]) {
                resultDiv.innerHTML = `<span style='font-size:1.2em;'>🎉 Tenant ID: <b>${match[1]}</b></span><br><span style='font-size:0.95em;color:#64748b;'>You have summoned the right Azure entity!</span>`;
                resultDiv.className = 'valid animate-pop';
            } else {
                resultDiv.innerHTML = `<span style='font-size:1.2em;'>👻 Invalid tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>That tenant is more mysterious than a ghost in the cloud.</span>`;
                resultDiv.className = 'invalid animate-shake';
            }
        } else {
            resultDiv.innerHTML = `<span style='font-size:1.2em;'>👻 Invalid tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>That tenant is more mysterious than a ghost in the cloud.</span>`;
            resultDiv.className = 'invalid animate-shake';
        }
    } catch (err) {
        resultDiv.innerHTML = `<span style='font-size:1.2em;'>😱 Error checking tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>Even the spirits are confused. Try again!</span>`;
        resultDiv.className = 'invalid animate-shake';
    }
    setTimeout(() => resultDiv.classList.remove('animate-pop', 'animate-shake'), 1200);
});
