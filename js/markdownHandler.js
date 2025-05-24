import { showAlert, showConfirm } from './customDialogs.js';

export class MarkdownHandler {
    constructor(containerElement) {
        this.container = containerElement;
        this.cards = [];
        this.currentZIndex = 1;  // 跟踪最高的 z-index
        this.importCount = 0;    // 添加导入计数器
        this.setupDragAndDrop();
    }

    // 处理文件导入
    async handleFileImport(file) {
        try {
            const content = await this.readFile(file);
            const paragraphs = this.splitIntoParagraphs(content);
            this.createCards(paragraphs);
        } catch (error) {
            console.error('文件处理错误:', error);
            showAlert('文件处理出错，请重试');
        }
    }

    // 读取文件内容
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    // 将文本分割成段落
    splitIntoParagraphs(content) {
        return content.split(/\n\s*\n/).filter(p => p.trim());
    }

    // 创建段落卡片
    createCards(paragraphs) {
        // 检查是否已有卡片
        const existingCards = this.container.querySelectorAll('.paragraph-card');
        const isFirstImport = existingCards.length === 0;
        
        // 计算起始位置
        let startX = 10;  // 默认起始x坐标
        let startY = 10;  // 默认起始y坐标
        
        // 如果不是第一次导入，向右偏移
        if (!isFirstImport) {
            this.importCount++;  // 增加导入计数
            startX = Math.min(
                10 + (this.importCount * 100),  // 每次偏移100px
                this.container.clientWidth - 320   // 不超过容器右边界
            );
        }

        // 创建新卡片
        paragraphs.forEach((text, index) => {
            const card = this.createCard(text);
            card.style.left = `${startX}px`;
            card.style.top = `${startY + index * 160}px`;  // 160是卡片间的垂直间距
        });
    }

