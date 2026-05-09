/**
 * 主應用程序 - 負責渲染和交互邏輯
 */
class NovelShowcaseApp {
    constructor() {
        this.currentSection = 'world';
        this.currentFilter = {
            characters: 'all',
            items: 'all',
            places: 'all',
            novelStory: 'all'
        };
        this.init();
    }

    /**
     * 初始化應用
     */
    async init() {
        // 加載數據
        await dataLoader.loadAll();

        // 綁定事件
        this.bindEvents();

        // 渲染初始內容
        this.renderWorld();
        this.renderCharacters();
        this.renderItems();
        this.renderNovels();
        this.renderPlaces();

        console.log('應用初始化完成');
    }

    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        // 導航切換
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // 移動端導航切換
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // 連結故事篩選器
        window.selectNovelStory = (story) => {
            this.selectNovelStory(story);
        };

        // 模態框關閉
        const modalClose = document.getElementById('modal-close');
        const modal = document.getElementById('detail-modal');
        if (modalClose && modal) {
            modalClose.addEventListener('click', () => this.closeModal());
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // ESC鍵關閉模態框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    /**
     * 切換區塊
     */
    switchSection(section) {
        this.currentSection = section;

        // 更新導航狀態
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        // 更新區塊顯示
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.toggle('active', sec.id === section);
        });

