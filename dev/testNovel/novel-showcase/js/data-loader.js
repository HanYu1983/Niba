/**
 * 數據加載器 - 負責從JSON文件加載小說世界觀數據
 */
class DataLoader {
    constructor() {
        this.data = {
            world: null,
            characters: [],
            items: [],
            novels: [],
            places: []
        };
        this.loaded = false;
    }

    /**
     * 加載所有數據
     */
    async loadAll() {
        try {
            this.showLoading(true);
            
            // 並行加載所有JSON文件
            const [worldData, characterIndex, itemsData, novelsConfig, placesData] = await Promise.all([
                this.loadJSON('data/world.json'),
                this.loadJSON('data/characters/character-index.json'),
                this.loadJSON('data/items.json'),
                this.loadJSON('data/novels.json'),
                this.loadJSON('data/places.json')
            ]);

            this.data.world = worldData;
            this.data.items = itemsData;
            this.data.places = placesData;
            
            // 從 character-index.json 加載所有角色詳細資料
            this.data.characters = await this.loadAllCharacters(characterIndex);
            
            // 加載小說章節MD內容
            this.data.novels = await this.loadNovelContents(novelsConfig);
            
            this.loaded = true;

            console.log('所有數據加載完成');
            return this.data;
        } catch (error) {
            console.error('數據加載失敗:', error);
            this.showError('數據加載失敗，請檢查JSON文件格式');
            throw error;
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * 加載所有角色詳細資料
     */
    async loadAllCharacters(characterIndex) {
        const characterPromises = characterIndex.characters.map(async (charMeta) => {
            try {
                const charData = await this.loadJSON(`data/characters/${charMeta.file}`);
                return this.mapCharacterData(charMeta, charData);
            } catch (error) {
                console.warn(`無法加載角色: ${charMeta.file}`, error);
                return this.mapCharacterData(charMeta, {});
            }
        });

        return await Promise.all(characterPromises);
    }

    /**
     * 將新角色數據結構映射為舊格式（保持兼容性）
     */
    mapCharacterData(meta, data) {
        // 從 origin 提取 區域信息
        const region = this.extractRegion(data.origin, meta.id);
        
        // 構建描述文本
        const description = this.buildDescription(data, meta);
        
        // 構建背景故事
        const background = this.buildBackground(data);
        
        // 構建能力列表
        const abilities = this.buildAbilities(data);

        return {
            id: `char_${meta.id}`,
            name: data.name || meta.name,
            title: (data.titles || []).join('、'),
            region: region,
            race: data.race || '人類',
            occupation: (data.identities || []).join('、'),
            image: `images/characters/${meta.id}.png`,
            video: `videos/characters/${meta.id}.mp4`,
            description: description,
            background: background,
            abilities: abilities,
            // 保留原始數據供詳細頁面使用
            _raw: data,
            _meta: meta
        };
    }

    /**
     * 從 origin 提取區域信息
     */
    extractRegion(origin, charId) {
        if (!origin) {
            // 默認區域映射
            const defaults = {
                'elena': '西方→東方',
                'karl': '西方·中央王國',
                'li-xuanji': '東方·蜀山劍派',
                'li-yunfeng': '東方·蜀山劍派',
                'lu-tianxing': '東方·蜀山劍派',
                'merindis': '西方·奧術之塔',
                'su-qingyue': '東方·蜀山劍派',
                'wang-qingfeng': '東方·蜀山劍派',
                'zhang-wuya': '東方·蜀山劍派',
                'zhao-wuji': '東方·蜀山劍派'
            };
            return defaults[charId] || '未知';
        }
        
        if (origin.includes('蜀山') || origin.includes('青城')) {
            return '東方·蜀山劍派';
        } else if (origin.includes('奧術') || origin.includes('中央王國')) {
            return '西方·奧術之塔';
        } else if (origin.includes('精靈')) {
            return '西方·精靈森林';
        }
        return origin;
    }

    /**
     * 構建角色描述
     */
    buildDescription(data, meta) {
        const parts = [];
        
        if (data.core_philosophy) {
            parts.push(`「${data.core_philosophy}」`);
        }
        
        if (data.current_realm) {
            parts.push(`當前境界：${data.current_realm}`);
        }
        
        if (data.personality && data.personality.length > 0) {
            parts.push(`性格：${data.personality.join('、')}`);
        }
        
        return parts.join('。') || `${data.name || meta.name}，${meta.role || '未知角色'}`;
    }

    /**
     * 構建背景故事
     */
    buildBackground(data) {
        if (!data.timeline || data.timeline.length === 0) {
            return '';
        }
        
        return data.timeline.map(t => {
            const year = t.year ? `OE ${t.year}年` : '';
            return `${year} - ${t.event}：${t.description}`;
        }).join('\n\n');
    }

    /**
     * 構建能力列表
     */
    buildAbilities(data) {
        const abilities = [];
        
        // 從魔法天賦構建
        if (data.magic_talents && data.magic_talents.length > 0) {
            data.magic_talents.forEach(talent => {
                abilities.push(`天賦：${talent}`);
            });
        }
        
        // 從功法構建
        if (data.techniques && data.techniques.length > 0) {
            data.techniques.slice(0, 5).forEach(tech => {
                const tier = tech.tier ? `（${tech.tier}）` : '';
                const status = tech.status ? ` - ${tech.status}` : '';
                abilities.push(`功法：${tech.name}${tier}${status}`);
            });
        }
        
        return abilities;
    }

    /**
     * 加載小說章節MD文件內容
     */
    async loadNovelContents(novelsConfig) {
        const novelPromises = novelsConfig.map(async (novel) => {
            try {
                if (novel.filePath) {
                    const content = await this.loadText(novel.filePath);
                    return {
                        ...novel,
                        content: content
                    };
                }
                return novel;
            } catch (error) {
                console.warn(`無法加載小說章節: ${novel.filePath}`, error);
                return {
                    ...novel,
                    content: `# ${novel.title}\n\n> 章節內容加載失敗，請檢查文件路徑是否正確。\n\n文件路徑: ${novel.filePath}`
                };
            }
        });

        return await Promise.all(novelPromises);
    }

    /**
     * 加載單個JSON文件
     */
    async loadJSON(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`無法加載文件: ${url}`);
        }
        return await response.json();
    }