    // 创建单个卡片
    createCard(text = '', index = this.cards.length) {
        const card = document.createElement('div');
        card.className = 'paragraph-card';
        card.dataset.editable = 'false';  // 添加编辑状态标记
        card.dataset.cardId = 'text_card_' + Date.now() + '_' + index;
        
        // 添加连接端口（左上角插座）
        const connectionPort = document.createElement('div');
        connectionPort.className = 'text-card-port';
        connectionPort.dataset.cardId = card.dataset.cardId;
        connectionPort.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M 512 256 C 512 114.615112 397.384888 0 256 0 C 114.615105 0 0 114.615112 0 256 C 0 397.384888 114.615105 512 256 512 C 397.384888 512 512 397.384888 512 256 Z M 40 256 C 40 136.706482 136.706497 40 256 40 C 375.293518 40 472 136.706482 472 256 C 472 375.293518 375.293518 472 256 472 C 136.706497 472 40 375.293518 40 256 Z M 255.27803 429.907074 C 159.728485 429.907074 82 352.171173 82 256.629089 C 82 161.086945 159.732193 83.354767 255.27803 83.354767 C 350.816406 83.354767 428.552307 161.086945 428.552307 256.629089 C 428.552307 352.174866 350.816406 429.907074 255.27803 429.907074 Z M 181.997467 230.213196 C 167.426392 230.213196 155.581589 242.061707 155.581589 256.629089 C 155.581589 271.196442 167.426392 283.044922 181.997467 283.044922 C 196.564819 283.044922 208.41333 271.196442 208.41333 256.629089 C 208.41333 242.061707 196.564819 230.213196 181.997467 230.213196 Z M 330.441895 230.213196 C 315.870789 230.213196 304.022308 242.061707 304.022308 256.629089 C 304.022308 271.196442 315.870789 283.044922 330.441895 283.044922 C 345.005524 283.044922 356.857788 271.196442 356.857788 256.629089 C 356.857788 242.061707 345.005524 230.213196 330.441895 230.213196 Z"/>
        </svg>`;
        card.appendChild(connectionPort);
        
        // 添加新的链接端口（左下角插头）
        const chainPort = document.createElement('div');
        chainPort.className = 'text-card-chain-port';
        chainPort.dataset.cardId = card.dataset.cardId;
        chainPort.dataset.portType = 'chain';  // 添加端口类型标记
        chainPort.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M 285.289001 471.220001 L 285.289001 512 L 226.710999 512 L 226.710999 471.220001 L 208.067993 471.220001 C 193.807007 471.220001 182.238998 459.653015 182.238998 445.391998 L 182.238998 369.692993 C 134.914001 348.251007 101.968002 300.639008 101.968002 245.307007 L 101.968002 188.338013 L 101.969002 188.338013 L 101.969002 121.496002 L 158.378006 121.496002 L 158.378006 13.533997 C 158.378006 6.059998 164.431 0 171.904999 0 L 193.526993 0 C 201.001007 0 207.054001 6.059998 207.052994 13.533997 L 207.052994 121.496002 L 304.945007 121.496002 L 304.945007 13.533997 C 304.945007 6.059998 311.005005 0 318.471985 0 L 340.10199 0 C 347.569 0 353.622009 6.059998 353.622009 13.533997 L 353.622009 121.496002 L 410.032013 121.496002 L 410.032013 203.458008 L 410.031006 203.458008 L 410.031006 245.307007 C 410.031006 300.639008 377.09201 348.252014 329.76001 369.692993 L 329.76001 445.391998 C 329.76001 459.653015 318.199005 471.220001 303.931 471.220001 L 285.289001 471.220001 Z"/>
        </svg>`;
        card.appendChild(chainPort);
        
        // 添加删除按钮
        const actions = document.createElement('div');
        actions.className = 'card-actions';
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            showConfirm('确定要删除这个卡片吗？').then((confirmed) => {
                if (confirmed) {
                    // 删除指向该卡片的连接
                    const cardId = card.dataset.cardId;
                    if (window.connectionManager) {
                        // 删除蓝色插座的连接（包括来自提示词卡片和其他文本卡片的连接）
                        const textCardPort = card.querySelector('.text-card-port');
                        if (textCardPort) {
                            window.connectionManager.removePortConnection(textCardPort);
                        }
                        
                        // 删除紫色插头的连接（该卡片发起的链式连接）
                        const chainPort = card.querySelector('.text-card-chain-port');
                        if (chainPort) {
                            window.connectionManager.removePortConnection(chainPort);
                        }
                        
                        // 删除指向该卡片的所有连接
                        window.connectionManager.connections.forEach((connection, connectionId) => {
                            if (connection.endPort.closest('.paragraph-card')?.dataset.cardId === cardId) {
                                window.connectionManager.removePortConnection(connection.startPort);
                            }
                        });
                    }
                    
                    card.remove();
                    this.cards = this.cards.filter(c => c !== card);
                }
            });
        };
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
        
        // 添加内容区域
        const content = document.createElement('div');
        content.className = 'card-content';
        content.contentEditable = 'false';
        content.textContent = text;
        
