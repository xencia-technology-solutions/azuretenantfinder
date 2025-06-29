document.getElementById('tenantForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tenantName = document.getElementById('tenantName').value.trim();
    const resultDiv = document.getElementById('result');
    const copyBtn = document.getElementById('copyBtn');
    copyBtn.style.display = 'none';
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
                resultDiv.innerHTML = `<span style='font-size:1.2em;'>🎉 Tenant ID: <b id='tenantIdText'>${match[1]}</b></span><br><span style='font-size:0.95em;color:#64748b;'>You have summoned the right Azure entity!</span>`;
                resultDiv.className = 'valid animate-pop';
                copyBtn.style.display = 'inline-flex';
                copyBtn.setAttribute('aria-label', 'Copy Tenant ID');
                copyBtn.title = 'Copy Tenant ID';
            } else {
                resultDiv.innerHTML = `<span style='font-size:1.2em;'>👻 Invalid tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>That tenant is more mysterious than a ghost in the cloud.</span>`;
                resultDiv.className = 'invalid animate-shake';
                copyBtn.style.display = 'none';
            }
        } else {
            resultDiv.innerHTML = `<span style='font-size:1.2em;'>👻 Invalid tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>That tenant is more mysterious than a ghost in the cloud.</span>`;
            resultDiv.className = 'invalid animate-shake';
            copyBtn.style.display = 'none';
        }
    } catch (err) {
        resultDiv.innerHTML = `<span style='font-size:1.2em;'>😱 Error checking tenant.</span><br><span style='font-size:0.95em;color:#64748b;'>Even the spirits are confused. Try again!</span>`;
        resultDiv.className = 'invalid animate-shake';
        copyBtn.style.display = 'none';
    }
    setTimeout(() => resultDiv.classList.remove('animate-pop', 'animate-shake'), 1200);
});

// Copy button logic
const copyBtn = document.getElementById('copyBtn');
copyBtn.addEventListener('click', function() {
    const tenantIdElem = document.getElementById('tenantIdText');
    if (tenantIdElem) {
        const tenantId = tenantIdElem.textContent;
        navigator.clipboard.writeText(tenantId).then(() => {
            copyBtn.innerHTML = '<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="12" rx="2" fill="#059669"/><rect x="2" y="2" width="10" height="12" rx="2" fill="#bbf7d0"/><path d="M7 8h6M7 11h6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>';
            copyBtn.title = 'Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = '<svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="10" height="12" rx="2" fill="#2563eb"/><rect x="2" y="2" width="10" height="12" rx="2" fill="#60a5fa"/><path d="M7 8h6M7 11h6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>';
                copyBtn.title = 'Copy Tenant ID';
            }, 1200);
        });
    }
});