        // 關閉移動端菜單
        document.querySelector('.nav-menu')?.classList.remove('active');
    }

    /**
     * 渲染世界觀內容
     */
    renderWorld() {
        const worldData = dataLoader.getWorldData();
        if (!worldData) return;

        const container = document.getElementById('world-content');
        if (!container) return;

        let html = '';

        // 世界概述
        if (worldData.overview) {
            html += `
                <div class="world-section">
                    <h2><i class="fas fa-globe"></i> 世界概述</h2>
                    <div class="content-rendered">
                        ${this.renderContent(worldData.overview)}
                    </div>
                </div>
            `;
        }

        // 地理區域
        if (worldData.regions && worldData.regions.length > 0) {
            html += `
                <div class="world-section">
                    <h2><i class="fas fa-map-marked-alt"></i> 地理區域</h2>
            `;

            worldData.regions.forEach(region => {
                html += `
                    <div class="world-section">
                        <h3>${region.name}</h3>
                        ${region.image ? `<img src="${region.image}" alt="${region.name}" class="world-image">` : ''}
                        <div class="content-rendered">
                            ${this.renderContent(region.description)}
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        // 歷史年表
        if (worldData.timeline && worldData.timeline.length > 0) {
            html += `
                <div class="world-section">
                    <h2><i class="fas fa-history"></i> 歷史年表</h2>
                    <div class="content-rendered">
            `;

            worldData.timeline.forEach(event => {
                html += `
                    <h3>${event.period || event.time}</h3>
                    <div class="content-rendered">
                        ${this.renderContent(event.description)}
                    </div>
                `;

                if (event.story) {
                    html += `
                        <p><strong>相關故事：</strong><a href="#" class="timeline-link" onclick="app.selectNovelStory('${event.story.replace(/'/g, "\\'")}'); return false;">${event.story}</a></p>
                    `;
                }
            });

            html += `</div></div>`;
        }

        container.innerHTML = html;
    }

    /**
     * 選擇小說故事並跳轉到小說頁面
     */
    selectNovelStory(story) {
        this.currentFilter.novelStory = story;
        this.renderNovels();
        this.switchSection('novels');
    }

    /**
     * 渲染人物內容
     */
    renderCharacters() {
        const characters = dataLoader.getCharactersByRegion(this.currentFilter.characters);
        const container = document.getElementById('characters-content');
        const filterContainer = document.getElementById('character-filters');

        if (!container) return;

        // 渲染篩選按鈕
        if (filterContainer) {
            const regions = dataLoader.getAllRegions();
            let filterHtml = `
                <button class="filter-btn ${this.currentFilter.characters === 'all' ? 'active' : ''}" 
                        data-filter="all">
                    全部
                </button>
            `;

            regions.forEach(region => {
                filterHtml += `
                    <button class="filter-btn ${this.currentFilter.characters === region ? 'active' : ''}" 
                            data-filter="${region}">
                        ${region}
                    </button>
                `;
            });

            filterContainer.innerHTML = filterHtml;

            // 綁定篩選事件
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentFilter.characters = e.target.dataset.filter;
                    this.renderCharacters();
                });
            });
        }

        // 渲染人物卡片
        let html = '';
        characters.forEach(char => {
            let mediaHtml = '';
            if (char.video) {
                mediaHtml = `
                    <video class="card-media" autoplay muted loop playsinline poster="${char.image || ''}">
                        <source src="${char.video}" type="video/mp4">
                        您的瀏覽器不支持視頻標籤。
                    </video>
                `;
            } else if (char.image) {
                mediaHtml = `<img src="${char.image}" alt="${char.name}" class="card-image">`;
            }

            html += `
                <div class="card" data-id="${char.id}" onclick="app.showCharacterDetail('${char.id}')">
                    ${mediaHtml}
                    <div class="card-content">
                        <h3 class="card-title">${char.name}</h3>
                        ${char.title ? `<p class="card-subtitle">${char.title}</p>` : ''}
                        <p class="card-description">${char.description || ''}</p>
                        <div class="card-tags">
                            ${char.region ? `<span class="tag">${char.region}</span>` : ''}
                            ${char.race ? `<span class="tag">${char.race}</span>` : ''}
                            ${char.occupation ? `<span class="tag">${char.occupation}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p class="no-data">暫無人物數據</p>';
    }

    /**
     * 渲染物品內容
     */
    renderItems() {
        const items = dataLoader.getItemsByType(this.currentFilter.items);
        const container = document.getElementById('items-content');
        const filterContainer = document.getElementById('item-filters');

        if (!container) return;

        // 渲染篩選按鈕
        if (filterContainer) {
            const types = dataLoader.getAllItemTypes();
            let filterHtml = `
                <button class="filter-btn ${this.currentFilter.items === 'all' ? 'active' : ''}" 
                        data-filter="all">
                    全部
                </button>
            `;

            types.forEach(type => {
                filterHtml += `
                    <button class="filter-btn ${this.currentFilter.items === type ? 'active' : ''}" 
                            data-filter="${type}">
                        ${type}
                    </button>
                `;
            });

            filterContainer.innerHTML = filterHtml;

            // 綁定篩選事件
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentFilter.items = e.target.dataset.filter;
                    this.renderItems();
                });
            });
        }

        // 渲染物品卡片
        let html = '';
        items.forEach(item => {
            html += `
                <div class="card" data-id="${item.id}" onclick="app.showItemDetail('${item.id}')">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}" class="card-image">` : ''}
                    <div class="card-content">
                        <h3 class="card-title">${item.name}</h3>
                        ${item.type ? `<p class="card-subtitle">${item.type}</p>` : ''}
                        <p class="card-description">${item.description || ''}</p>
                        <div class="card-tags">
                            ${item.region ? `<span class="tag">${item.region}</span>` : ''}
                            ${item.rarity ? `<span class="tag">${item.rarity}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p class="no-data">暫無物品數據</p>';
    }

    /**
     * 渲染場所
     */
    renderPlaces() {
        const places = dataLoader.getPlacesByFilter(this.currentFilter.places);
        const container = document.getElementById('places-content');
        const filterContainer = document.getElementById('place-filters');

        if (!container) return;

        // 渲染篩選按鈕
        if (filterContainer) {
            const regions = dataLoader.getAllPlaceRegions();
            let filterHtml = `
                <button class="filter-btn ${this.currentFilter.places === 'all' ? 'active' : ''}" 
                        data-filter="all">
                    全部
                </button>
            `;

            regions.forEach(region => {
                filterHtml += `
                    <button class="filter-btn ${this.currentFilter.places === region ? 'active' : ''}" 
                            data-filter="${region}">
                        ${region}
                    </button>
                `;
            });

            filterContainer.innerHTML = filterHtml;

            // 綁定篩選事件
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentFilter.places = e.target.dataset.filter;
                    this.renderPlaces();
                });
            });
        }

        // 渲染場所卡片
        let html = '';
        places.forEach(place => {
            html += `
                <div class="card" data-id="${place.id}" onclick="app.showPlaceDetail('${place.id}')">
                    ${place.image ? `<img src="${place.image}" alt="${place.name}" class="card-image">` : ''}
                    <div class="card-content">
                        <h3 class="card-title">${place.name}</h3>
                        ${place.type ? `<p class="card-subtitle">${place.type}</p>` : ''}
                        <p class="card-description">${place.description || ''}</p>
                        <div class="card-tags">
                            ${place.region ? `<span class="tag">${place.region}</span>` : ''}
                            ${place.title ? `<span class="tag">${place.title}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<p class="no-data">暫無場所數據</p>';
    }

    /**
     * 渲染小說內容
     */
    renderNovels() {
        const novels = dataLoader.getNovels();
        const storyFilters = document.getElementById('novel-story-filters');
        const container = document.getElementById('novels-content');

        if (!container) return;

        // 根據故事分組
        const stories = dataLoader.getAllNovelStories();

        if (storyFilters) {
            let filterHtml = `
                <button class="filter-btn ${this.currentFilter.novelStory === 'all' ? 'active' : ''}" data-filter="all">
                    全部故事
                </button>
            `;

            stories.forEach(story => {
                filterHtml += `
                    <button class="filter-btn ${this.currentFilter.novelStory === story ? 'active' : ''}" data-filter="${story}">
                        ${story}
                    </button>
                `;
            });

            storyFilters.innerHTML = filterHtml;
            storyFilters.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.currentFilter.novelStory = e.target.dataset.filter;
                    this.renderNovels();
                });
            });
        }

        const selectedStories = this.currentFilter.novelStory === 'all'
            ? stories
            : [this.currentFilter.novelStory];

        let html = '';
        selectedStories.forEach(story => {
            const storyNovels = dataLoader.getNovelsByStory(story);
            if (!storyNovels.length) return;

            if (this.currentFilter.novelStory === 'all') {
                html += `<div class="story-section"><h2>${story}</h2></div>`;
            }

            storyNovels.forEach(novel => {
                html += `
                    <div class="novel-chapter" onclick="app.showNovelDetail('${novel.id}')">
                        <div class="novel-chapter-header">
                            <h3 class="novel-chapter-title">${novel.title}</h3>
                            <span class="novel-chapter-meta">${novel.chapter || ''}</span>
                        </div>
                        <p class="novel-chapter-summary">${novel.summary || ''}</p>
                    </div>
                `;
            });
        });

        container.innerHTML = html || '<p class="no-data">暫無小說數據</p>';
    }

    /**
     * 顯示小說詳情（從MD文件讀取內容）
     */
    async showNovelDetail(id) {
        const novels = dataLoader.getNovels();
        const novel = novels.find(n => n.id === id);
        if (!novel) return;

        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = novel.title;

        let html = '';

        if (novel.chapter) {
            html += `<p><strong>章節:</strong> ${novel.chapter}</p>`;
        }

        if (novel.summary) {
            html += `<h3>摘要</h3><p>${novel.summary}</p>`;
        }

        // 顯示MD文件內容
        if (novel.content) {
            html += `<h3>內容</h3><div class="content-rendered novel-content">${this.renderMarkdown(novel.content)}</div>`;
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    /**
     * 顯示人物詳情
     */
    showCharacterDetail(id) {
        const characters = dataLoader.getCharacters();
        const char = characters.find(c => c.id === id);
        if (!char) return;

        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = char.name;

        let html = '';

        if (char.image) {
            html += `<img src="${char.image}" alt="${char.name}" class="modal-image">`;
        }

        if (char.title) {
            html += `<p><strong>稱號:</strong> ${char.title}</p>`;
        }

        if (char.region) {
            html += `<p><strong>區域:</strong> ${char.region}</p>`;
        }

        if (char.race) {
            html += `<p><strong>種族:</strong> ${char.race}</p>`;
        }

        if (char.occupation) {
            html += `<p><strong>職業:</strong> ${char.occupation}</p>`;
        }

        if (char.description) {
            html += `<h3>簡介</h3><div class="content-rendered">${this.renderContent(char.description)}</div>`;
        }

        if (char.background) {
            html += `<h3>背景故事</h3><div class="content-rendered">${this.renderContent(char.background)}</div>`;
        }

        if (char.abilities && char.abilities.length > 0) {
            html += `<h3>能力</h3><div class="content-rendered">${this.renderContent(char.abilities.join('\n'))}</div>`;
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    /**
     * 顯示物品詳情
     */
    showItemDetail(id) {
        const items = dataLoader.getItems();
        const item = items.find(i => i.id === id);
        if (!item) return;

        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = item.name;

        let html = '';

        if (item.image) {
            html += `<img src="${item.image}" alt="${item.name}" class="modal-image">`;
        }

        if (item.type) {
            html += `<p><strong>類型:</strong> ${item.type}</p>`;
        }

        if (item.region) {
            html += `<p><strong>區域:</strong> ${item.region}</p>`;
        }

        if (item.rarity) {
            html += `<p><strong>稀有度:</strong> ${item.rarity}</p>`;
        }

        if (item.description) {
            html += `<h3>描述</h3><div class="content-rendered">${this.renderContent(item.description)}</div>`;
        }

        if (item.abilities && item.abilities.length > 0) {
            html += `<h3>能力</h3><div class="content-rendered">${this.renderContent(item.abilities.join('\n'))}</div>`;
        }

        if (item.lore) {
            html += `<h3>背景故事</h3><div class="content-rendered">${this.renderContent(item.lore)}</div>`;
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    /**
     * 顯示場所詳情
     */
    showPlaceDetail(id) {
        const places = dataLoader.getPlaces();
        const place = places.find(p => p.id === id);
        if (!place) return;

        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = place.name;

        let html = '';

        if (place.image) {
            html += `<img src="${place.image}" alt="${place.name}" class="modal-image">`;
        }

        if (place.type) {
            html += `<p><strong>類型:</strong> ${place.type}</p>`;
        }

        if (place.region) {
            html += `<p><strong>區域:</strong> ${place.region}</p>`;
        }

        if (place.title) {
            html += `<p><strong>稱號:</strong> ${place.title}</p>`;
        }

        if (place.description) {
            html += `<h3>描述</h3><div class="content-rendered">${this.renderContent(place.description)}</div>`;
        }

        if (place.features && place.features.length > 0) {
            html += `<h3>特色建築</h3><div class="content-rendered">${this.renderContent(place.features.map(f => `• ${f}`).join('\n'))}</div>`;
        }

        if (place.history) {
            html += `<h3>歷史</h3><div class="content-rendered">${this.renderContent(place.history)}</div>`;
        }

        if (place.specialties && place.specialties.length > 0) {
            html += `<h3>專長</h3><div class="content-rendered">${this.renderContent(place.specialties.map(s => `• ${s}`).join('\n'))}</div>`;
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    /**
     * 顯示小說詳情
     */
    showNovelDetail(id) {
        const novels = dataLoader.getNovels();
        const novel = novels.find(n => n.id === id);
        if (!novel) return;

        const modal = document.getElementById('detail-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        modalTitle.textContent = novel.title;

        let html = '';

        if (novel.chapter) {
            html += `<p><strong>章節:</strong> ${novel.chapter}</p>`;
        }

        if (novel.summary) {
            html += `<h3>摘要</h3><p>${novel.summary}</p>`;
        }

        if (novel.content) {
            html += `<h3>內容</h3><div class="content-rendered">${this.renderContent(novel.content)}</div>`;
        }

        modalBody.innerHTML = html;
        modal.classList.add('active');
    }

    /**
     * 關閉模態框
     */
    closeModal() {
        const modal = document.getElementById('detail-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    /**
     * 渲染內容（支持Markdown格式）
     */
    renderContent(content) {
        if (!content) return '';

        // 簡單的Markdown轉換
        let html = content;

        // 轉換標題
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // 轉換粗體和斜體
        html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*)\*/g, '<em>$1</em>');

        // 轉換換行
        html = html.replace(/\n/g, '<br>');

        // 轉換段落
        html = html.replace(/<br><br>/g, '</p><p>');
        html = '<p>' + html + '</p>';

        return html;
    }

    /**
     * 渲染Markdown內容（更完善的轉換）
     */
    renderMarkdown(content) {
        if (!content) return '';

        let html = content;

        // 轉換代碼塊
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

        // 轉換標題
        html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // 轉換粗體和斜體
        html = html.replace(/\*\*\*(.*)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*)\*/g, '<em>$1</em>');

        // 轉換引用
        html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');

        // 轉換無序列表
        html = html.replace(/^[\-\*] (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // 轉換有序列表
        html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

        // 轉換水平線
        html = html.replace(/^---$/gm, '<hr>');

        // 轉換圖片
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="modal-image">');

        // 轉換鏈接
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // 轉換換行為段落
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        html = '<p>' + html + '</p>';

        // 清理多餘的段落標籤
        html = html.replace(/<p><\/p>/g, '');
        html = html.replace(/<p>(<h[1-4]>)/g, '$1');
        html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
        html = html.replace(/<p>(<ul>)/g, '$1');
        html = html.replace(/(<\/ul>)<\/p>/g, '$1');
        html = html.replace(/<p>(<blockquote>)/g, '$1');
        html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
        html = html.replace(/<p>(<pre>)/g, '$1');
        html = html.replace(/(<\/pre>)<\/p>/g, '$1');
        html = html.replace(/<p>(<hr>)<\/p>/g, '$1');

        return html;
    }
}

// 初始化應用
const app = new NovelShowcaseApp();
