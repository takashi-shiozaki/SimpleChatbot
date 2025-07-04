class SimpleChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.userName = '';
        this.userGender = '';
        this.conversationState = 'asking_name'; // 'asking_name', 'asking_gender', 'normal'
        
        this.responses = {
            greetings: [
                'こんにちは！今日はいかがお過ごしですか？',
                'こんにちは！何かお手伝いできることはありますか？',
                'お疲れ様です！何でもお聞きください。'
            ],
            questions: [
                'それは興味深い質問ですね。もう少し詳しく教えていただけますか？',
                'なるほど、そのことについて考えてみますね。',
                'いい質問ですね！私なりの答えをお伝えしますね。'
            ],
            thanks: [
                'どういたしまして！他にも何かありましたらお聞きください。',
                'お役に立てて嬉しいです！',
                'いえいえ、こちらこそありがとうございます。'
            ],
            weather: [
                '今日はいい天気ですね！お出かけ日和です。',
                '天気の話題ですね。私はデジタルなので天気は分かりませんが、外の様子はいかがですか？',
                '天気について聞かれましたが、窓の外を見てみてくださいね。'
            ],
            time: [
                `現在の時刻は ${new Date().toLocaleTimeString('ja-JP')} です。`,
                '時間はあっという間に過ぎますね。',
                '今何時か気になりますよね。'
            ],
            default: [
                'そうですね、とても興味深いお話です。',
                'なるほど、そういう考え方もありますね。',
                'もう少し詳しく教えていただけますか？',
                'それについて、どう思われますか？',
                '面白いトピックですね！',
                '私もそう思います。他にはいかがですか？',
                'そのお話、もっと聞かせてください。',
                'なかなか深いテーマですね。'
            ]
        };
        
        this.init();
    }
    
    init() {
        document.getElementById('initialTime').textContent = this.getCurrentTime();
        
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.updateInitialMessage();
        
        this.messageInput.focus();
    }
    
    updateInitialMessage() {
        const initialMessage = document.querySelector('.bot-message .message-content p');
        if (initialMessage) {
            initialMessage.textContent = 'こんにちは！私はシンプルなチャットボットです。まず、お名前を教えていただけますか？';
        }
    }
    
    getCurrentTime() {
        return new Date().toLocaleTimeString('ja-JP', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        this.addMessage(message, 'user');
        
        this.messageInput.value = '';
        
        this.sendButton.disabled = true;
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.handleConversationFlow(message);
            this.addMessage(response, 'bot');
            this.sendButton.disabled = false;
            this.messageInput.focus();
        }, 1000 + Math.random() * 1000); // 1-2秒のランダムな遅延
    }
    
    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<p>${this.escapeHtml(text)}</p>`;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';
        
        const dotsDiv = document.createElement('div');
        dotsDiv.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            dotsDiv.appendChild(dot);
        }
        
        indicatorDiv.appendChild(dotsDiv);
        typingDiv.appendChild(indicatorDiv);
        
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    handleConversationFlow(message) {
        switch (this.conversationState) {
            case 'asking_name':
                this.userName = message;
                this.conversationState = 'asking_gender';
                return `${this.userName}さん、はじめまして！性別を教えていただけますか？（男性・女性・その他）`;
                
            case 'asking_gender':
                this.userGender = message;
                this.conversationState = 'normal';
                const genderSuffix = this.getGenderSuffix();
                return `${this.userName}${genderSuffix}、ありがとうございます！これからよろしくお願いします。何でもお聞きください。`;
                
            case 'normal':
                return this.generateResponse(message);
                
            default:
                return this.generateResponse(message);
        }
    }
    
    getGenderSuffix() {
        const lowerGender = this.userGender.toLowerCase();
        if (lowerGender.includes('男') || lowerGender.includes('male')) {
            return 'さん';
        } else if (lowerGender.includes('女') || lowerGender.includes('female')) {
            return 'さん';
        } else {
            return 'さん';
        }
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        const namePrefix = this.userName ? `${this.userName}さん、` : '';
        
        if (this.containsAny(lowerMessage, ['こんにちは', 'こんばんは', 'おはよう', 'はじめまして', 'hello', 'hi'])) {
            return namePrefix + this.getRandomResponse('greetings');
        }
        
        if (this.containsAny(lowerMessage, ['ありがとう', 'ありがとうございます', 'サンキュー', 'thanks', 'thank you'])) {
            return namePrefix + this.getRandomResponse('thanks');
        }
        
        if (this.containsAny(lowerMessage, ['天気', '天候', '晴れ', '雨', '曇り', '雪', 'weather'])) {
            return namePrefix + this.getRandomResponse('weather');
        }
        
        if (this.containsAny(lowerMessage, ['時間', '時刻', '何時', 'time', '今'])) {
            return namePrefix + this.getRandomResponse('time');
        }
        
        if (this.containsAny(lowerMessage, ['？', '?', 'どう', 'なぜ', 'なに', '何', 'どこ', 'いつ', 'だれ', '誰'])) {
            return namePrefix + this.getRandomResponse('questions');
        }
        
        return namePrefix + this.getRandomResponse('default');
    }
    
    containsAny(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }
    
    getRandomResponse(category) {
        const responses = this.responses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new SimpleChatbot();
});
