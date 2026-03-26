// ========================================
// PASSWORD CHECKER - password-checker.js
// فاحص كلمة المرور المتقدم مع LocalStorage
// أسبوع الأمن السيبراني 2026
// ========================================

class AdvancedPasswordChecker {
    constructor() {
        this.initElements();
        this.bestPassword = null;
        this.analysisHistory = [];
        this.initEventListeners();
        this.loadSavedData();
        console.log('🔐 Password Checker محمل بنجاح!');
    }

    // 📝 تهيئة العناصر
    initElements() {
        this.input = document.getElementById('passwordInput');
        this.toggleBtn = document.getElementById('togglePassword');
        this.strengthBar = document.getElementById('strengthBar');
        this.strengthLevel = document.getElementById('strengthLevel');
        this.strengthText = document.getElementById('liveStrength');
        this.feedbackContainer = document.getElementById('passwordFeedback');
        this.dynamicTips = document.getElementById('dynamicTips');
        this.generateBtn = document.getElementById('generatePassword');
        this.generatedPassword = document.getElementById('generatedPassword');

        // Requirements
        this.requirements = {
            length: document.getElementById('lengthReq'),
            upper: document.getElementById('upperReq'),
            number: document.getElementById('numberReq'),
            special: document.getElementById('specialReq')
        };
    }

