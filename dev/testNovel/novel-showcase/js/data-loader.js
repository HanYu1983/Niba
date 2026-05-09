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
            const [worldData, charactersData, itemsData, novelsConfig, placesData] = await Promise.all([
                this.loadJSON('data/world.json'),
                this.loadJSON('data/characters.json'),
                this.loadJSON('data/items.json'),
                this.loadJSON('data/novels.json'),
                this.loadJSON('data/places.json')
            ]);

            this.data.world = worldData;
            this.data.characters = charactersData;
            this.data.items = itemsData;
            this.data.places = placesData;
            
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
