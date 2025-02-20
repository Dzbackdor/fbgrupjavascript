// cari di pencarian grup fb dengan kw bebas 
// setting hasil pencarian grup ke publik
// buka console tempelkan code ini
// tunggu sampai selesai tekan tombol bagian url yg telah di ambil, file akan tersimpan dengan .txt

function createFloatingButton() {
    const button = document.createElement('div');
    button.innerHTML = `
        <div id="urlCounter" style="
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4267B2;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 9999;
            font-weight: bold;
        ">
            Grup Aktif: 0
        </div>
    `;
    document.body.appendChild(button);
    return button.firstElementChild;
}

async function scrollAndCollectGroups() {
    const button = createFloatingButton();
    let activeGroups = new Set();
    let lastHeight = 0;
    let noNewContentCount = 0;
    
    function isActiveGroup(element) {
        const parentDiv = element.closest('div[role="article"]');
        if (!parentDiv) return false;
        
        const spans = parentDiv.querySelectorAll('span');
        return Array.from(spans).some(span => 
            span.textContent && span.textContent.includes('10+ postingan per hari')
        );
    }

    button.onclick = () => {
        const results = Array.from(activeGroups).map(group => JSON.parse(group));
        const activeUrls = results.map(item => {
            // Remove trailing slash if it exists
            return item.url.replace(/\/$/, '');
        }).join('\n');
        
        const blob = new Blob([activeUrls], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'grup_aktif.txt';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    function smoothScroll() {
        window.requestAnimationFrame(() => {
            window.scrollTo(0, document.documentElement.scrollHeight);
        });
    }

    setInterval(async () => {
        const links = document.querySelectorAll('a[role="presentation"]');
        const groups = Array.from(links)
            .filter(link => {
                return link.href.includes('/groups/') && isActiveGroup(link);
            })
            .map(link => ({
                nama: link.textContent,
                url: link.href.replace(/\/$/, ''), // Remove trailing slash when collecting URLs
                info: '10+ postingan per hari'
            }));
        
        groups.forEach(group => activeGroups.add(JSON.stringify(group)));
        button.textContent = `Grup Aktif: ${activeGroups.size}`;
        
        smoothScroll();
        
        let newHeight = document.documentElement.scrollHeight;
        if (newHeight === lastHeight) {
            noNewContentCount++;
            if (noNewContentCount >= 3) {
                window.scrollTo(0, 0);
                noNewContentCount = 0;
            }
        } else {
            noNewContentCount = 0;
        }
        lastHeight = newHeight;
        
        console.log('Memindai... Ditemukan:', activeGroups.size, 'grup aktif');
    }, 2000);
}

scrollAndCollectGroups();