    // 🎛️ الاستماع للأحداث
    initEventListeners() {
        if (this.input) {
            this.input.addEventListener('input', (e) => this.analyzePassword(e.target.value));
            this.input.addEventListener('blur', () => this.saveCurrentAnalysis());
        }

        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleVisibility());
        }

        if (this.generateBtn) {
            this.generateBtn.addEventListener('click', () => this.generateSecurePassword());
        }

        // Enter key لتوليد كلمة مرور
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.generateSecurePassword();
            }
        });
    }

    // 🔍 تحليل كلمة المرور المتقدم
    analyzePassword(password = this.input?.value || '') {
        if (!password) {
            this.clearFeedback();
            return;
        }

        // 6 معايير التقييم
        const analysis = {
            length: password.length >= 14,
            upperCase: /[A-Z\u0640-\u0652]/.test(password), // إنجليزي + عربي كبير
            lowerCase: /[a-z\u0621-\u064A]/.test(password), // إنجليزي + عربي صغير
            numbers: /\d/.test(password),
            symbols: /[!@#$%^&*()_+\-=\$\${};':"\\|,.<>\/?`~]/.test(password),
            diversity: new Set(password).size / password.length > 0.4, // تنوع الحروف
            noCommonWords: !this.checkCommonWords(password),
            entropy: this.calculateEntropy(password)
        };

        // حساب القوة (0-100)
        let strengthScore = 0;
        strengthScore += analysis.length ? 20 : 0;
        strengthScore += analysis.upperCase ? 15 : 0;
        strengthScore += analysis.lowerCase ? 15 : 0;
        strengthScore += analysis.numbers ? 15 : 0;
        strengthScore += analysis.symbols ? 20 : 0;
        strengthScore += analysis.diversity ? 10 : 0;
        strengthScore += analysis.noCommonWords ? 5 : 0;

        const strength = Math.min(strengthScore / 100, 1);
        analysis.strength = strength;

        this.updateUI(analysis, password);
        this.saveAnalysis(analysis, password);
        
        return analysis;
    }

    // 🎨 تحديث الواجهة
    updateUI(analysis, password) {
        // إظهار النتائج
        if (this.feedbackContainer) {
            this.feedbackContainer.style.opacity = '1';
            this.feedbackContainer.style.transform = 'translateY(0)';
        }

        // شريط القوة
        const barWidth = analysis.strength * 100;
        if (this.strengthBar) {
            this.strengthBar.style.width = `${barWidth}%`;
            this.strengthBar.className = `h-full rounded-full transition-all duration-1200 ease-out origin-right 
                ${this.getStrengthClass(analysis.strength)}`;
        }

        // النص + اللون
        if (this.strengthLevel && this.strengthText) {
            const levelData = this.getStrengthLevel(analysis.strength);
            this.strengthLevel.textContent = levelData.text;
            this.strengthText.textContent = levelData.text;
            this.strengthLevel.style.color = levelData.color;
            this.strengthText.style.color = levelData.color;
        }

        // شروط التقييم
        this.updateRequirements(analysis);

        // النصائح الديناميكية
        this.updateTips(analysis, password);

        // Live indicator
        if (this.input) {
            this.input.style.borderColor = this.getStrengthColor(analysis.strength);
        }
    }

    // 📊 شروط التقييم
    updateRequirements(analysis) {
        this.updateRequirement('lengthReq', analysis.length, '12+ حرف', '#10b981');
        this.updateRequirement('upperReq', analysis.upperCase, 'حروف كبيرة', '#3b82f6');
        this.updateRequirement('numberReq', analysis.numbers, 'أرقام', '#f59e0b');
        this.updateRequirement('specialReq', analysis.symbols, 'رموز خاصة', '#8b5cf6');
    }

    updateRequirement(id, passed, label, color) {
        const element = this.requirements[id];
        if (!element) return;

        const container = element.closest('.req-item');
        if (passed) {
            element.innerHTML = '✓';
            element.style.background = color;
            container.style.borderColor = color;
            container.style.transform = 'scale(1.05)';
            container.style.boxShadow = `0 0 20px ${color}40`;
        } else {
            element.innerHTML = '✗';
            element.style.background = '#ef4444';
            container.style.borderColor = '#ef4444';
            container.style.transform = 'scale(1)';
        }
    }

    // 💡 نصائح ديناميكية
    updateTips(analysis, password) {
        const tips = [];

        if (!analysis.length) tips.push('📏 استخدم 14+ حرف للحماية القصوى');
        if (!analysis.upperCase) tips.push('🔠 أضف حروف كبيرة (A B C)');
        if (!analysis.numbers) tips.push('🔢 أضف أرقام (1 2 3 4)');
        if (!analysis.symbols) tips.push('🔣 أضف رموز (! @ # $ %)');
        if (password.length > 50) tips.push('✂️ قلّل الطول لسهولة الاستخدام');
        if (!analysis.diversity) tips.push('🎨 استخدم مزيج متنوع من الحروف');

        if (tips.length === 0) {
            tips.push('🎉 كلمة مرور مثالية! جرب مشاركتها مع الأصدقاء');
        }

        if (this.dynamicTips) {
            this.dynamicTips.innerHTML = tips.map(tip => 
                `<div class="tip-item flex items-center p-6 bg-slate-900/50 backdrop-blur-xl rounded-3xl border-l-4 border-neon-emerald/50 hover:border-neon-emerald hover:scale-105 transition-all duration-300">
                    <i class="fas fa-lightbulb text-yellow-400 text-2xl mr-4 flex-shrink-0"></i>
                    <span class="text-lg leading-relaxed">${tip}</span>
                </div>`
            ).join('');
        }
    }

    // 🌈 مستويات القوة
    getStrengthLevel(strength) {
        if (strength >= 0.95) return { text: 'مثالي 🎉', color: '#059669' };
        if (strength >= 0.8) return { text: 'قوي جداً 👍', color: '#10b981' };
        if (strength >= 0.6) return { text: 'جيد ⚠️', color: '#f59e0b' };
        if (strength >= 0.3) return { text: 'ضعيف 😞', color: '#f87171' };
        return { text: 'خطير! 🚨', color: '#ef4444' };
    }

    getStrengthClass(strength) {
        if (strength >= 0.8) return 'password-perfect';
        if (strength >= 0.6) return 'password-strong';
        if (strength >= 0.3) return 'password-medium';
        return 'password-weak';
    }

    getStrengthColor(strength) {
        return this.getStrengthLevel(strength).color;
    }

    // 🔄 تبديل إظهار/إخفاء
    toggleVisibility() {
        const currentType = this.input.getAttribute('type');
        this.input.setAttribute('type', currentType === 'password' ? 'text' : 'password');
        
        const icon = this.toggleBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    }

    // 🎲 توليد كلمة مرور آمنة
    generateSecurePassword() {
        const charset = {
            upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lower: 'abcdefghijklmnopqrstuvwxyz',
            numbers: '0123456789',
            symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
        };

        let password = '';

        // التأكد من تضمين جميع الأنواع
        password += charset.upper[Math.floor(Math.random() * charset.upper.length)];
        password += charset.lower[Math.floor(Math.random() * charset.lower.length)];
        password += charset.numbers[Math.floor(Math.random() * charset.numbers.length)];
        password += charset.symbols[Math.floor(Math.random() * charset.symbols.length)];

        // إضافة 12 حرف إضافي
        const allChars = charset.upper + charset.lower + charset.numbers + charset.symbols;
        for (let i = 0; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // خلط الحروف
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        // وضعها في الحقل
        if (this.input) {
            this.input.value = password;
            this.input.focus();
            this.input.select();
        }

        // تحليلها فوراً
        this.analyzePassword(password);

        // عرض النتيجة
        if (this.generatedPassword) {
            this.generatedPassword.textContent = `✅ تم إنشاؤها: ${password}`;
            this.generatedPassword.style.opacity = '1';
            this.generatedPassword.style.transform = 'translateY(0) scale(1.02)';
        }

        // نسخ للحافظة
        this.copyToClipboard(password, '✅ تم النسخ تلقائياً!');

        // Feedback مؤقت
        if (this.generateBtn) {
            const originalHTML = this.generateBtn.innerHTML;
            this.generateBtn.innerHTML = '<i class="fas fa-check-circle text-2xl mr-3 animate-pulse"></i>تم النسخ! ✓';
            this.generateBtn.style.background = 'linear-gradient(135deg, #059669, #047857)';
            
            setTimeout(() => {
                this.generateBtn.innerHTML = originalHTML;
                this.generateBtn.style.background = '';
            }, 2500);
        }
    }

    // 📋 نسخ للحافظة مع Feedback
    copyToClipboard(text, message = 'تم النسخ!') {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(message, '#10b981');
        }).catch(err => {
            console.error('فشل النسخ:', err);
            this.showToast('فشل النسخ', '#ef4444');
        });
    }

    showToast(message, color) {
        // إنشاء Toast
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = 'toast fixed top-6 right-6 z-50 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl transform translate-x-full transition-all duration-500';
        toast.style.background = color;
        toast.style.color = 'white';
        toast.style.boxShadow = `0 20px 40px ${color}80`;
        
        document.body.appendChild(toast);
        
        // الرسوم المتحركة
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // إزالة بعد 3 ثوان
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // 💾 حفظ البيانات
    saveAnalysis(analysis, password) {
        this.analysisHistory.unshift({
            strength: analysis.strength,
            length: password.length,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString('ar-SA')
        });

        // آخر 20 تحليل
        localStorage.setItem('passwordAnalysisHistory', 
            JSON.stringify(this.analysisHistory.slice(0, 20))
        );

        // أفضل كلمة مرور
        if (!this.bestPassword || analysis.strength > this.bestPassword.strength) {
            this.bestPassword = {
                masked: password.slice(0, 6) + '...' + password.slice(-3),
                strength: analysis.strength,
                length: password.length,
                date: new Date().toLocaleDateString('ar-SA')
            };
            localStorage.setItem('bestPassword', JSON.stringify(this.bestPassword));
        }
    }

    saveCurrentAnalysis() {
        if (this.input?.value) {
            localStorage.setItem('lastPassword', this.input.value);
        }
    }

    // 📥 تحميل البيانات المحفوظة
    loadSavedData() {
        // آخر كلمة مرور
        const lastPassword = localStorage.getItem('lastPassword');
        if (lastPassword && this.input) {
            this.input.placeholder = `آخر كلمة: ${lastPassword.slice(0, 8)}...`;
        }

        // أفضل كلمة مرور
        const best = localStorage.getItem('bestPassword');
        if (best) {
            this.bestPassword = JSON.parse(best);
            console.log('🏆 أفضل كلمة مرور:', this.bestPassword.masked, 
                        `(${Math.round(this.bestPassword.strength * 100)}%)`);
        }

        // سجل التحليلات
        const history = localStorage.getItem('passwordAnalysisHistory');
        if (history) {
            this.analysisHistory = JSON.parse(history);
            console.log('📊 آخر 5 تحليلات:', this.analysisHistory.slice(0, 5));
        }
    }

    // 🧮 حساب Entropy (معقد)
    calculateEntropy(password) {
        const charsetSize = new Set(password).size;
        return Math.log2(charsetSize) * password.length / 100;
    }

    // 🚫 كلمات شائعة
    checkCommonWords(password) {
        const commonWords = [
            'password', '123456', 'qwerty', 'abc123', 'admin', 
            'salalah', 'oman', 'school', 'test', 'user'
        ];
        return commonWords.some(word => 
            password.toLowerCase().includes(word)
        );
    }

    // 🧹 مسح النتائج
    clearFeedback() {
        if (this.feedbackContainer) {
            this.feedbackContainer.style.opacity = '0';
            this.feedbackContainer.style.transform = 'translateY(20px)';
        }
        if (this.strengthBar) this.strengthBar.style.width = '0%';
        if (this.strengthText) this.strengthText.style.opacity = '0';
    }
}

// ========================================
// INITIALIZE
// ========================================
let passwordChecker;

document.addEventListener('DOMContentLoaded', () => {
    // البحث عن عناصر Password Checker
    const passwordInput = document.getElementById('passwordInput');
    
    if (passwordInput) {
        passwordChecker = new AdvancedPasswordChecker();
        
        // اختصارات لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            // Ctrl+G = Generate Password
            if (e.ctrlKey && e.key === 'g') {
                e.preventDefault();
                passwordChecker.generateSecurePassword();
            }
            
            // Ctrl+C = Copy current password
            if (e.ctrlKey && e.key === 'c' && passwordInput.value) {
                e.preventDefault();
                passwordChecker.copyToClipboard(passwordInput.value);
            }
        });
    }
});

// ========================================
// GLOBAL UTILITIES
// ========================================
window.PasswordCheckerUtils = {
    generateSecure(length = 16) {
        if (passwordChecker) {
            passwordChecker.generateSecurePassword(length);
        }
    },
    
    getBestPassword() {
        return passwordChecker?.bestPassword || null;
    },
    
    getAnalysisHistory() {
        return passwordChecker?.analysisHistory || [];
    }
};

// Export للاستخدام الخارجي
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedPasswordChecker;
}
