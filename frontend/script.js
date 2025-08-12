class BloodSugarAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.userId = this.generateUserId();
        
        this.initializeEventListeners();
        this.updateDateTime();
    }

    generateUserId() {
        let userId = localStorage.getItem('bloodSugarUserId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('bloodSugarUserId', userId);
        }
        return userId;
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.messageInput.value = question;
                this.sendMessage();
            });
        });

        this.messageInput.addEventListener('input', () => {
            this.adjustTextareaHeight();
        });
    }

    adjustTextareaHeight() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addUserMessage(message);
        this.messageInput.value = '';
        this.adjustTextareaHeight();
        this.setInputLoading(true);
        
        // 显示思考状态
        const typingIndicator = this.showTypingIndicator();

        try {
            await this.callStreamAPI(message, typingIndicator);
        } catch (error) {
            console.error('发送消息失败:', error);
            this.removeTypingIndicator(typingIndicator);
            this.addErrorMessage('抱歉，我现在无法回复您的消息，请稍后再试。');
        } finally {
            this.setInputLoading(false);
        }
    }

    async callStreamAPI(message, typingIndicator) {
        const response = await fetch('/api/chat/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: this.userId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // 移除思考指示器并创建助手消息容器
        this.removeTypingIndicator(typingIndicator);
        const messageDiv = this.createAssistantMessageContainer();
        const contentDiv = messageDiv.querySelector('.message-content');
        
        let buffer = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                
                // 保留最后一个可能不完整的行
                buffer = lines.pop();
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            if (data.type === 'message') {
                                contentDiv.innerHTML += this.formatText(data.content);
                                this.scrollToBottom();
                            } else if (data.type === 'buttons') {
                                // 添加交互按钮
                                this.addInteractionButtons(messageDiv, data.buttons);
                                this.scrollToBottom();
                            } else if (data.type === 'error') {
                                this.addErrorMessage(data.content);
                                return;
                            } else if (data.type === 'done') {
                                // 添加时间戳
                                const timeSpan = messageDiv.querySelector('.message-time');
                                timeSpan.textContent = this.getCurrentTime();
                                return;
                            }
                        } catch (e) {
                            console.error('解析SSE数据失败:', e);
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }

    createAssistantMessageContainer() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.innerHTML = `
            <div class="message-content"></div>
            <div class="interaction-buttons"></div>
            <span class="message-time"></span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    addInteractionButtons(messageDiv, buttons) {
        const buttonsContainer = messageDiv.querySelector('.interaction-buttons');
        buttonsContainer.innerHTML = '';
        
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.className = `interaction-btn ${button.type || ''}`;
            btn.textContent = button.text;
            btn.onclick = () => {
                // 移除所有交互按钮
                document.querySelectorAll('.interaction-buttons').forEach(container => {
                    container.innerHTML = '';
                });
                
                // 发送用户选择
                this.handleInteractionChoice(button.action, button.text);
            };
            buttonsContainer.appendChild(btn);
        });
    }

    async handleInteractionChoice(action, choiceText) {
        // 添加用户选择消息
        this.addUserMessage(`${choiceText}`);
        
        // 根据action执行相应操作
        this.setInputLoading(true);
        const typingIndicator = this.showTypingIndicator();

        try {
            await this.callStreamAPI(`用户选择：${action}`, typingIndicator);
        } catch (error) {
            console.error('处理交互选择失败:', error);
            this.removeTypingIndicator(typingIndicator);
            this.addErrorMessage('抱歉，处理您的选择时出现问题，请稍后再试。');
        } finally {
            this.setInputLoading(false);
        }
    }

    async callAPI(message) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                userId: this.userId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    }

    addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                ${this.escapeHtml(message)}
            </div>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addAssistantMessage(response) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        
        let content = '';
        if (response.emotional) {
            content += `<div class="emotional">${this.escapeHtml(response.emotional)}</div>`;
        }
        if (response.knowledge) {
            content += `<div class="knowledge">${this.formatText(response.knowledge)}</div>`;
        }
        if (response.advice) {
            content += `<div class="advice">${this.formatText(response.advice)}</div>`;
        }
        if (response.followUp) {
            content += `<div class="follow-up">${this.escapeHtml(response.followUp)}</div>`;
        }

        messageDiv.innerHTML = `
            <div class="message-content">
                ${content}
            </div>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addErrorMessage(error) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="emotional" style="color: #dc3545; border-left-color: #dc3545; background: rgba(220, 53, 69, 0.1);">
                    ${this.escapeHtml(error)}
                </div>
            </div>
            <span class="message-time">${this.getCurrentTime()}</span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatText(text) {
        // 先处理markdown格式，再进行HTML转义
        return text
            // 处理加粗格式 **文字**
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // 处理斜体格式 *文字*（可选）
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            // 转义HTML特殊字符，但保留我们添加的标签
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            // 恢复我们的HTML标签
            .replace(/&lt;strong&gt;/g, '<strong>')
            .replace(/&lt;\/strong&gt;/g, '</strong>')
            .replace(/&lt;em&gt;/g, '<em>')
            .replace(/&lt;\/em&gt;/g, '</em>')
            // 处理换行
            .replace(/\n/g, '<br>')
            // 处理数字列点
            .replace(/^(\d+\.\s)/gm, '<strong>$1</strong>')
            // 处理破折号列点
            .replace(/^(-\s)/gm, '&nbsp;&nbsp;<strong>•</strong> ')
            // 处理圆点列点
            .replace(/•/g, '<strong>•</strong>')
            // 处理多个连续换行，转换为段落间距
            .replace(/(<br>\s*){2,}/g, '<br><br>');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString('zh-CN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    updateDateTime() {
        const welcomeTime = document.querySelector('.assistant-message .message-time');
        if (welcomeTime && !welcomeTime.textContent) {
            welcomeTime.textContent = this.getCurrentTime();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    setInputLoading(loading) {
        this.sendButton.disabled = loading;
        this.messageInput.disabled = loading;
        
        if (loading) {
            this.sendButton.innerHTML = `
                <div class="loading-spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>
                <span>发送中...</span>
            `;
        } else {
            this.sendButton.innerHTML = `
                <span>发送</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22,2 15,22 11,13 2,9"></polygon>
                </svg>
            `;
        }
    }

    showTypingIndicator() {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant-message typing-indicator';
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
            </div>
            <span class="message-time"></span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    removeTypingIndicator(indicator) {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BloodSugarAssistant();
});

window.addEventListener('beforeunload', () => {
    localStorage.setItem('lastVisit', new Date().toISOString());
});