        // 双击启用编辑
        content.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            content.contentEditable = 'true';
            card.dataset.editable = 'true';
            card.style.cursor = 'text';
            content.focus();
        });
        
        // 失去焦点时保存
        content.addEventListener('blur', () => {
            content.contentEditable = 'false';
            card.dataset.editable = 'false';
            card.style.cursor = 'move';
        });
        
        // 按下回车时保存（避免换行）
        content.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                content.blur();
            }
        });
        
        card.appendChild(content);
        
        card.style.position = 'absolute';
        // 位置将由 createCards 方法设置
        card.style.zIndex = this.currentZIndex++;
        
        this.cards.push(card);
        this.container.appendChild(card);
        return card;
    }

    // 设置拖拽功能
    setupDragAndDrop() {
        let draggedCard = null;
        let initialMouseX = 0;
        let initialMouseY = 0;
        let initialCardX = 0;
        let initialCardY = 0;

        // 鼠标按下时
        const mouseDown = (e) => {
            // 如果点击的是链接端口或调整大小的区域，不启动卡片拖拽
            if (e.target.closest('.text-card-chain-port') || 
                (e.offsetX >= e.target.clientWidth - 20 && e.offsetY >= e.target.clientHeight - 20)) {
                return;
            }

            const card = e.target.closest('.paragraph-card');
            if (!card || card.dataset.editable === 'true') return;  // 编辑状态下不允许拖拽

            draggedCard = card;
            draggedCard.style.transition = 'none';
            
            // 记录初始状态
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            initialCardX = parseInt(card.style.left) || 0;
            initialCardY = parseInt(card.style.top) || 0;
            
            // 提升卡片层级
            this.currentZIndex++;
            card.style.zIndex = this.currentZIndex;
            
            // 阻止默认事件和冒泡
            e.preventDefault();
            e.stopPropagation();
        };

        // 鼠标移动时
        const mouseMove = (e) => {
            if (!draggedCard) return;
            e.preventDefault();

            // 计算鼠标移动的距离
            const deltaX = e.clientX - initialMouseX;
            const deltaY = e.clientY - initialMouseY;

            // 直接设置新位置
            draggedCard.style.left = `${initialCardX + deltaX}px`;
            draggedCard.style.top = `${initialCardY + deltaY}px`;

            // 更新连接线
            window.connectionManager?.updateConnections();
        };

        // 鼠标松开时
        const mouseUp = () => {
            if (draggedCard) {
                // 获取容器的位置信息
                const containerRect = this.container.getBoundingClientRect();

                // 获取卡片的当前位置信息
                const cardRect = draggedCard.getBoundingClientRect();

                // 确保卡片在容器范围内
                let newX = parseInt(draggedCard.style.left) || 0;
                let newY = parseInt(draggedCard.style.top) || 0;

                // 检查左边范围
                if (newX < 0) {
                    newX = 0;
                }

                // 检查上边范围
                if (newY < 0) {
                    newY = 0;
                }

                // 更新卡片位置
                draggedCard.style.left = `${newX}px`;
                draggedCard.style.top = `${newY}px`;

                // 恢复过渡效果
                draggedCard.style.transition = '';
                draggedCard = null;
            }
        };

        // 添加事件监听
        this.container.addEventListener('mousedown', mouseDown, { passive: false });
        document.addEventListener('mousemove', mouseMove, { passive: false });
        document.addEventListener('mouseup', mouseUp);
    }

    // 获取当前排序后的文本
    getCurrentText() {
        return [...this.container.querySelectorAll('.paragraph-card')]
            .map(card => card.textContent)
            .join('\n\n');
    }

    // 添加新卡片
    addNewCard(e) {
        const newCard = this.createCard('', this.cards.length);
        
        // 获取容器的位置信息
        const containerRect = this.container.getBoundingClientRect();
        
        // 计算鼠标相对于容器的位置
        const relativeX = e.clientX - containerRect.left;
        const relativeY = e.clientY - containerRect.top;
        
        // 设置新卡片位置，稍微偏移一点，避免完全遮盖按钮
        newCard.style.left = `${relativeX - 150}px`;  // 向左偏移卡片宽度的一半
        newCard.style.top = `${relativeY - 75}px`;   // 向上偏移卡片高度的一半
        
        // 确保新卡片在视图内
        const maxX = containerRect.width - 300;  // 卡片宽度
        const maxY = containerRect.height - 150; // 卡片高度
        
        newCard.style.left = `${Math.max(0, Math.min(parseInt(newCard.style.left), maxX))}px`;
        newCard.style.top = `${Math.max(0, Math.min(parseInt(newCard.style.top), maxY))}px`;
    }

    // 初始化事件监听
    init() {
        // 添加新建卡片按钮事件
        const addButton = document.getElementById('add-paragraph');
        if (addButton) {
            addButton.addEventListener('click', (e) => this.addNewCard(e));
        }
    }
} 