    /**
     * 加載文本文件（MD文件）
     */
    async loadText(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`無法加載文件: ${url}`);
        }
        return await response.text();
    }

    /**
     * 獲取世界觀數據
     */
    getWorldData() {
        return this.data.world;
    }

    /**
     * 獲取人物數據
     */
    getCharacters() {
        return this.data.characters;
    }

    /**
     * 獲取時間綫數據
     */
    getTimelineData() {
        if (!this._timelineCache) {
            this._timelineCache = this.buildTimelineData();
        }
        return this._timelineCache;
    }

    /**
     * 構建時間綫數據
     */
    buildTimelineData() {
        const characters = this.data.characters || [];
        const allEvents = [];

        characters.forEach(char => {
            const raw = char._raw;
            if (raw && raw.timeline && raw.timeline.length > 0) {
                raw.timeline.forEach(event => {
                    allEvents.push({
                        year: event.year,
                        characterId: char.id,
                        characterName: char.name,
                        event: event.event,
                        description: event.description
                    });
                });
            }
        });

        // 按年份排序
        allEvents.sort((a, b) => a.year - b.year);

        return {
            characters: characters.map(c => ({
                id: c.id,
                name: c.name,
                timeline: c._raw?.timeline || []
            })),
            events: allEvents
        };
    }

    /**
     * 獲取物品數據
     */
    getItems() {
        return this.data.items;
    }

    /**
     * 獲取場所數據
     */
    getPlaces() {
        return this.data.places;
    }

    /**
     * 獲取小說數據
     */
    getNovels() {
        return this.data.novels;
    }

    /**
     * 獲取所有小說故事分組
     */
    getAllNovelStories() {
        const storyNames = new Set();
        this.data.novels.forEach(novel => {
            const story = novel.story || novel.volume || '單一故事';
            storyNames.add(story);
        });
        return Array.from(storyNames);
    }

    /**
     * 根據故事分組獲取小說章節
     */
    getNovelsByStory(story) {
        if (!story || story === 'all') {
            return this.data.novels;
        }
        return this.data.novels.filter(novel => {
            const novelStory = novel.story || novel.volume || '單一故事';
            return novelStory === story;
        });
    }

    /**
     * 根據區域篩選人物
     */
    getCharactersByRegion(region) {
        if (!region || region === 'all') {
            return this.data.characters;
        }
        return this.data.characters.filter(char => char.region === region);
    }

    /**
     * 根據類型篩選物品
     */
    getItemsByType(type) {
        if (!type || type === 'all') {
            return this.data.items;
        }
        return this.data.items.filter(item => item.type === type);
    }

    /**
     * 根據區域篩選場所
     */
    getPlacesByFilter(filter) {
        if (!filter || filter === 'all') {
            return this.data.places;
        }
        return this.data.places.filter(place => place.region && place.region.includes(filter));
    }

    /**
     * 獲取所有區域列表
     */
    getAllRegions() {
        const regions = new Set(this.data.characters.map(char => char.region));
        return Array.from(regions).filter(r => r);
    }

    /**
     * 獲取所有物品類型列表
     */
    getAllItemTypes() {
        const types = new Set(this.data.items.map(item => item.type));
        return Array.from(types).filter(t => t);
    }

    /**
     * 獲取所有場所區域列表
     */
    getAllPlaceRegions() {
        const regions = new Set();
        this.data.places.forEach(place => {
            if (place.region) {
                // 提取主要區域，如"東方"或"西方"
                const mainRegion = place.region.startsWith('東方') ? '東方' : 
                                   place.region.startsWith('西方') ? '西方' : place.region;
                regions.add(mainRegion);
            }
        });
        return Array.from(regions).filter(r => r);
    }

    /**
     * 顯示/隱藏加載動畫
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('active', show);
        }
    }

    /**
     * 顯示錯誤信息
     */
    showError(message) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-exclamation-triangle" style="color: #e74c3c;"></i>
                    <p>${message}</p>
                </div>
            `;
            loading.classList.add('active');
        }
    }
}

// 導出數據加載器實例
const dataLoader = new DataLoader();
